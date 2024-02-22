// importing libraries
import { Text, View, Dimensions, TouchableOpacity, SafeAreaView, FlatList, ScrollView, Alert } from 'react-native';
import React from 'react';
import { Header, Avatar } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar';
import { addDoc, collection, doc, getDocs, onSnapshot} from "firebase/firestore";
import { db } from '../../config'
import { TextInput } from 'react-native-paper';
import moment from 'moment';
import emailjs from '@emailjs/browser';

// gets dimensions from the screen
const { width, height } = Dimensions.get('window')


export class ParentViewTeacher extends React.Component {


  constructor() {
    super();
    // sets intial states
    this.state = {
      timings: ["9:00", "9:10", "9:20", "9:30", "9:40", "9:50", "10:00", "10:10", "10:20", "10:30", "10:40", "10:50", "11:00", "11:10", "11:20", "11:30", "11:40", "11:50", "12:00", "12:10", "12:20", "12:30", "12:40", "12:50", "1:00", "1:10", "1:20", "1:30", "1:40", "1:50", "2:00", "2:10", "2:20", "2:30", "2:40", "2:50", "3:00"],
      selectedSlot: null,
      todayEventName: '',
      todayEventDate: '',
      todayEventId: '',
      currentDate: '',
      slot: null,
      studentClass: '',
      studentName: '',
      availableTimings: null,
      meetingLink: ''
    }
  }

  async componentDidMount() {
    var d = moment().utcOffset('+05:30').format('MMM DD YYYY')

    this.setState({
      currentDate: d
    })

    // gets data from firebase
    const querySnapshot = await getDocs(collection(db, "events"))
    querySnapshot.forEach((doc) => {
      string = doc.data().eventDate
      dateFormat = string.toDate() + 1
      properDate = dateFormat.substring(4, 15)

      if (this.state.currentDate == properDate) {
        this.setState({ todayEventName: doc.data().eventName, todayEventDate: properDate, todayEventId: doc.id })
      }
    })

      
    const dan = []
    const q = await getDocs(collection(db, 'events', this.state.todayEventId, this.props.route.params.teacher_email))
    q.forEach((doc) => {
      string = doc.data().time
      dan.push(string)
    })

    dat = []
    dat = this.state.timings

    res = await dat.filter(item => !dan.includes(item))

    await this.setState({availableTimings: res})
   

    await onSnapshot(doc(db, 'teachers', this.props.route.params.teacher_email), (doc) => {
      this.setState({meetingLink: doc.data().meetingLink})
    })

  }

  render() {

    // props from other screens
    const { navigation, route } = this.props
    const { teacher_name, teacher_email, teacher_picture, teacher_subject, teacher_teaches, email, picture, firstName, name } = route.params



    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* status bar component */}
        <StatusBar style='auto' backgroundColor='#99EDE3' />

        <View style={{ flex: 0.5 }}>
        {/* header component */}
          <Header
            centerComponent={{
              text: "View Teacher",
              style: { fontWeight: 'bold', fontSize: 30, color: 'black' }
            }}
            backgroundColor="#99EDE3"
          />
        </View>

        <View style={{flex: 0.7 ,justifyContent: 'center', alignItems: 'center' }}>
          <Avatar rounded size={'xlarge'} source={{ uri: teacher_picture }} />
          <Text style={{ fontSize: 25, fontWeight: 'bold', margin: 10 }} >{teacher_name}</Text>
        </View>

        <View style={{ justifyContent: 'center', marginLeft: 10, alignItems: 'center', marginTop: 20 }} >
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Subject: {teacher_subject}</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Teaches: {teacher_teaches}</Text>
        </View>

                {/* text input component */}
                      <TextInput
                        placeholder='Name of the Student'

                        outlineColor='#99EDE3'
                        style={{
                          height: height / 18,
                          width: width/1.5,
                          justifyContent: 'center',
                          marginTop: height / 40,
                          alignSelf: 'center'
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
                        style={{
                          height: height / 18,
                          width: width/1.5,
                          justifyContent: 'center',
                          marginTop: 10,
                          alignSelf: 'center'

                        }}
                        mode='outlined'

                        outlineStyle={{
                          borderRadius: 50,
                          borderWidth: 2
                        }}

                        onChangeText={(text) => this.setState({ studentClass: text })}
                      />

                      {/* flatist component */}
                      <FlatList
                        style = {{
                          marginTop: 10,
                          flex: 0.2,
                          alignSelf: 'center',
                        }}
                        data={this.state.availableTimings}
                        horizontal = {false}
                        numColumns={4}
                        renderItem={({ index}) => {
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
                              onPress={() => {
                                this.setState({
                                  selectedSlot: index,
                                  slot: this.state.timings[index]
                                })
                              }}

                              
                            >
                            <Text style={{ fontSize: this.state.selectedSlot == index ? 20 : 15, fontWeight: 'bold', alignSelf: 'center' }} >{this.state.availableTimings[index]}</Text>
                            </TouchableOpacity>
                          )
                        }}
                      />

                      <TouchableOpacity 
                        style={{
                        width: width/2,
                        backgroundColor: '#99EDE3',
                        height: height / 20,
                        borderRadius: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 20,
                        marginBottom: 20,
                        alignSelf: 'center',
                       }}
                      
                        onPress={async () => {
                          // send emails
                          emailjs.send("service_ut2nueg","template_fs5b78h",{
                            to_name: name,
                            from_name: "MIT",
                            message: `Dear Parent, Your booking is confirmed with ${teacher_name} at ${this.state.slot}. The meeting link is ${this.state.meetingLink}.`,
                            to_email: email
                            }, "c_Q8Ye4VrwSFogXQG") 
                            .then((result) => {
                                console.log(result.text);
                            }, (error) => {
                                console.log(error.text);
                            });
                            // adds data to firebase
                          const docRef = collection(db, 'events', this.state.todayEventId, teacher_email)
                          if(this.state.studentName || this.state.studentClass !== ''){
                          await addDoc(docRef, {
                            teacherName: teacher_name,
                            parentName: name,
                            parentEmail: email,
                            time: this.state.slot,
                            teacherEmail: teacher_email,
                            studentName: this.state.studentName,
                            studentClass: this.state.studentClass,
                            meetingLink: this.state.meetingLink
              })
                        // sets state
                          .then(() => {
                           this.setState({
                            selectedSlot: null,
                           })

                          // navigates to other screen
                           navigation.navigate('Parent_View_Event', {
                             email: email,
                              picture: picture,
                              firstName: firstName,
                              name: name,
                           })
                        
                })
                          }
                          else{
                            Alert.alert("Please enter appropriate student name and class")
                          }
                        }}
                       >
                        
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>BOOK</Text>
                      </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

export default ParentViewTeacher