import { Text, View, Dimensions, TouchableOpacity, SafeAreaView, FlatList, ScrollView} from 'react-native';
import React from 'react';
import { Header, Card, Avatar } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from '../../config';
import Modal from "react-native-modal";
import moment from 'moment';
import { TextInput } from 'react-native-paper';
import RNSmtpMailer from "react-native-smtp-mailer";

const { width, height } = Dimensions.get('window')

export class ParentViewEvent extends React.Component {

  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      todayEventName: '',
      todayEventDate: '',
      todayEventId: '',
      currentDate: '',
      teachersData: null,
      selectedTeacher: '',
      data: ["9:00", "9:10", "9:20", "9:30", "9:40", "9:50", "10:00", "10:10", "10:20", "10:30", "10:40", "10:50", "11:00", "11:10", "11:20", "11:30", "11:40", "11:50", "12:00", "12:10", "12:20", "12:30", "12:40", "12:50", "1:40", "1:50", "2:00", "2:10", "2:20", "2:30", "2:40", "2:50", "3:00"],
      slot: null,
      selectedSlot: null,
      bookedTimings: [],
      currentDate: '',
      studentName: '',
      studentClass: ''
    }
  }

  
  //to get teachers data from firebase

  async componentDidMount() {

      var d = moment().utcOffset('+05:30').format('MMM DD YYYY')
      this.setState({
        currentDate: d
        })


      const querySnapshot = await getDocs(collection(db, "events"))
        querySnapshot.forEach((doc) => {
            string = doc.data().eventDate
            dateFormat = string.toDate() + 1
            properDate = dateFormat.substring(4, 15)

            if (this.state.currentDate == properDate) {
                this.setState({ todayEventName: doc.data().eventName, todayEventDate: properDate, todayEventId: doc.id })
            }
        })

      const data = []

      const query = await getDocs(collection(db, "teachers"));
      query.forEach((doc) => {
        d = doc.data()
        data.push(d)
      })

  
      this.setState({
        teachersData: data,
      })

      const quer = await getDocs(collection(db, 'events'))
      quer.forEach((doc) => {
        string = doc.data().eventDate
        dateFormat = string.toDate() + 1
        properDate = dateFormat.substring(4, 15)

        if (this.state.currentDate == properDate) {
        this.setState({ todayEventName: doc.data().eventName, todayEventDate: properDate, todayEventId: doc.id })
      }
      })

      const dat = []

      const q = await getDocs(collection(db, "events", this.state.todayEventId, this.state.selectedTeacher.email))
      q.forEach((doc) => {
      string = doc.data().time
      dat.push(string)

      const filterData = this.state.data.filter(el => dat.some(it => it == el))
      this.setState({ bookedTimings: filterData })
    })
  }


  sendMail = () => {
    RNSmtpMailer.sendMail({
      mailhost: "smtp.gmail.com",
      port: "465",
      ssl: true,
      username: "siddhantpallod@gmail.com",
      password: "",
      recipients: "TOEMAIL",
      subject: "Meeting",
      htmlBody: "<h1>header</h1><p>body</p>",
  //     attachmentPaths: [
  //       RNFS.ExternalDirectoryPath + "/image.jpg",
  //       RNFS.DocumentDirectoryPath + "/test.txt",
  //       RNFS.DocumentDirectoryPath + "/test2.csv",
  //       RNFS.DocumentDirectoryPath + "/pdfFile.pdf",
  //       RNFS.DocumentDirectoryPath + "/zipFile.zip",
  //       RNFS.DocumentDirectoryPath + "/image.png"
  // ], // optional
  //     attachmentNames: [
  //       "image.jpg",
  //       "firstFile.txt",
  //       "secondFile.csv",
  //       "pdfFile.pdf",
  //       "zipExample.zip",
  //       "pngImage.png"
      // ], // required in android, these are renames of original files. in ios filenames will be same as specified in path. In a ios-only application, no need to define it
        })

    .then(success => console.log(success))
    .catch(err => console.log(err))
  }


  render() {

    const { navigation, route } = this.props
    const { email, name, picture, firstName } = route.params


    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar style='auto' backgroundColor='#99EDE3' />

        <View style={{ flex: 0.2 }}>
          <Header
            centerComponent={{
              text: "View Event",
              style: { fontWeight: 'bold', fontSize: 30, color: 'black' }
            }}

            backgroundColor="#99EDE3"
          />

        </View>

        <View style={{ alignItems: 'center', flex: 0.3 }}>

          <Image
            source={require('../../assets/createEvent.png')}
            contentFit="cover"
            style={{
              width: width,
              height: height / 3.5,
              backgroundColor: '#0553',
              justifyContent: 'center',
              alignSelf: 'center',
            }}

          />


        </View>


        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
          <ScrollView>
          

            {this.state.teachersData?.map((item) => (
              <View key={item.id}>
                <TouchableOpacity style={{ backgroundColor: '#99EDE3', width: width / 1.09, height: height / 8, borderRadius: 30, margin: 10, justifyContent: 'center', alignItems: 'center' }}

                  onPress={(i) => {
                    this.setState({isModalVisible: true, selectedTeacher: item})}}>

                  <View style={{ alignSelf: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Avatar rounded source={{ uri: item.picture }} size={'medium'} containerStyle={{ alignSelf: 'center', justifyContent: 'flex-start', margin: 10 }} />
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Teacher Name: {item.name}</Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Subject: {item.subject}</Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Teaches: {item.teaches}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <View>
                    <Modal backdropTransitionInTiming={0} backdropTransitionOutTiming={0} onBackdropPress={() => this.setState({isModalVisible: false})} onBackButtonPress={() => this.setState({isModalVisible: false})} deviceWidth={width}  deviceHeight={height} coverScreen = {true} isVisible = {this.state.isModalVisible} animationIn={'slideInUp'} animationInTiming={400} animationOut={'slideOutDown'} animationOutTiming={400}>
                    <View style = {{backgroundColor: '#99EDE3', flex : 0.8, justifyContent: 'center', alignItems: 'center'}}>
                      <TouchableOpacity style = {{ right: 0 ,alignItems: 'flex-end', justifyContent: 'flex-start'}} onPress={() => this.setState({isModalVisible: false})}>
                        <Text>Close</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style = {{ right: 0, alignItems: 'flex-end', justifyContent: 'flex-start'}} onPress={() => this.sendMail()}>
                        <Text>Mail Me</Text>
                      </TouchableOpacity>
                      
                      <Avatar rounded source={{ uri: this.state.selectedTeacher.picture }} size={'large'} containerStyle={{ alignSelf: 'center', justifyContent: 'flex-start', margin: 10 }} />
                      <Text style = {{fontSize: 30, marginTop: 10}}>{this.state.selectedTeacher.name}</Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Subject: {this.state.selectedTeacher.subject}</Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Teaches: {this.state.selectedTeacher.teaches}</Text>

                      <TextInput
                        placeholder='Name of the Student'

                        outlineColor='#99EDE3'
                        // activeOutlineColor='#99EDE3'
                        style={{
                          height: height / 18,
                          width: width/1.5,
                          justifyContent: 'center',
                          marginTop: height / 40
                        }}
                        mode='outlined'

                        outlineStyle={{
                          borderRadius: 50,
                          borderWidth: 2
                        }}

                        onChangeText={(text) => this.setState({ studentName: text })}
                      />

                      <TextInput
                        placeholder='Class of the Student'

                        outlineColor='#99EDE3'
                        // activeOutlineColor='#99EDE3'
                        style={{
                          height: height / 18,
                          width: width/1.5,
                          justifyContent: 'center',
                          marginTop: 10
                        }}
                        mode='outlined'

                        outlineStyle={{
                          borderRadius: 50,
                          borderWidth: 2
                        }}

                        onChangeText={(text) => this.setState({ studentClass: text })}
                      />


                      <FlatList
                        style = {{
                          marginTop: 15
                        }}
                        data={this.state.data}
                        horizontal = {false}
                        numColumns={4}
                        renderItem={({item, index}) => {
                          return(
                            <TouchableOpacity
                              style={{
                                margin: 10,
                                backgroundColor: 'white',
                                borderRadius: 10,
                                width: width/6,
                                height: height/20,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: this.state.selectedSlot == index ? 3: 1
                              }}
                              key={index}
                              onPress={() => {
                                this.setState({
                                  selectedSlot: index,
                                  slot: this.state.data[index]
                                })
                              }}
                            >
                            <Text style={{ fontSize: this.state.selectedSlot == index ? 20 : 15, fontWeight: 'bold', alignSelf: 'center' }} >{this.state.data[index]}</Text>
                            </TouchableOpacity>
                          )
                        }}
                      />

                      <TouchableOpacity 
                        style={{
                        width: width/2,
                        backgroundColor: 'white',
                        height: height / 20,
                        borderRadius: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 20
                       }}
                      
                        onPress={async () => {
                          const docRef = collection(db, 'events', this.state.todayEventId, this.state.selectedTeacher.email)
                          await addDoc(docRef, {
                            teacherName: this.state.selectedTeacher.name,
                            parentName: name,
                            parentEmail: email,
                            time: this.state.slot,
                            teacherEmail: this.state.selectedTeacher.email,
                            studentName: this.state.studentName,
                            studentClass: this.state.studentClass
              })
                          .then(() => {
                           
                           this.setState({
                            isModalVisible: false
                           })
                })
                        }}
                       >
                      
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>BOOK</Text>
                      </TouchableOpacity>
                    </View>
                    </Modal>
                  </View>

              </View>
            ))}
          </ScrollView>
        </View>

      </SafeAreaView>
    )
  }
}

export default ParentViewEvent;