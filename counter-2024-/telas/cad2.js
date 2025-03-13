import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Cadastro2 = ({ route }) => {
  const navigation = useNavigation();
  const { nome, email, senha, dataNasc } = route.params;

  const [escalaVicio, setEscalaVicio] = useState('');
  const [tempoGasto, setTempoGasto] = useState('');
  const [generoJogo, setGeneroJogo] = useState('');

  const handleSubmit = async () => {
    const escalaVicioNumber = parseInt(escalaVicio, 10);

    if (escalaVicioNumber < 1 || escalaVicioNumber > 10) {
      Alert.alert('Erro', 'A escala de vício deve ser entre 1 e 10.');
      return;
    }

    const tempoGastoNumber = parseInt(tempoGasto, 10);
    if (isNaN(tempoGastoNumber) || tempoGastoNumber <= 0) {
      Alert.alert('Erro', 'O tempo gasto deve ser um número positivo.');
      return;
    }

    try {
      const response = await axios.post('https://counter-1-90ds.onrender.com/cadastro', {
        Nome_Completo: nome,
        email,
        Senha: senha,
        Data_Nasci: dataNasc,
        Escala_vicio: escalaVicioNumber,
        tempo_gasto: tempoGastoNumber,
        Genero_jogo: generoJogo,
      });

      if (response.data.message === 'Usuário cadastrado com sucesso') {
        const idUser = response.data.id_user;
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'cad_rotinas', params: { id_user: idUser } }],
        });
      } else {
        Alert.alert('Erro', 'Erro ao cadastrar: ' + response.data.message);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar: ' + error.message);
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.containerLogo}>
        <Text style={styles.welcomeText}>Continuação do cadastro</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escala de Vício (De 0 a 10)"
          placeholderTextColor="#555"
          value={escalaVicio}
          onChangeText={setEscalaVicio}
        />
        <TextInput
          style={styles.input}
          placeholder="Tempo Gasto (ex: 3h por dia)"
          placeholderTextColor="#555"
          value={tempoGasto}
          onChangeText={setTempoGasto}
        />
        <TextInput
          style={styles.input}
          placeholder="Gênero de Jogo (Ação, RPG etc)"
          placeholderTextColor="#555"
          value={generoJogo}
          onChangeText={setGeneroJogo}
        />

        <Button title="Cadastrar" onPress={handleSubmit} />
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

export default Cadastro2;
