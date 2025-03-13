import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../UserContext';

const ProfileScreen = ({ navigation }) => {
  const { user } = useUser(); 

  if (!user) {
    return (
      <SafeAreaView style={styles.fundo}>
        <Text style={styles.cabecalho}>Perfil do Usuário</Text>
        <Text style={styles.warningText}>Usuário não encontrado!</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.fundo}>
      <View style={styles.container}>
        <Text style={styles.cabecalho}>Perfil do Usuário</Text>
      </View>

      <View style={styles.container2}>
        <TouchableOpacity style={styles.avatar}>
          <Ionicons name="camera-outline" size={80} color="black" style={styles.icon} />
        </TouchableOpacity>

        <Text style={styles.name}>{user.nome || 'Nome não disponível'}</Text> //NOME DO USUARIO NÂO QUER APARECER DE JEITO NHENUM AAAAAAA
        <Text style={styles.email}>{user.email || 'Email não disponível'}</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Tusuario')} style={styles.btnPerfil}>
          <Text style={styles.btnTexto}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  container: {
    backgroundColor: '#0b2545',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,  
    paddingBottom: 20,
    marginBottom: 20,  
  },
  cabecalho: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  warningText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'red',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    backgroundColor: '#335a9a',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginTop: 10,  
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 20,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  btnPerfil: {
    backgroundColor: '#0b2545',
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  btnTexto: {
    fontSize: 16,
    color: 'white',
  },
});

export default ProfileScreen;
