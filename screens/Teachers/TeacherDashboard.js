// Importing libraries
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, Modal, TextInput } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Avatar } from 'react-native-elements';
import moment from 'moment';
import { collection, getDocs, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from '../../config'

// fetches height and width of the screen
const { width, height } = Dimensions.get('window')


export class TeacherDashboard extends React.Component {

  constructor() {
    super()
    // sets default states
    this.state = {
      currentDate: '',
      todayEvent: false,
      pastEvents: false,
      todayEventName: '',
      todayEventDate: '',
      todayEventId: '',
      pastEventName: '',
      pastEventDate: '',
      isModalVisible: false,
      newMeetingLink: '',
      alreadyMeetingLink: ''
    }
  }

// calls itself once the component is mounted
  async componentDidMount() {

    // fetches the current date
    var d = moment().utcOffset('+05:30').format('MMM DD YYYY')

    // sets state
    this.setState({
      currentDate: d
    })

    // fetches data from firebase
    const querySnapshot = await getDocs(collection(db, "events"))
    querySnapshot.forEach((doc) => {
      string = doc.data().eventDate
      
      dateFormat = string.toDate() + 1
      properDate = dateFormat.substring(4, 15)
      console.log(properDate)

     if (this.state.currentDate == properDate) {
                this.setState({ todayEventName: doc.data().eventName, todayEventDate: properDate, todayEventId: doc.id, todayEvent: true })
            }

      if (this.state.currentDate > properDate) {
        this.setState({ pastEvents: true, pastEventName: doc.data().eventName, pastEventDate: properDate })
      }

    })

      console.log(this.state.todayEvent)

    onSnapshot(doc(db, 'teachers', this.props.route.params.email), (doc) => {
      this.setState({alreadyMeetingLink: doc.data().meetingLink})
    })

  }

  // renders components on screen
  render() {

    // props from other screens
    const { navigation, route } = this.props
    const { email, name, picture, firstName } = route.params


    return (
      <SafeAreaView>
        {/* Status bar component */}
        <StatusBar style='auto' backgroundColor='#99EDE3' />
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#99EDE3', width: width, justifyContent: "center", height: height / 3, alignItems: 'center', marginTop: height / 3 }}>
            {/* Avatar component */}
              <Avatar
                rounded
                source={{ uri: picture }}
                size={'large'}
                containerStyle={{ borderRadius: 10 }}
              />
              
              <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 20 }}>Welcome {firstName}!</Text>
              <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 20 }}>Meeting Link: {this.state.alreadyMeetingLink}</Text>
              <TouchableOpacity style = {{right: 0, backgroundColor: 'white', borderRadius: 50, width: 130, marginTop: 20}}
                onPress={() => {
                  this.setState({ isModalVisible: true });
                }}
              >
                <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize:15,}}>Change Link</Text>

                <Modal visible = {this.state.isModalVisible} animationType='slide' onRequestClose={() => this.setState({ isModalVisible: false})}>
                  <Text style = {{alignSelf: 'center', fontWeight: 'bold', fontSize:30}}>Change Link</Text>
                  <TextInput
                    style = {{textAlign: 'center' ,alignSelf: 'center', width: width/1.5, height: height/12, marginTop: 30, borderWidth: 2, borderRadius: 50}}
                    placeholder='Google Meet Link'
                    onChangeText={(e) => this.setState({newMeetingLink: e})}
                    keyboardType='url'
                  />
                  <TouchableOpacity onPress={async() => {
                    
                    const docRef = doc(db, 'teachers', email)
                           await updateDoc(docRef, {
                           meetingLink: this.state.newMeetingLink
              })
                          .then(() => {
                           this.setState({
                            // sets modal to invisible
                            isModalVisible: false,
                           })
                })  
                    
                  }} style = {{justifyContent: 'center',marginTop: 50 , alignSelf: 'center', width: width/1.5, height: height/12, backgroundColor: '#99EDE3', borderRadius: 50}}>
                    <Text style = {{alignSelf: 'center', fontSize:15, fontWeight: 'bold'}}>Save</Text>
                  </TouchableOpacity>
                </Modal>
              </TouchableOpacity>
            </View>
          </View>


          <Text style={{ fontWeight: "bold", fontSize: 25, alignSelf: 'center', marginTop: height / 2.4 }}>Ongoing Events</Text>

          {this.state.todayEvent ?
            <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity style={{
                width: width / 1.2,
                backgroundColor: '#99EDE3',
                height: height / 14,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: height / 10
              }}
                onPress={() =>
                // navigates to other screen
                 navigation.navigate('Teacher_View_Event', {
                    email: email,
                    name: name,
                    picture: picture,
                    firstName: firstName
                })}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Name: {this.state.todayEventName}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}> Date : {this.state.todayEventDate} </Text>
              </TouchableOpacity>
            </View>
            :
            <Text style={{ fontSize: 15, alignSelf: 'center', marginTop: height / 15 }}> No Ongoing Events </Text>
          }



          <Text style={{ fontWeight: "bold", fontSize: 25, alignSelf: 'center', marginTop: height / 6 }}>Past Events</Text>

          {this.state.pastEvents ? <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={{
              width: width / 1.2,
              backgroundColor: '#99EDE3',
              height: height / 14,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: height / 10
            }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Name: {this.state.pastEventName}</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}> Date : {this.state.pastEventDate} </Text>
            </TouchableOpacity>
          </View>
            :
            <Text style={{ fontSize: 15, alignSelf: 'center', marginTop: height / 15 }}> No Past Events </Text>
          }



        </View>
      </SafeAreaView>
    )
  }
}

// exports current class
export default TeacherDashboard