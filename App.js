import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AdminDashboard from './screens/Admin/AdminDashboard';
import AdminCreateEvent from './screens/Admin/AdminCreateEvent';
import TeacherDashboard from './screens/Teachers/TeacherDashboard';
import TeacherViewEvent from './screens/Teachers/TeacherViewEvent';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './screens/Login';
import ParentDashboard from './screens/Parents/ParentDashboard';
import ParentViewEvent from './screens/Parents/ParentViewEvent';

const Stack = createNativeStackNavigator();

export default function App(){
  
    return (
    //  <View style = {{
    //   flex: 1,
    //   backgroundColor: '#fff',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //  }}>
    //    <Login/>
    //  </View>

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name = 'Login' component={Login} options={{headerShown: false}}/>
          <Stack.Screen name = 'Admin_Dashboard' component={AdminDashboard} options={{headerShown: false}}/>
          <Stack.Screen name = 'Admin_Create_Event' component={AdminCreateEvent} options={{headerShown: false}}/>
          <Stack.Screen name = 'Teacher_Dashboard' component={TeacherDashboard} options={{headerShown: false}}/>
          <Stack.Screen name = 'Teacher_View_Event' component={TeacherViewEvent} options={{headerShown: false}}/>
          <Stack.Screen name = 'Parent_Dashboard' component={ParentDashboard} options={{headerShown: false}}/>
          <Stack.Screen name = 'Parent_View_Event' component={ParentViewEvent} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>

    );
  }

