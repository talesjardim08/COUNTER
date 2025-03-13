import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import { useUser } from '../UserContext'; 

// Importação das telas
import Tinicialscreen from './tinicial';
import Segundatelascreen from './segundatela';
import Tchatscreen from './tchat';
import Calendscreen from './calend';

const Tab = createBottomTabNavigator();

export default function Rotas(props) {
  const { user, logout } = useUser(); // Obter informações do usuário e função de logout do contexto

  if (!user) {
    props.navigation.navigate('Login'); 
    return null;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { 
          backgroundColor: '#0b2545', 
          paddingHorizontal: 10, 
        },
        tabBarActiveTintColor: 'white',
        headerShown: false,
        tabBarItemStyle: { alignItems: 'center' }, 
      }}
    >
      <Tab.Screen
        name="tinicial"
        component={Tinicialscreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="game-controller" size={30} color="white" />
            ) : (
              <Ionicons name="game-controller-outline" size={30} color="white" />
            ),
        }}
      />
      <Tab.Screen
        name="tchat"
        component={Tchatscreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="chatbubble" size={30} color="white" />
            ) : (
              <Ionicons name="chatbubble-outline" size={30} color="white" />
            ),
        }}
      />
      <Tab.Screen
        name="calend"
        component={Calendscreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="calendar" size={30} color="white" />
            ) : (
              <Ionicons name="calendar-outline" size={30} color="white" />
            ),
        }}
      />
      <Tab.Screen
        name="segundatela"
        component={Segundatelascreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person-circle" size={30} color="white" />
            ) : (
              <Ionicons name="person-circle-outline" size={30} color="white" />
            ),
          tabBarPosition: 'right', 
        }}
      />
    </Tab.Navigator>
  );
}
