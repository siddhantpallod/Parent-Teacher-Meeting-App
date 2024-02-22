// importing libraries
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Avatar } from 'react-native-elements';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../config'
import moment from 'moment';

// fetching widht and height of the device
const { width, height } = Dimensions.get('window')


export class ParentDashboard extends React.Component {

  constructor() {
    super()
    // setting default states
    this.state = {
      currentDate: '',
      todayEvent: false,
      todayEventName: '',
      todayEventDate: ''
    }
  }

  // calls itself after the component is mounted
  async componentDidMount() {
    // fetches current date
    var d = moment().utcOffset('+05:30').format('MMM DD YYYY')

    // set states 
    this.setState({  
      currentDate: d
    })

    // fetches data from firebase
    const querySnapshot = await getDocs(collection(db, "events"))
    querySnapshot.forEach((doc) => {
      string = doc.data().eventDate
      dateFormat = string.toDate() + 1
      properDate = dateFormat.substring(4, 15)


      if (this.state.currentDate == properDate) {
        this.setState({ todayEvent: true, todayEventName: doc.data().eventName, todayEventDate: properDate })
      }
    })
  }

  // renders components on the screen
  render() {

    // props from other screens
    const { navigation, route } = this.props
    const { email, name, picture, firstName } = route.params

    return (
      <SafeAreaView>
        {/* Status bar component */}
        <StatusBar style='auto' backgroundColor='#99EDE3' />
        <View style={{ justifyContent: "center", alignItems: 'center' }}>
          <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#99EDE3', width: width, justifyContent: "center", height: height / 3, alignItems: 'center', marginTop: height / 3 }}>
              {/* avatar component */}
              <Avatar
                rounded
                source={{ uri: picture }}
                size={'xlarge'}
                containerStyle={{ borderRadius: 10 }}
              />
              <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 20 }}>Welcome {firstName}!</Text>
            </View>
          </View>

          <Text style={{ fontWeight: "bold", fontSize: 25, alignSelf: 'center', marginTop: height / 2.4 }}>Ongoing Events</Text>

          {/* checks if there is an event today */}
          {this.state.todayEvent ?
            <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
              {/* button component */}
              <TouchableOpacity style={{
                width: width / 1.2,
                backgroundColor: '#99EDE3',
                height: height / 14,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: height / 10
              }}
                // navigates to other screen on press
                onPress={() => navigation.navigate('Parent_View_Event', {
                  email: email,
                  name: name,
                  picture: picture,
                  firstName: firstName
                })}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Name: {this.state.todayEventName}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}> Date : {this.state.todayEventDate} </Text>
              </TouchableOpacity>
            </View>
            :
            <Text style={{ fontSize: 15, alignSelf: 'center', marginTop: height / 15 }}> No Ongoing Events </Text>
          }
          
          {/* instrustcions to book meeting */}
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: height / 5 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', right: width / 4 }}>Instructions:</Text>
            <Text style={{ fontSize: 15, right: width / 100, alignSelf: 'center', justifyContent: 'center' }}>1. Click Book Now to book meeting slot          </Text>
            <Text style={{ fontSize: 15, right: width / 100, alignSelf: 'center', justifyContent: 'center' }}>2. Click on the student's teacher                      </Text>
            <Text style={{ fontSize: 15, right: width / 100, alignSelf: 'center', justifyContent: 'center' }}>3. Book as per the availability of the teacher*</Text>

          </View>


          {/* checks if there is an event today */}
          {this.state.todayEvent ?
            <View>
              {/* button component */}
              <TouchableOpacity 
                // navigates to other screen on press
                onPress={() => navigation.navigate('Parent_View_Event', {
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
                  marginTop: height / 8
                }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>BOOK NOW</Text>
              </TouchableOpacity>
            </View> :
            null}


        </View>
      </SafeAreaView>
    )
  }
}

// exports this class
export default ParentDashboard