import React, { useState } from 'react';
import { KeyboardAvoidingView, View, Image, TextInput, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';

export default function CadastroInicial({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [dataNasc, setDataNasc] = useState('');

  // Função para validar o formato do email
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  // Função para validar a data de nascimento
  const isValidDate = (data) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(data);
  };

  const handleNext = () => {
    if (!isValidEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um email válido.");
      return;
    }

    if (!isValidDate(dataNasc)) {
      Alert.alert("Erro", "Por favor, insira uma data de nascimento válida.");
      return;
    }

    if (senha !== confirmSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    navigation.navigate('cad2', { nome, email, senha, dataNasc });
  };

  return (
    <KeyboardAvoidingView style={styles.background}>
      <View style={styles.containerLogo}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
      </View>

      <Text style={styles.welcomeText}>Bem-vindo!</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          placeholderTextColor="#555"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#555"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          placeholderTextColor="#555"
          secureTextEntry
          value={confirmSenha}
          onChangeText={setConfirmSenha}
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Nascimento (AAAA-MM-DD)"
          placeholderTextColor="#555"
          value={dataNasc}
          onChangeText={setDataNasc}
        />

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

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
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
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
  button: {
    backgroundColor: "#0b2545",
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#eef4ed',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
