// Importing libraries
import { Text, View, Dimensions, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { TextInput } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Header } from 'react-native-elements'
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../config';
import moment from 'moment';


// Fetching width and height of device
const { width, height } = Dimensions.get('window')



// Creating and exporting class
export class AdminCreateEvent extends React.Component {

    constructor() {
        super();
        // Sets default states
        this.state = {
            eventName: "",
            eventDate: "",
            currentDate: '',
            tempDate: ''
        }
    }

    componentDidMount(){
        var d = moment().utcOffset('+05:30').format('YYYY-MM-DD')
        this.setState({
            currentDate: d,
            })

            
            date = d.substring(8, 11)
            dat = Number(date)
            console.log("Moment", dat)
            this.setState({currentDate: dat})

    }



    // renders components on screen
    render() {

        // props from other screens
        const { navigation, route } = this.props
        const { email, name, picture, firstName } = route.params



        return (
            <SafeAreaProvider style={{ flex: 1, backgroundColor: 'white' }}>
                {/* Status Bar component */}
                <StatusBar style='auto' backgroundColor='#99EDE3' />

                {/* Header component */}
                <View style={{ flex: 0.3 }}>
                    <Header
                        centerComponent={{
                            text: "Create Event",
                            style: { fontWeight: 'bold', fontSize: 30, color: 'black' }
                        }}

                        backgroundColor="#99EDE3"
                    />
                </View>


                {/* Image component */}
                <View style={{ alignItems: 'center', flex: 0.5 }}>

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

                    {/* Text input component */}
                    <TextInput
                        placeholder='Name of the Event'
                        outlineColor='#99EDE3'
                        activeOutlineColor='#99EDE3'
                        style={{
                            height: height / 18,
                            width: width / 1.2,
                            justifyContent: 'center',
                            marginTop: height / 20
                        }}
                        mode='outlined'

                        outlineStyle={{
                            borderRadius: 50,
                            borderWidth: 2
                        }}

                        onChangeText={(text) => this.setState({ eventName: text })}
                    />

                    {/* Date Picker Component */}
                    <View
                        style={{ marginBottom: height / 3 }}>
                        <DatePickerInput
                            locale="en"
                            label="Date of the Event"
                            value={this.state.eventDate}
                            onChange={(d) => {

                                dat = d.toString()
                                date = dat.substring(8, 10)
                                properDate = Number(date)
                                this.setState({
                                    eventDate: d,
                                    tempDate: properDate
                                })
                                }}
                            inputMode="start"
                            style={{
                                height: height / 18,
                                width: width / 1.2,
                                justifyContent: 'center',
                            }}
                            mode='outlined'
                            outlineStyle={{
                                borderRadius: 50,
                                borderWidth: 2
                            }}
                            outlineColor='#99EDE3'
                            activeOutlineColor='#99EDE3'
                            startYear={2024}
                        />
                    </View>

                    {/* Button Component */}
                    <TouchableOpacity onPress={async () => {
                        if(this.state.eventName !== ''){
                            if(this.state.tempDate >= this.state.currentDate){
                        const docRef = await addDoc(collection(db, "events"), {
                            eventName: this.state.eventName,
                            eventDate: this.state.eventDate
                        }).then(() => {
                            navigation.navigate('Admin_Dashboard', {
                                email: email,
                                name: name,
                                picture: picture,
                                firstName: firstName
                            })
                        })
                        }
                          else{
                            Alert.alert('Please enter appropriate date')
                        }
                        }
                        else{
                            Alert.alert("Please enter Event Name")
                        }
                        
                    }} style={{
                        width: width / 1.2,
                        backgroundColor: '#99EDE3',
                        height: height / 20,
                        borderRadius: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: -height / 3
                    }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Create Event</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaProvider>
        )
    }
}

// exports the class
export default AdminCreateEvent