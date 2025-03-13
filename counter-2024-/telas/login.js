import React, { useState } from 'react';
import { KeyboardAvoidingView, View, Image, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useUser } from '../UserContext'; // Importando o contexto de usuário

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useUser(); // Obtendo a função de login do contexto

  // Função de login
  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Realizando a requisição de login
      const response = await axios.post('https://counter-1-90ds.onrender.com/login', { email, senha });

      console.log('Resposta do servidor:', response.data); // Verificando a resposta do servidor

      if (response.data.success && response.data.user) {
        const userId = response.data.user.id_user;
        console.log('ID do usuário:', userId); // Verificando se o ID está correto

        // Passa os dados do usuário para o contexto
        login(response.data.user);

        // Faz a requisição para pegar mais informações do usuário para usar na IA
        const userInfoResponse = await axios.get(`https://counter-1-90ds.onrender.com/informacoesUsuario/${userId}`);
        
        if (userInfoResponse && userInfoResponse.data && userInfoResponse.data.usuario) {
          console.log('Informações adicionais do usuário:', userInfoResponse.data.usuario);
        } else {
          throw new Error('Informações do usuário não estão disponíveis');
        }

        console.log('Usuário logado no contexto:', response.data.user); // log para ver se os dados estão sendo passados corretamente
        navigation.navigate('Rotas'); 
      } else {
        Alert.alert('Erro', response.data.message || 'Email ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro na requisição:', error.message);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível conectar ao servidor. Verifique sua conexão.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.background}>
      <View style={styles.containerLogo}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity onPress={handleLogin} style={styles.btnLogin}>
          <Text style={styles.textLogin}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#134074',
  },
  containerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginBottom: 30,
  },
  logo: {
    width: '100%',
    height: 200,
    borderRadius: 7,
  },
  welcomeText: {
    color: '#e6e6fa',
    fontSize: 30,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  input: {
    backgroundColor: '#e6e6fa',
    width: '90%',
    marginBottom: 15,
    color: '#222',
    fontSize: 20,
    borderRadius: 3,
    padding: 15,
  },
  btnLogin: {
    backgroundColor: '#0b2545',
    width: '90%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  textLogin: {
    color: '#eef4ed',
    fontSize: 18,
  },
});
