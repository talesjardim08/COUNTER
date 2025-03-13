import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const CadastroObjetivos = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id_rotina } = route.params;

  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataConclusao, setDataConclusao] = useState('');
  const [status, setStatus] = useState('');

  const handleCadastrarObjetivo = async () => {
    if (!descricao || !dataInicio || !dataConclusao || !status) {
      Alert.alert('Erro', 'Preencha todos os campos antes de cadastrar o objetivo.');
      return;
    }

    try {
      const response = await axios.post('https://counter-1-90ds.onrender.com/objetivo', {
        id_rotinafk: id_rotina,
        descricao,
        data_i: dataInicio,
        data_c: dataConclusao,
        status,
      });

      if (response.data.message === 'Objetivo cadastrado com sucesso') {
        Alert.alert('Sucesso', 'Objetivo cadastrado com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.replace('Login');  
            },
          },
        ]);
      } else {
        Alert.alert('Erro', 'Erro ao cadastrar objetivo: ' + response.data.message);
      }
    } catch (error) {
      console.error('Erro ao cadastrar objetivo:', error);
      Alert.alert('Erro', 'Erro ao cadastrar objetivo: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.containerLogo}>
        <Text style={styles.welcomeText}>Cadastro de Objetivos</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Descrição do Objetivo"
          placeholderTextColor="#555"
          value={descricao}
          onChangeText={setDescricao}
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Início (ex: 2024-12-01)"
          placeholderTextColor="#555"
          value={dataInicio}
          onChangeText={setDataInicio}
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Conclusão (ex: 2024-12-31)"
          placeholderTextColor="#555"
          value={dataConclusao}
          onChangeText={setDataConclusao}
        />
        <TextInput
          style={styles.input}
          placeholder="Status (ex: Em andamento)"
          placeholderTextColor="#555"
          value={status}
          onChangeText={setStatus}
        />

        <Button title="Cadastrar Objetivo" onPress={handleCadastrarObjetivo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#134074",
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#e6e6fa',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    flex: 2,
    width: '90%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#e6e6fa',
    width: '100%',
    height: 50,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#222',
  },
});

export default CadastroObjetivos;
