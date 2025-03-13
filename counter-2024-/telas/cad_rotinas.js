import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const CadastroRotinas = ({ route }) => {
  const navigation = useNavigation();
  const { id_user } = route.params;

  const [rotina, setRotina] = useState('');
  const [horario, setHorario] = useState('');
  const [duracao, setDuracao] = useState('');

  const handleCadastrarRotina = async () => {
    if (!rotina || !horario || !duracao) {
      Alert.alert('Erro', 'Preencha todos os campos antes de cadastrar a rotina.');
      return;
    }

    try {
      const response = await axios.post('https://counter-1-90ds.onrender.com/rotina', {
        id_user,
        descricao: rotina,
        horario,
        duracao,
      });

      // Verifica se a rotina foi adicionada com sucesso
      if (response.data.message === 'Rotina adicionada com sucesso') {
        const idRotina = response.data.rotina_id; // Obtém o id_rotina da resposta

        // Verifica se o id_rotina foi retornado corretamente
        if (idRotina) {
          Alert.alert('Sucesso', 'Rotina cadastrada com sucesso!', [
            {
              text: 'OK',
              onPress: () => {
                // Redireciona para a tela de cad_objetivos, passando o id_rotina
                navigation.replace('cad_objetivos', { id_rotina: idRotina });
              },
            },
          ]);
        } else {
          Alert.alert('Erro', 'Erro: id_rotina não encontrado.');
        }
      } else {
        Alert.alert('Erro', 'Erro ao cadastrar rotina: ' + response.data.message);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar rotina: ' + error.message);
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.containerLogo}>
        <Text style={styles.welcomeText}>Cadastro de Rotinas</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Descrição da Rotina"
          placeholderTextColor="#555"
          value={rotina}
          onChangeText={setRotina}
        />
        <TextInput
          style={styles.input}
          placeholder="Horário (ex: 14:00)"
          placeholderTextColor="#555"
          value={horario}
          onChangeText={setHorario}
        />
        <TextInput
          style={styles.input}
          placeholder="Duração (ex: 2h)"
          placeholderTextColor="#555"
          value={duracao}
          onChangeText={setDuracao}
        />

        <Button title="Cadastrar Rotina" onPress={handleCadastrarRotina} />
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

export default CadastroRotinas;
