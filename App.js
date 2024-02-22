// Importing libraries
import React from 'react';
import Login from './screens/Login';
import AdminDashboard from './screens/Admin/AdminDashboard';
import AdminCreateEvent from './screens/Admin/AdminCreateEvent';
import AdminViewEvent from './screens/Admin/AdminViewEvent';
import TeacherDashboard from './screens/Teachers/TeacherDashboard';
import TeacherViewEvent from './screens/Teachers/TeacherViewEvent';
import ParentDashboard from './screens/Parents/ParentDashboard';
import ParentViewEvent from './screens/Parents/ParentViewEvent';
import ParentViewTeacher from './screens/Parents/ParentViewTeacher';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Creates stack for screens
const Stack = createNativeStackNavigator();


export default function App(){
  
    return (
      // Creates a navigation container
      <NavigationContainer>
        {/* Creates a Stack Navigator */}
        <Stack.Navigator>
          {/* Creates Screens to store in Stack */}
          <Stack.Screen name = 'Login' component={Login} options={{headerShown: false}}/>
          <Stack.Screen name = 'Admin_Dashboard' component={AdminDashboard} options={{headerShown: false}}/>
          <Stack.Screen name = 'Admin_Create_Event' component={AdminCreateEvent} options={{headerShown: false}}/>
          <Stack.Screen name = 'Admin_View_Event' component={AdminViewEvent} options={{headerShown: false}}/>          
          <Stack.Screen name = 'Teacher_Dashboard' component={TeacherDashboard} options={{headerShown: false}}/>
          <Stack.Screen name = 'Teacher_View_Event' component={TeacherViewEvent} options={{headerShown: false}}/>
          <Stack.Screen name = 'Parent_Dashboard' component={ParentDashboard} options={{headerShown: false}}/>
          <Stack.Screen name = 'Parent_View_Event' component={ParentViewEvent} options={{headerShown: false}}/>
          <Stack.Screen name = 'Parent_View_Teacher' component={ParentViewTeacher} options={{headerShown: false}}/>          
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

