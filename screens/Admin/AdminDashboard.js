import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, ScrollView} from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {Avatar} from 'react-native-elements';

const {width, height} = Dimensions.get('window')


export class AdminDashboard extends React.Component {
  render() {

    const {navigation, route} = this.props
    const {email, name, picture, firstName} = route.params

    return (
        <SafeAreaView>
          <StatusBar style='auto' backgroundColor='#99EDE3' />
            <View style={{justifyContent:'center', alignItems:'center', flex: 1}}>
                <View style = {{flex:0.2, justifyContent:'center', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#99EDE3', width: width, justifyContent: "center", height: height/3, alignItems:'center', marginTop: height/3}}>
                        <Avatar
                            rounded
                            source={{uri: picture}}
                            size={'xlarge'}
                            containerStyle = {{ borderRadius: 10}}
                            
                        />
                        <Text style={{alignSelf:'center', fontWeight:'bold', fontSize: 18, marginTop: height/100}}>Welcome {firstName}!</Text>
                    </View>
                </View>

                <View style = {{flex: 0.35}}>
                  <TouchableOpacity onPress={() => navigation.navigate('Admin_Create_Event', {
                    email: email,
                    name: name,
                    picture: picture,
                    firstName: firstName
                  })} 

                    style = {{
                    width: width/1.2,
                    backgroundColor: '#99EDE3',
                    height: height/14,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: height/2
                  }}>
                    <Text style = {{fontWeight: 'bold', fontSize: 20}}>Create Event</Text>
                  </TouchableOpacity>
                </View>

                {/* <View style={{flex: 0.35, justifyContent: 'center', alignItems: 'center'}}>
                <ScrollView >
                  <Text style = {{fontWeight: "bold", fontSize: 15, alignSelf: 'center'}}>Past Events</Text>
                  <TouchableOpacity onPress={() => console.log("pressed")} style = {{
                    width: width/1.2,
                    backgroundColor: '#99EDE3',
                    height: height/14,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // marginTop: -height/2
                    
                  }}>
                      <Text style = {{fontWeight: 'bold', fontSize: 15}}>Name: Lorem Ipsum</Text>
                      <Text style = {{fontWeight: 'bold', fontSize: 15}}> Date : 1/1/2023 </Text>
                  </TouchableOpacity>
                </ScrollView>
                </View> */}


                
            </View>
      </SafeAreaView>
    )
  }
}

export default AdminDashboard