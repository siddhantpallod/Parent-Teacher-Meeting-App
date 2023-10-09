import { Text, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import React from 'react';
import { useEffect, useState } from "react";
import { SocialIcon } from 'react-native-elements';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { db } from '../config'
import { collection, addDoc, getDocs } from "firebase/firestore";
import * as aut from 'firebase/auth'
const auth = aut.getAuth();

WebBrowser.maybeCompleteAuthSession();


const { width, height } = Dimensions.get('window')


const Login = ({ navigation }) => {

  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "768043697008-jhmtfhjftlj30ocuu4k2f2ipoq3tvhqe.apps.googleusercontent.com",
    expoClientId: "768043697008-j18sca6cl542d5sovmqd8q2kipqhigk8.apps.googleusercontent.com",

  });



  useEffect(() => {
    if (response && response?.type === "success") {
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
  }, [response, token]);



 
  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }

      ); 

      const user = await response.json();
      setUserInfo(user);

      //add data

      // try{
      //   const docRef = await addDoc(collection(db, "users"), {
      //       name: user.name,
      //       email: user.email,
      //       picture: user.picture,
      //   })
      //   console.log("Document written with id: ", docRef.id)
      // }
      // catch(e){
      //   console.log("Error: ", e)
      // }
       
      if (user.email == 'vandanapallod10@gmail.com') {
        navigation.navigate('Admin_Dashboard', {
          email: user.email,
          name: user.name,
          picture: user.picture,
          firstName: user.given_name
        })
        console.log(user)
      }
      

      else if (user.email == 'siddhantpallod@gmail.com') {
        navigation.navigate('Teacher_Dashboard', {
          email: user.email,
          name: user.name,
          picture: user.picture,
          firstName: user.given_name
        })
        console.log(user)
      }

      else {
        navigation.navigate('Parent_Dashboard', {
          email: user.email,
          name: user.name,
          picture: user.picture,
          firstName: user.given_name
        })

        console.log(user)

      }


    } catch (error) {
      console.log("error: ", error)
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#99EDE3", width: width }}>
        <Text style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: 30 }}>Welcome Aboard!</Text>
        <Text style={{ marginTop: height / 15, fontFamily: 'sans-serif', fontSize: 15 }}>Let’s help you schedule your meetings easily.</Text>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>

          <SocialIcon
            title='LOG IN WITH GOOGLE'
            raised={true}
            button
            onPress={() => promptAsync()}
            style={{
              backgroundColor: 'white',
              marginTop: height / 4.5,
              height: 50,
              width: width / 1.2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            type='google'
            fontFamily='sans-serif'
            fontWeight='bold'
            iconColor='black'
            fontStyle={{ color: 'black' }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Login