import { Text, View, Dimensions, TouchableOpacity, SafeAreaView, FlatList, ScrollView, ToastAndroid } from 'react-native';
import React from 'react';
import { Header, Card, Avatar } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar';
import { addDoc, collection, doc, getDocs, setDoc, onSnapshot, query } from "firebase/firestore";
import { db } from '../../config'
import { TextInput } from 'react-native-paper';
import moment from 'moment';


const { width, height } = Dimensions.get('window')


export class ParentViewTeacher extends React.Component {


  constructor() {
    super();
    this.state = {
      data: ["9:00", "9:10", "9:20", "9:30", "9:40", "9:50", "10:00", "10:10", "10:20", "10:30", "10:40", "10:50", "11:00", "11:10", "11:20", "11:30", "11:40", "11:50", "12:00", "12:10", "12:20", "12:30", "12:40", "12:50", "1:00", "1:10", "1:20", "1:30", "1:40", "1:50", "2:00", "2:10", "2:20", "2:30", "2:40", "2:50", "3:00"],
      selectedSlot: null,
      studentName: '',
      todayEventName: '',
      todayEventDate: '',
      todayEventId: '',
      currentDate: '',
      slot: null,
      bookedTimings: [],
    }
  }

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

    const dat = []

    const query = await getDocs(collection(db, "events", this.state.todayEventId, this.props.route.params.teacher_email))
    query.forEach((doc) => {
      string = doc.data().time
      dat.push(string)
    })



    const filterData = this.state.data.filter(el => dat.some(it => it == el))
    this.setState({ bookedTimings: filterData })
  }

  bookedSlots() {
    const slot = []
    for (i = 0; i < this.state.data.length; i++) {
      for (j = 0; j < this.state.bookedTimings.length; j++) {
        if (this.state.data[i] == this.state.bookedTimings[j]) {
          slot.push(i)

        }
      }
    }

    console.log("Hey", slot)
    return slot
  }

  render() {



    const { navigation, route } = this.props
    const { teacher_name, teacher_email, teacher_picture, teacher_subject, teacher_teaches, email, picture, firstName, name } = route.params

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar style='auto' backgroundColor='#99EDE3' />

        <View style={{ flex: 0.2 }}>
          <Header
            centerComponent={{
              text: "View Teacher",
              style: { fontWeight: 'bold', fontSize: 30, color: 'black' }
            }}
            backgroundColor="#99EDE3"
          />
        </View>

        <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
          <Avatar rounded size={'xlarge'} source={{ uri: teacher_picture }} />
          <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 10 }} >{teacher_name}</Text>
        </View>

        <View style={{ flex: 0.18, justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }} >
          <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Subject: {teacher_subject}</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Teaches: {teacher_teaches}</Text>
        </View>

        <View style={{ flex: 0.08 }} >
          <FlatList

            data={this.state.data}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    this.setState({
                      selectedSlot: index,
                      slot: this.state.data[index]
                    })
                  }}

                  // style={{
                  //   backgroundColor: index == this.bookedSlots() ? '#C60202' : '#2C9F3E',
                  //   // backgroundColor: this.state.data[index] == this.bookedSlots() ? '#C60202' : '#2C9F3E',
                  //   borderWidth: this.state.selectedSlot == index ? 3.5 : 0.5,
                  //   borderRadius: 10,
                  //   justifyContent: 'center',
                  //   width: width / 6,
                  //   height: height / 16,
                  //   alignItems: 'center',
                  //   margin: 5,
                  //   borderColor: 'black'
                  // }}

                  style={{
                      borderWidth: this.state.selectedSlot == index ? 3.5 : 0.5,
                      borderRadius: 10,
                      justifyContent: 'center',
                      width: width / 6,
                      height: height / 16,
                      alignItems: 'center',
                      margin: 5,
                      borderColor: 'black',
                      backgroundColor : this.state.data[index] == this.state.bookedTimings ? '#C60202' : '#2C9F3E'
                    }}
                  
                  disabled={index == this.bookedSlots()} 
                  
                  >

                  <Text style={{ fontSize: this.state.selectedSlot == index ? 20 : 15, fontWeight: 'bold' }} >{this.state.data[index]}</Text>
                </TouchableOpacity>
              )
            }}

            keyExtractor={item => `key-${item.id}`}
            horizontal
          />

        </View>

        <View style={{ flex: 0.1, justifyContent: 'space-evenly', flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#2C9F3E', width: width / 8, height: height / 30 }}></View>
            <Text style={{ fontWeight: 'bold' }}>  Available</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#C60202', width: width / 8, height: height / 30 }}></View>
            <Text style={{ fontWeight: 'bold' }}>  Booked</Text>
          </View>
        </View>

        <View style={{ flex: 0.1 }} >
          <TextInput
            placeholder='Name of the Student'

            // outlineColor='#99EDE3'
            // activeOutlineColor='#99EDE3'
            style={{
              height: height / 18,
              width: width,
              justifyContent: 'center',
              marginTop: height / 20
            }}
            mode='outlined'

            outlineStyle={{
              borderRadius: 50,
              borderWidth: 2
            }}

            onChangeText={(text) => this.setState({ studentName: text })}
          />

        </View>

        <View style={{ flex: 0.1 }}>
          <TouchableOpacity

            onPress={async () => {
              const docRef = collection(db, 'events', this.state.todayEventId, teacher_email)
              await addDoc(docRef, {
                teacherName: teacher_name,
                parentName: name,
                parentEmail: email,
                time: this.state.slot,
                teacherEmail: teacher_email,
                studentName: this.state.studentName
              })
                .then(() => {
                  navigation.navigate('Parent_View_Event', {
                    email: email,
                    name: name,
                    picture: picture,
                    firstName: firstName
                  })
                })
            }}

            style={{
              width: width,
              backgroundColor: '#99EDE3',
              height: height / 14,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: height / 8
            }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>BOOK NOW</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    )
  }
}

export default ParentViewTeacher