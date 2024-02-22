// Importing libraries
import { Text, View, Dimensions, TouchableOpacity, SafeAreaView, FlatList, ScrollView } from 'react-native';
import React from 'react';
import { Header, Icon } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import moment from 'moment';
import { db } from '../../config'
import { collection, getDocs } from "firebase/firestore";
import * as Clipboard from 'expo-clipboard';


// fetches width and height of the screen
const { width, height } = Dimensions.get('window')

export class TeacherViewEvent extends React.Component {

    constructor() {
        super();
        // sets default states
        this.state = {
            todayEventName: '',
            todayEventDate: '',
            todayEventId: '',
            currentDate: '',
            bookedTimings: [],
            parentData: [],
        }
    }

    // calls itself once the component is mounted
    async componentDidMount() {
        // fetches current date
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

            if (this.state.currentDate == properDate) {
                this.setState({ todayEventName: doc.data().eventName, todayEventDate: properDate, todayEventId: doc.id })
            }
        })


        const dat = []
        const dataOfBookedSlots = []

        const query = await getDocs(collection(db, "events", this.state.todayEventId, this.props.route.params.email))
        query.forEach((doc) => {
            string = doc.data().time
            dat.push(string)
            da = doc.data()
            dataOfBookedSlots.push(da)
        })


        let sortedData = dataOfBookedSlots.sort((t1, t2) => 
            (t1.time > t2.time) ? 1 : (t1.time < t2.time) ? -1 : 0
        )

        this.setState({ parentData: sortedData })

        const filterData = this.state.data.filter(el => dat.some(it => it == el))
        this.setState({ bookedTimings: filterData })
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


                <View style={{ flex: 0.3 }}>
                {/* Header component */}
                    <Header
                        centerComponent={{
                            text: "View Event",
                            style: { fontWeight: 'bold', fontSize: 30, color: 'black' }
                        }}

                        backgroundColor="#99EDE3"
                    />
                </View>

                <View style={{ alignItems: 'center', flex: 0.6 }}>
                    {/* Image component */}
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


                <View style={{ flex: 0.6 }} >
                {/* Flatlist component */}
                    <FlatList
                        data={this.state.parentData}

                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ backgroundColor: '#99EDE3', justifyContent: 'center', borderRadius: 30, alignItems: 'center', flexDirection: 'column', margin: 10 }} >
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Name: {this.state.parentData[index].parentName}</Text>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Email: {this.state.parentData[index].parentEmail}</Text>
                                    <Icon name='copy' type='ionicon'  containerStyle = {{ marginRight: 10, alignSelf: 'flex-end'}} onPress={ async() => await Clipboard.setStringAsync(this.state.parentData[index].parentEmail)} />
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Student Name: {this.state.parentData[index].studentName}</Text>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Student Class: {this.state.parentData[index].studentClass}</Text>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Time: {this.state.parentData[index].time}</Text>

                                </View>
                            )
                        }}
                    />
                </View>


            </SafeAreaView>
        )
    }
}

// exports current class
export default TeacherViewEvent