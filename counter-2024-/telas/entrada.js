import React from 'react';
import { KeyboardAvoidingView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function Entrada(props) {
  return (
    <KeyboardAvoidingView style={styles.background} behavior="padding">
      <View style={styles.containerLogo}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.welcbc}>Bem-vindo ao aplicativo!</Text>

      <View style={styles.container}>
        <TouchableOpacity onPress={() => props.navigation.navigate('Login')} style={styles.btnLog}>
          <Text style={styles.textLog}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => props.navigation.navigate('cad')} style={styles.btnCad}>
          <Text style={styles.textCad}>CADASTRO</Text>
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
    backgroundColor: "#134074" 
  },
  containerLogo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%', 
    marginBottom: 30,
  },
  logo: {
    width: '100%', 
    height: undefined, // Deixa a altura ser ajustada automaticamente
    aspectRatio: 1, // Manter proporção da imagem original
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  btnCad: {
    backgroundColor: "#134074",
    width: '90%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    margin: 5,
    paddingHorizontal: 40,
  },
  btnLog: {
    backgroundColor: "#e6e6fa",
    width: '90%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    margin: 5,
    paddingHorizontal: 40, 
  },
  textCad: {
    color: '#e6e6fa'
  },
  textLog: {
    color: '#134074'
  },
  welcbc: {
    color: '#e6e6fa',
    fontSize: 20,
    marginBottom: 20,
  }
});
