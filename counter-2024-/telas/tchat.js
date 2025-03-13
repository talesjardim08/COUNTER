import React, { useState, useEffect } from "react";
import { Text, View, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useUser } from '../UserContext'; 
import { enviarRequisicoesOpenRouter } from '../openRouterAPI'; // Função para enviar requisições à API

const TelaDeChat = () => {
  const { user } = useUser(); // Obtendo as informações do usuário logado
  const [mensagens, setMensagens] = useState([
    { id: '1', texto: 'Olá! Como posso ajudar você hoje?', remetente: 'bot' },
  ]);
  const [mensagemInput, setMensagemInput] = useState(''); // Estado para o campo de input
  const [loading, setLoading] = useState(true); // Estado para verificar o carregamento da primeira mensagem

  useEffect(() => {
    if (!user || !user.id_user) return; // Verifica se o usuário está logado

    const fetchUsuario = async () => {
      try {
        const response = await axios.get(`https://counter-1-90ds.onrender.com/informacoesUsuario/${user.id_user}`);
        if (response.data.success && response.data.usuario) {
          gerarDicaUsuario(response.data.usuario); // Chama a função para gerar a dica personalizada
        } else {
          throw new Error('Informações do usuário não encontradas');
        }
      } catch (error) {
        console.error('Erro ao pegar as informações do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [user]);

  const gerarDicaUsuario = async (usuario) => {
    if (!usuario) return;

    const { Data_Nasci, Escala_vicio, tempo_gasto, rotina_descricao, objetivo_descricao } = usuario;

    const idade = new Date().getFullYear() - new Date(Data_Nasci).getFullYear();
    
    const prompt = `
      Agora você se chama Visconte, o mascote do aplicativo Counter(se apresente assim)!
      Com base nas informações a seguir faça uma dica personalizada para o usuario com esses dados
      - Idade: ${idade} anos
      - Nível de vício em jogos: ${Escala_vicio} de 10
      - Tempo gasto jogando: ${tempo_gasto}
      - Rotina diária sugerida: ${rotina_descricao}
      - Objetivo do usuário: ${objetivo_descricao}
      
      A dica será curta e focada em melhorar o equilíbrio entre o jogo e a vida. Leve em conta todos os dados dele para gerar a dica
    `;

    try {
      const response = await enviarRequisicoesOpenRouter(prompt); 
      if (response && response.choices && response.choices[0]) {
        setMensagens(prevMensagens => [
          ...prevMensagens,
          { id: '2', texto: response.choices[0].message.content, remetente: 'bot' }
        ]);
      }
    } catch (error) {
      console.error('Erro ao gerar a dica do usuário:', error);
      setMensagens(prevMensagens => [
        ...prevMensagens,
        { id: '2', texto: 'Não conseguimos gerar uma dica no momento.', remetente: 'bot' }
      ]);
    }
  };

  const enviarMensagem = () => {
    if (mensagemInput.trim() === '') return; 

    setMensagens(prevMensagens => [
      ...prevMensagens,
      { id: `${mensagens.length + 1}`, texto: mensagemInput, remetente: 'usuario' }
    ]);
    
    setMensagemInput('');

    // Envia a mensagem para a API e aguarda a resposta
    const prompt = `Responda de forma objetiva e amigável à seguinte mensagem do usuário: "${mensagemInput}"`;

    // resposta da Ia
    enviarRequisicoesOpenRouter(prompt)
      .then(response => {
        if (response && response.choices && response.choices[0]) {
          setMensagens(prevMensagens => [
            ...prevMensagens,
            { id: `${mensagens.length + 2}`, texto: response.choices[0].message.content, remetente: 'bot' }
          ]);
        }
      })
      .catch(error => {
        console.error('Erro ao enviar a mensagem:', error);
        setMensagens(prevMensagens => [
          ...prevMensagens,
          { id: `${mensagens.length + 2}`, texto: 'Desculpe, houve um erro. Tente novamente.', remetente: 'bot' }
        ]);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.tituloCabecalho}>COUNTER</Text>
      </View>

      <FlatList
        data={mensagens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.caixaMensagem,
              item.remetente === 'usuario' ? styles.mensagemUsuario : styles.mensagemBot,
            ]}
          >
            <Text style={styles.textoMensagem}>{item.texto}</Text>
          </View>
        )}
        contentContainerStyle={styles.listaMensagens}
      />

      <View style={styles.caixaEntrada}>
        <TextInput
          style={styles.campoTexto}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#999"
          value={mensagemInput}
          onChangeText={setMensagemInput}
        />
        <TouchableOpacity style={styles.botaoEnviar} onPress={enviarMensagem}>
          <Text style={styles.textoBotaoEnviar}>Enviar</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0b2545" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8da9c4',
  },
  cabecalho: {
    height: 60,
    backgroundColor: '#0b2545',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20, 
  },
  tituloCabecalho: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listaMensagens: {
    flexGrow: 1,
    padding: 10,
  },
  caixaMensagem: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  mensagemUsuario: {
    alignSelf: 'flex-end',
    backgroundColor: '#e6e6fa',
  },
  mensagemBot: {
    alignSelf: 'flex-start',
    backgroundColor: '#e6e6fa',
  },
  textoMensagem: {
    fontSize: 16,
  },
  caixaEntrada: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  campoTexto: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  botaoEnviar: {
    marginLeft: 10,
    backgroundColor: '#0b2545',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textoBotaoEnviar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
});

export default TelaDeChat;
