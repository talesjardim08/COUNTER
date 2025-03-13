import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Button, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications'; 
import axios from 'axios';
import { UserProvider } from './UserContext'; 
import Login from './telas/login';
import Rotas from './telas/Rotas';
import Tinicial from './telas/tinicial';
import Tchat from './telas/tchat';
import Entrada from './telas/entrada';
import Calend from './telas/calend';
import Cad from './telas/cad';
import Cad2 from './telas/cad2';
import cad_rotinas from './telas/cad_rotinas';
import cad_objetivos from './telas/cad_objetivos';

export default function App() {
  const [connectionStatus, setConnectionStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date()); // Estado para a data selecionada
  const Stack = createStackNavigator();

  // Solicitar permissões de notificação no iOS caso precise (Pensei em você em professora KKKKKKKKKKK)
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissões de Notificação', 'Precisamos da sua permissão para enviar notificações!');
      }
    };

    requestPermissions();

    // Função para verificar a conexão
    const checkConnection = async () => {
      try {
        const response = await axios.get('https://counter-1-90ds.onrender.com/conectar');
        if (response?.data?.message) {
          setConnectionStatus(response.data.message);
          Alert.alert('Status da Conexão', response.data.message);
        } else {
          throw new Error('Resposta inesperada do servidor');
        }
      } catch (error) {
        setConnectionStatus('Erro ao conectar ao servidor');
        Alert.alert('Erro de Conexão', 'Erro ao conectar ao servidor');
      }
    };

    checkConnection();
  }, []);

  // Função para agendar a notificação
  const scheduleNotification = async () => {
    try {
      // Verificando se a data selecionada é válida
      if (selectedDate instanceof Date && !isNaN(selectedDate)) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Lembrete",
            body: "É hora de cumprir seu objetivo!",
          },
          trigger: {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1, 
            day: selectedDate.getDate(),
            hour: selectedDate.getHours(),
            minute: selectedDate.getMinutes(),
          },
        });
        Alert.alert('Notificação agendada', 'A notificação foi agendada com sucesso!');
      } else {
        Alert.alert('Erro', 'Por favor, selecione uma data válida.');
      }
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      Alert.alert('Erro', 'Houve um erro ao tentar agendar a notificação.');
    }
  };

  return (
    <UserProvider>
      <NavigationContainer>
        <View style={styles.container}>
          {/* Conteúdo da navegação */}
          <Stack.Navigator>
            <Stack.Screen name="entrada" component={Entrada} options={{ headerShown: false }} />
            <Stack.Screen name="Rotas" component={Rotas} options={{ headerShown: false }} />
            <Stack.Screen name="cad" component={Cad} options={{ headerShown: false }} />
            <Stack.Screen name="cad2" component={Cad2} options={{ headerShown: false }} />
            <Stack.Screen name="cad_rotinas" component={cad_rotinas} options={{ headerShown: false }} />
            <Stack.Screen name="cad_objetivos" component={cad_objetivos} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Tinicial" component={Tinicial} options={{ headerShown: false }} />
            <Stack.Screen name="Tchat" component={Tchat} options={{ headerShown: false }} />
            <Stack.Screen name="Calend" component={Calend} options={{ headerShown: false }} />
          </Stack.Navigator>

          <View style={styles.notificationButtonContainer}>
            <Button title="Agendar Notificação" onPress={scheduleNotification} />
          </View>
        </View>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  notificationButtonContainer: {

    justifyContent: 'center', 
    alignItems: 'center',      
  },
});
