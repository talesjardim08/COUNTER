import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars'; // Componente de calendário
import Modal from 'react-native-modal'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios'; 
import PushNotification from 'react-native-push-notification'; // Para notificações

const Calendario = () => {
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [texto, setTexto] = useState('');
  const [eventos, setEventos] = useState({});
  const [userId, setUserId] = useState(null); // Estado para armazenar o id do usuário

  // Função para alterar a visibilidade do modal
  const toggleModal = () => {
    setModalVisivel(!modalVisivel);
  };

  // Função para adicionar eventos ao estado e ao AsyncStorage
  const adicionarEventos = async () => {
    if (!texto) return;

    const eventosAtualizados = {
      ...eventos,
      [dataSelecionada]: [...(eventos[dataSelecionada] || []), texto],
    };

    setEventos(eventosAtualizados); 
    await AsyncStorage.setItem('eventos', JSON.stringify(eventosAtualizados)); // Salva os eventos no AsyncStorage (por algum motivo não quer salvar no banco e não sei oq pq)
    setTexto(''); 
    toggleModal(); 

    // Agendar notificação  no push mas não está mais disponivel pq o expo não é compativel 
    if (PushNotification && PushNotification.localNotificationSchedule) {
      PushNotification.localNotificationSchedule({
        title: 'Lembrete',
        message: `Evento: ${texto}`,
        date: new Date(dataSelecionada), 
        allowWhileIdle: true,
      });
    } else {
      console.error('PushNotification não está disponível');
    }
  };

  // Função para carregar eventos do AsyncStorage
  const carregarEventos = async () => {
    const eventosArmazenados = await AsyncStorage.getItem('eventos');
    if (eventosArmazenados) {
      setEventos(JSON.parse(eventosArmazenados)); 
    }
  };

  // Função para carregar eventos do back-end 
  const carregarEventosBackend = useCallback(async () => {
    if (userId) {
      try {
        const response = await axios.get(`https://counter-1-90ds.onrender.com/eventosUsuario/${userId}`);
        const eventosData = response.data.usuario;
        setEventos(eventosData);
      } catch (error) {
        console.error('Erro ao carregar eventos do back-end:', error);
        Alert.alert('Erro', 'Não foi possível carregar os eventos do servidor.');
      }
    }
  }, [userId]);


  useEffect(() => {
    carregarEventos(); 
  }, []);

  // useEffect para carregar o userId e eventos do back-end
  useEffect(() => {
    const obterUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId); // Carrega o userId após o login
      }
    };

    obterUserId(); 
  }, []);

  useEffect(() => {
    if (userId) {
      carregarEventosBackend(); 
    }
  }, [userId, carregarEventosBackend]);

 
  useEffect(() => {
    const checkInitialNotification = async () => {
      if (PushNotification && PushNotification.getInitialNotification) {
        try {
          const notification = await PushNotification.getInitialNotification();
          if (notification) {
            console.log('Notificação inicial recebida', notification);
          }
        } catch (error) {
          console.log('Erro ao obter notificação inicial', error);
        }
      } else {
        console.error('PushNotification não está disponível para obter notificações iniciais');
      }
    };

    checkInitialNotification();  
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>ORGANIZADOR DE TEMPO</Text>
      </View>

      <Calendar
        onDayPress={(day) => {
          setDataSelecionada(day.dateString); 
          toggleModal(); 
        }}
        markedDates={Object.keys(eventos).reduce((acc, date) => {
          acc[date] = { marked: true, dotColor: '#4CAF50', activeOpacity: 0.7 };
          return acc;
        }, {})}
        monthFormat={'dd MMM yyyy'} 
        firstDay={1} 
      />


      {dataSelecionada && (
        <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}

      <Modal isVisible={modalVisivel}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Adicionar evento para: {dataSelecionada}</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite o evento"
            value={texto}
            onChangeText={setTexto}
          />

          <View style={styles.buttonsContainer}>
            <Button title="Salvar" onPress={adicionarEventos} color="#4CAF50" />
            <Button title="Cancelar" onPress={toggleModal} color="#f44336" />
          </View>
        </View>
      </Modal>

      <FlatList
        data={eventos[dataSelecionada] || []}
        keyExtractor={(item, index) => `${dataSelecionada}-${index}`}
        renderItem={({ item }) => <Text style={styles.evento}>{item}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#0b2545',
    padding: 20,
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 20,
  },
  textHeader: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0b2545',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 15,
  },
  evento: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default Calendario;
