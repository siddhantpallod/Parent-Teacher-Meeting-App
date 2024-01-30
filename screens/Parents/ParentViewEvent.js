// Importing libraries
import { Text, View, Dimensions, TouchableOpacity, SafeAreaView, FlatList, ScrollView, Platform} from 'react-native';
import React from 'react';
import { Header, Avatar } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from '../../config';
import moment from 'moment';

// fetches width and height of the screen
const { width, height } = Dimensions.get('window')

export class ParentViewEvent extends React.Component {

  constructor() {
   super();
    // sets default states
    this.state = {
      isModalVisible: false,
      todayEventName: '',
      todayEventDate: '',
      todayEventId: '',
      currentDate: '',
      teachersData: null,
      selectedTeacher: '',
      slot: null,
      selectedSlot: null,
      availableTimings: null,
      currentDate: '',
      studentName: '',
      studentClass: '',
    }
  }

  //calls itself after the component is mounted
  async componentDidMount() {
      // fetches current date
      var d = moment().utcOffset('+05:30').format('MMM DD YYYY')
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
  }




  // renders components on screen
  render() {

    // props from other screens
    const { navigation, route } = this.props
    const { email, name, picture, firstName } = route.params


    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Status bar component */}
        <StatusBar style='auto' backgroundColor='#99EDE3' />

        <View style={{ flex: 0.2 }}>
        {/* header component */}
          <Header
            centerComponent={{
              text: "View Event",
              style: { fontWeight: 'bold', fontSize: 30, color: 'black' }
            }}

            backgroundColor="#99EDE3"
          />

        </View>

        <View style={{ alignItems: 'center', flex: 0.3 }}>

          {/* image component */}
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
          
            {/* maps through data */}
            {this.state.teachersData?.map((item) => (
              <View key={item.id}>

                {/* button for each teacher */}
                <TouchableOpacity style={{ backgroundColor: '#99EDE3', width: width / 1.09, height: height / 8, borderRadius: 30, margin: 10, justifyContent: 'center', alignItems: 'center' }}

                  onPress={() => navigation.navigate('Parent_View_Teacher', {
                    email: email,
                    picture: picture,
                    firstName: firstName,
                    name: name,
                    teacher_name: item.name,
                    teacher_email: item.email,
                    teacher_picture: item.picture,
                    teacher_teaches: item.teaches,
                    teacher_subject: item.subject,
                  })}

                  >
                    

                  <View style={{ alignSelf: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Avatar rounded source={{ uri: item.picture }} size={'medium'} containerStyle={{ alignSelf: 'center', justifyContent: 'flex-start', margin: 10 }} />
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Teacher Name: {item.name}</Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Subject: {item.subject}</Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Teaches: {item.teaches}</Text>                      
                    </View>
                  </View>
                </TouchableOpacity>

                  </View>

              
            ))}
          </ScrollView>
        </View>

      </SafeAreaView>
    )
  }
}

// exports current classw
export default ParentViewEvent;