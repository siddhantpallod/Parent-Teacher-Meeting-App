import { Text, View, Dimensions, TouchableOpacity, SafeAreaView, FlatList, ScrollView } from 'react-native';
import React from 'react';
import { Header, Card, Avatar } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { Dropdown } from 'react-native-element-dropdown';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../config'


const { width, height } = Dimensions.get('window')

export class ParentViewEvent extends React.Component {

  constructor() {
    super();
    this.state = {
      class: null,
      teachers: null
    }
  }

  teacher = [
    {email: "siddhantpallod@peterspanchgani.org", id:"Siddhant_Pallod", name: "Siddhant Pallod", picture: "", subject: "Everything", teaches: ["DP1 ", "DP2"]},
    { email: "alfiya.s@mitgurukul.com", id: "Alfiya_Shaikh", name: "Alfiya Shaikh", picture: "", subject: "German", teaches: [""] },
    { email: "arpit.s@mitgurukul.com", id: "Arpit_Sharma", name: "Arpit Sharma", picture: "https://lh3.googleusercontent.com/cm/AOLgnvuynSL4gpNQNbuszFXHgmKoo5kVAOM5VklmjxO49WcmtbcwUNTDYbOT9_GF_HbY=s69-p-k-rw-no", "subject": "English ", "teaches": ["DP1 ", "DP2 "] },
    { email: "arti.belpathak@mitgurukul.com", id: "Arti_Belpathak", name: "Arti Belpathak", picture: "", subject: "Dance", teaches: [""] },
    { email: "daisy.m@mitgurukul.com", id: "Daisy_Motafram", name: "Daisy Motafram", picture: "", subject: "French", teaches: [""] },
    { email: "dhanashree.p@mitgurukul.com", id: "Dhanashree_Patil", name: "Dhanashree Patil", picture: "", subject: "", teaches: [""] },
    { email: "jaya.shahi@mitgurukul.com", id: "Jaya_Shahi", name: "Jaya Shahi", picture: "", subject: "Hindi", teaches: [""] },
    { email: "jayanta.k@mitgurukul.com", id: "Jayanta_Kar", name: "Jayanta Kar", picture: "", subject: "", teaches: [""] },
    { email: "nancy.p@mitgurukul.com", id: "Nancy_Paul", name: "Nancy Paul", picture: "", subject: "Spanish", teaches: [""] },
    { email: "nanda.kathale@mitgurukul.com", id: "Nanda_Kathale", name: "Nanda Kathale", picture: "", subject: "", teaches: [""] },
    { email: "neeru.m@mitgurukul.com", id: "Neeru_Mittal", name: "Neeru Mittal", picture: "", subject: "", teaches: [""] },
    { email: "nruparaj.s@mitgurukul.com", id: "Nruparaj_Sahu", name: "Nruparaj Sahu", picture: "", "subject": "Mathematics", teaches: [""] },
    { email: "parsuvanath.j@mitgurukul.com", id: "Parsuvanath_Jain", name: "Parsuvanath Jain", picture: "", subject: "Hindi", teaches: [""] },
    { email: "pramod.s@mitgurukul.com", id: "Pramod_Sahoo", name: "Pramod Sahoo", picture: "", subject: "Film", teaches: [""] },
    { email: "prasun.h@mitgurukul.com", id: "Prasun_Harja", name: "Prasun Harja", picture: "", subject: "Mathematics", teaches: [""] },
    { email: "purva.h@mitgurukul.com", id: "Purva_Holkar", name: "Purva Holkar", picture: "", subject: "Design Technology", teaches: [""] },
    { email: "rameez.r@mitgurukul.com", id: "Rameez_Rehman", name: "Rameez Rehman", picture: "https://lh3.googleusercontent.com/a-/AD_cMMQo7ibf0GW80UZDBdZ3q-mIP11wKKkiXNotZqyfBw=s69-p-k-rw-no", subject: "Business Management", teaches: ["DP1 ", "DP2 "] },
    { email: "renu.c@mitgurukul.com", id: "Renu_Choudhary", name: "Renu Choudhary", picture: "", subject: "", teaches: [""] },
    { email: "richa.s@mitgurukul.com", id: "Richa_Singh", name: "Richa Singh", picture: "", subject: "", teaches: [""] },
    { email: "rohit.p@mitgurukul.com", id: "Rohit_Phalke", name: "Rohit Phalke", picture: "", subject: "Economics", teaches: ["DP1 ", "DP2 "] },
    { email: "saily.b@mitgurukul.com", id: "Saily_Bawne", name: "Saily Bawne", picture: "", "subject": "Mathematics", teaches: [""] },
    { email: "shailah.r@mitgurukul.com", id: "Shailah_Rafique", name: "Shailah Rafique", picture: "", subject: "Business Management", teaches: ["DP1 ", "DP2 "] },
    { email: "shrishty.s@mitgurukul.com", id: "Shrishty_Sehgal", name: "Shrishty Sehgal", picture: "", subject: "English", teaches: [""] },
    { email: "sneha.bhatt@mitgurukul.com", id: "Sneha_Bhatt", name: "Sneha Bhatt", picture: "", subject: "Psychology ", teaches: ["DP1 ", "DP2 "] },
    { email: "sonali.j@mitgurukul.com", id: "Sonali_Joshi", name: "Sonali Joshi", picture: "", subject: "German", teaches: ["DP1 ", "DP2 "] },
    { email: "swathi.c@mitgurukul.com", id: "Swathi_Chiluka", name: "Swathi Chiluka", picture: "", subject: "", teaches: [""] },
    { email: "tejashri.joshi@mitgurukul.com", id: "Tejashri_Joshi", name: "Tejashri Joshi", picture: "", subject: "French", teaches: [""] },
    { email: "zoha.s@mitgurukul.com", id: "Zoha_Sayed", name: "Zoha Sayed", picture: "", subject: "", teaches: [""] }]


  //to get teachers data from firebase

  // async componentDidMount() {
  //   const querySnapshot = await getDocs(collection(db, "teachers"));

  //   const d = querySnapshot.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data()
  //   }))

  //   this.teacher = d
  //   this.userNames = this.teacher.map(({name}) => name)
  //   this.email = this.teacher.map(({email}) => email)
  //   this.picture = this.teacher.map(({picture}) => picture)
  //   this.teaches = this.teacher.map(({teaches}) => teaches)
  //   this.subject = this.teacher.map(({subject}) => subject)
  // }




  render() {

    const { navigation, route } = this.props
    const { email, name, picture, firstName } = route.params


    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar style='auto' backgroundColor='#99EDE3' />

        <View style={{ flex: 0.2 }}>
          <Header
            centerComponent={{
              text: "View Event",
              style: { fontWeight: 'bold', fontSize: 30, color: 'black' }
            }}

            backgroundColor="#99EDE3"
          />

        </View>

        <View style={{ alignItems: 'center', flex: 0.3 }}>

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

        {/* <Dropdown
          mode='default'
          placeholder='Class'
          data={[
            { label: 'DP1', value: '1' },
            { label: 'DP2', value: '2' },
          ]}
          onChange={(item) => {
            this.setState({ class: item })
            console.log(this.state.class)
          }}

          style={{
            margin: 16,
            height: 50,
            borderBottomColor: 'gray',
            borderBottomWidth: 0.5,
            width: width / 2,
            justifyContent: 'center',
            alignSelf: 'center'
          }}
          placeholderStyle={{ fontSize: 16 }}
          labelField="label"
          valueField="value"
        /> */}

        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
          <ScrollView>
            {this.teacher?.map((item) => (
              <View key={item.id}>
                <TouchableOpacity style={{ backgroundColor: '#99EDE3', width: width / 1.09, height: height / 8, borderRadius: 30, margin: 10, justifyContent: 'center', alignItems: 'center' }}
                  onPress={(i) => {
                    navigation.navigate('Parent_View_Teacher', {
                      teacher_name: item.name,
                      teacher_email: item.email,
                      teacher_picture: item.picture,
                      teacher_subject: item.subject,
                      teacher_teaches: item.teaches,
                      email: email,
                      firstName: firstName,
                      picture: picture,
                      name: name
                    })
                  }}
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

export default ParentViewEvent;