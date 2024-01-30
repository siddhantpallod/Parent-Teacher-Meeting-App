// Importing libraries
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, FlatList } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Header } from 'react-native-elements'
import { collection, doc, getDoc, getDocs, query, deleteDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from '../../config'
import {Overlay, Button} from 'react-native-elements';
import { TextInput } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import * as Linking from 'expo-linking';



// fetching width and height of the device
const { width, height } = Dimensions.get('window')

export class AdminViewEvent extends React.Component {

  constructor(){
    super();

    this.state = {
    deleteModal: false,
    editModal: false,
    editedName: '',
    editedDate: '',
    searchTeacher: '',
    searchTeacherData: null,
    searchTeacherLink: '',
    buttonsVisible: true
    }
  }

  async searchTeacher(){
    const data = []
    const querySnapshot = await getDocs(collection(db, "events", this.props.route.params.todayEventId, this.state.searchTeacher))
    querySnapshot.forEach((doc) => {
      d = doc.data()
      data.push(d)
      
    })

    this.setState({ searchTeacherData: data})
    console.log(this.state.searchTeacherData)

    
  }

  render() {

    const { navigation, route } = this.props
    const { todayEventId, todayEventName, todayEventDate, email, name, picture, firstName} = route.params

    return (
      <SafeAreaView>
        <StatusBar style='auto' backgroundColor='#99EDE3' />
        <View>
            <Header
                centerComponent={{
                    text: "View Event",
                    style: { fontWeight: 'bold', fontSize: 30, color: 'black' }
                }}

                backgroundColor="#99EDE3"
            />
         </View>
        <View style = {{justifyContent: 'center', alignItems: 'center'}}>
            <View style = {{justifyContent: 'center', alignItems: 'center', marginTop: height/40}}>
                <Text style = {{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}> Event name:  {todayEventName}</Text>
                <Text style = {{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}> Event date: {todayEventDate}</Text>
            </View>


            <TextInput
                  placeholder='Email of the teacher'
                  style = {{
                    height: height/18,
                    width: width/1.5,
                    justifyContent: 'center',
                    margin: 20
                  }}

                  onChangeText={(text) => this.setState({searchTeacher: text})}
                  />


            <TouchableOpacity style = {{backgroundColor: '#99EDE3', margin: 10, borderRadius: 50, width: width/4, height: height/20}}>
               <Text style = {{alignSelf: 'center', fontSize: 20, fontWeight: 'bold'}} 
               onPress= {() => {
                
                this.searchTeacher()
                this.setState({buttonsVisible: false})
                }}
               >Search</Text>
              </TouchableOpacity>

        
              { 
                this.state.searchTeacherData ? 
                  this.state.searchTeacherData.map((item) =>(
                      <View key = {item.id} style = {{backgroundColor: '#99EDE3', marginTop: 20, borderRadius: 50, borderWidth: 5, width: width/1.1, height: 100}}>
                      <TouchableOpacity onPress={() => Linking.openURL(item.meetingLink)}>                        
                            <Text style = {{alignSelf: 'center', fontSize: 12, fontWeight: 'bold'}}>Parent Name: {item.parentName}</Text>
                            <Text style = {{alignSelf: 'center', fontSize: 12, fontWeight: 'bold'}}>Student Name: {item.studentName}</Text>
                            <Text style = {{alignSelf: 'center', fontSize: 12, fontWeight: 'bold'}}>Student Class: {item.studentClass}</Text>
                            <Text style = {{alignSelf: 'center', fontSize: 12, fontWeight: 'bold'}}>Time: {item.time}</Text>
                            <Text style = {{alignSelf: 'center', fontSize: 12, fontWeight: 'bold', color: 'blue'}}>Meeting Link: {item.meetingLink}</Text>
                        </TouchableOpacity>
                      </View>
                  ))
                : 

                <View>
                
                </View>
                
              }

            {this.state.buttonsVisible ?
            <View style={{justifyContent:'center', flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity  style = {{backgroundColor: '#C1BE42', margin: 10, borderRadius: 50, width: width/4, height: height/20}}>
               <Text style = {{alignSelf: 'center', fontSize: 20, fontWeight: 'bold'}} 
               onPress={() => 
                  this.setState({editModal: true})
                }
               >EDIT</Text>
              </TouchableOpacity>

              <TouchableOpacity style = {{backgroundColor: '#CE5E5E', margin: 10,borderRadius: 50, width: width/4, height: height/20}}
                onPress={() => 
                  this.setState({deleteModal: true})
                }
              >
               <Text style = {{alignSelf: 'center', fontSize: 20, fontWeight: 'bold'}}>DELETE</Text>
              </TouchableOpacity>
            </View>
            : 
            <View></View>
        }

          
              <Overlay isVisible = {this.state.deleteModal} onBackdropPress={() => this.setState({deleteModal: false})}>
                <Text>Are you sure you want to delete {todayEventName}?</Text>
                <View style = {{flexDirection: 'row', justifyContent: 'space-around', margin: 10}}>
                  <Button title="No" onPress={() => this.setState({deleteModal: false})}></Button>
                  <Button title="Delete" onPress={() => deleteDoc(doc(db, "events", todayEventId))
                  .then(() => {
                    this.setState({deleteModal: false}) 
                    navigation.navigate('Admin_Dashboard', {email, name, picture, firstName})
                  }
                  )}></Button>
                </View>
              </Overlay>

              <Overlay isVisible={this.state.editModal} onBackdropPress={() => this.setState({editModal: false})}>
              <View style = {{justifyContent: 'center', }}>
                <Text style = {{alignSelf: 'center', fontSize: 30, fontWeight: 'bold'}}>EDIT EVENT</Text>
                <TextInput
                  placeholder='Name of the event'
                  style = {{
                    height: height/18,
                    width: width/1.5,
                    justifyContent: 'center',
                    margin: 20
                  }}

                  onChangeText={(text) => this.setState({editedName: text})}
                  />

                <View>
                  <DatePickerInput
                    style = {{margin: 20}}
                    locale='en'
                    label= 'Date of the event'
                    value = {this.state.editedDate}
                    onChange={(d) => this.setState({ editedDate: d })}
                    inputMode="start"
                    startYear={2024}
                  />
                </View>

                <TouchableOpacity
                  style = {{
                        width: width / 1.2,
                        backgroundColor: '#99EDE3',
                        height: height / 20,
                        borderRadius: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}

                  onPress={async () => {
                    const docRef = await setDoc(doc(db, "events", todayEventId), {
                      eventName: this.state.editedName,
                      eventDate: this.state.editedDate
                    }).then(() => {
                      this.setState({editModal: false})
                    })
                  }}
                >
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Edit Event</Text>

                </TouchableOpacity>
            </View>
              </Overlay>
        </View>
      </SafeAreaView>
    )
  }
}

export default AdminViewEvent