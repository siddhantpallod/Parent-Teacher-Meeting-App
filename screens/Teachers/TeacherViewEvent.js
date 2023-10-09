import { Text, View, Dimensions, TouchableOpacity, SafeAreaView, FlatList, ScrollView } from 'react-native';
import React from 'react';
import { Header, Icon } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import moment from 'moment';
import { db } from '../../config'
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import * as Clipboard from 'expo-clipboard';



const { width, height } = Dimensions.get('window')

export class TeacherViewEvent extends React.Component {

    constructor() {
        super();
        this.state = {
            data: ["9:00", "9:10", "9:20", "9:30", "9:40", "9:50", "10:00", "10:10", "10:20", "10:30", "10:40", "10:50", "11:00", "11:10", "11:20", "11:30", "11:40", "11:50", "12:00", "12:10", "12:20", "12:30", "12:40", "12:50", "1:40", "1:50", "2:00", "2:10", "2:20", "2:30", "2:40", "2:50", "3:00"],
            todayEventName: '',
            todayEventDate: '',
            todayEventId: '',
            currentDate: '',
            bookedTimings: [],
            parentData: [],
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

    changeColor = () => {
        for(i = 0; i < this.state.data.length; i++){
            // for(j = 0; j < this.state.bookedTimings.length; j++){
                if(this.state.bookedTimings == this.state.data[i]){
                   //alert(this.state.bookedTimings[j])
                   //alert(this.state.data[i])
                    return 'red'
                }
                else{
                    return 'green'
                }
            // }
        }
    }

    render() {

        const { navigation, route } = this.props
        const { email, name, picture, firstName } = route.params


        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar style='auto' backgroundColor='#99EDE3' />


                <View style={{ flex: 0.3 }}>
                    <Header
                        centerComponent={{
                            text: "View Event",
                            style: { fontWeight: 'bold', fontSize: 30, color: 'black' }
                        }}

                        backgroundColor="#99EDE3"
                    />
                </View>

                <View style={{ alignItems: 'center', flex: 0.6 }}>

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

                <View style={{ flex: 0.15 }}>
                    <FlatList
                        data={this.state.data}

                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    style={{
                                        borderWidth: 2.5,
                                        borderRadius: 10,
                                        justifyContent: 'center',
                                        width: width / 6,
                                        height: height / 16,
                                        alignItems: 'center',
                                        margin: 5,
                                        // backgroundColor: this.changeColor(),
                                        backgroundColor: this.state.data[index] == this.state.bookedTimings ? 'red' : 'green'
                                    }} 
                                        onPress={() => {
                                            alert(this.state.data[index])
                                            alert(this.state.bookedTimings)
                                        }
                                    }
                                    >
                                    <Text style={{ fontWeight: 'bold' }} >{this.state.data[index]}</Text>
                                </TouchableOpacity>
                            )
                        }}

                        keyExtractor={item => `key-${item.id}`}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                <View style={{ flex: 0.1, justifyContent: 'space-evenly', flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'green', width: width / 8, height: height / 30 }}></View>
                        <Text style={{ fontWeight: 'bold' }}>  Available</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'red', width: width / 8, height: height / 30 }}></View>
                        <Text style={{ fontWeight: 'bold' }}>  Booked</Text>
                    </View>

                </View>

                <View style={{ flex: 0.6 }} >
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

export default TeacherViewEvent