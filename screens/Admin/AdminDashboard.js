import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Avatar } from 'react-native-elements';
import moment from 'moment';
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from '../../config'

const { width, height } = Dimensions.get('window')


export class AdminDashboard extends React.Component {

  constructor(){
    super()
    this.state = {
      currentDate: '',
      todayEvent: false,
      pastEvents: false,
      todayEventName: '',
      todayEventDate: '',
      todayEventId: '',
      pastEventName: '',
      pastEventDate: '',
      pastEventId: ''
    }
  }

  async componentDidMount(){
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
        this.setState({ todayEvent: true, todayEventName: doc.data().eventName, todayEventDate: properDate, todayEventId: doc.id })
      }

      if (this.state.currentDate > properDate) {
        this.setState({ pastEvents: true, pastEventName: doc.data().eventName, pastEventDate: properDate, pastEventId: doc.id })
      }

    })
  }

  render() {

    const { navigation, route } = this.props
    const { email, name, picture, firstName } = route.params

    return (
      <SafeAreaView>
        <StatusBar style='auto' backgroundColor='#99EDE3' />
        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
          <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#99EDE3', width: width, justifyContent: "center", height: height / 3, alignItems: 'center', marginTop: height / 3 }}>
              <Avatar
                rounded
                source={{ uri: picture }}
                size={'xlarge'}
                containerStyle={{ borderRadius: 10 }}

              />
              <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 20 }}>Welcome {firstName}!</Text>
            </View>
          </View>

            <TouchableOpacity onPress={() => navigation.navigate('Admin_Create_Event', {
              email: email,
              name: name,
              picture: picture,
              firstName: firstName
            })}

              style={{
                width: width / 1.2,
                backgroundColor: '#99EDE3',
                height: height / 14,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: height / 2.5
              }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Create Event</Text>
            </TouchableOpacity>

            <Text style={{ fontWeight: "bold", fontSize: 20, alignSelf: 'center', marginTop: 30 }}>Ongoing Events</Text>
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
   
              >
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Name: {this.state.todayEventName}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}> Date : {this.state.todayEventDate} </Text>
              </TouchableOpacity>
            </View>
            :
            <Text style={{ fontSize: 15, alignSelf: 'center', marginTop: height / 15 }}> No Ongoing Events </Text>
          }

          <Text style={{ fontWeight: "bold", fontSize: 20, alignSelf: 'center', marginTop: height / 6 }}>Past Events</Text>

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

export default AdminDashboard