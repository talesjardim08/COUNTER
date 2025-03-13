import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { useUser } from '../UserContext';
import { enviarRequisicoesOpenRouter } from '../openRouterAPI';
import BGS24Img from '../assets/BGS24.jpg'; 
import vicio from '../assets/vicio.jfif';
import VR from '../assets/VR.jpg';

export default function Outratela() {
  const { user } = useUser(); // Obtém o usuário logado do contexto
  const [fraseDoDia, setFraseDoDia] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null); 
  const [noticias, setNoticias] = useState([]); // Estado para armazenar notícias

  useEffect(() => {
    if (!user || !user.id_user) return; 

    const fetchUsuario = async () => {
      try {
        const response = await axios.get(`https://counter-1-90ds.onrender.com/informacoesUsuario/${user.id_user}`);
        if (response.data.success && response.data.usuario) {
          gerarFraseDoDia(response.data.usuario); // Gera a frase do dia com os dados do usuário
        } else {
          throw new Error('Informações do usuário não encontradas');
        }
      } catch (error) {
        console.error('Erro ao pegar as informações do usuário:', error);
        setErro('Não foi possível carregar as informações do usuário'); 
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [user]);

  useEffect(() => {
    const noticiasData = [
      {
        titulo: "BGS24: A maior feira de games da América Latina",
        conteudo: "A BGS24 está com muitas novidades para os fãs de jogos, com estandes de grandes publishers e novidades exclusivas!",
        fonte: "Fonte: G1 Jogos",
        imagem: BGS24Img
      },
      {
        titulo: "O Perigo do Vício em Jogos: Quando a Diversão se Torna uma Dependência",
        conteudo: "Especialistas alertam sobre os riscos do excesso de tempo gasto em jogos eletrônicos e as consequências para a saúde mental.",
        fonte: "Fonte: UOL Tecnologia",
        imagem: vicio
      },
      {
        titulo: "O Futuro dos Jogos com Realidade Virtual: O que Esperar?",
        conteudo: "A realidade virtual promete revolucionar a indústria de games nos próximos anos, trazendo uma nova experiência imersiva.",
        fonte: "Fonte: TechCrunch",
        imagem: VR
      },
    ];

    setNoticias(noticiasData);
  }, []);

  const gerarFraseDoDia = async (usuario) => {
    if (!usuario) return;

    const { Data_Nasci, Escala_vicio, tempo_gasto, rotina_descricao, objetivo_descricao } = usuario;

    const idade = new Date().getFullYear() - new Date(Data_Nasci).getFullYear();
    
    const prompt = `
      Crie uma frase motivacional personalizada para um jogador (que está viciado) com as seguintes características: 
      - Idade: ${idade} anos
      - Nível de vício em jogos: ${Escala_vicio} de 10
      - Tempo gasto jogando: ${tempo_gasto}
      - Rotina diária sugerida: ${rotina_descricao}
      - Objetivo do usuário: ${objetivo_descricao}
      Não faça uma frase tão longa e tente usar trocadilhos gamer
    `;

    try {
      const response = await enviarRequisicoesOpenRouter(prompt); // Chama a função que faz a requisição à nova IA
      if (response && response.choices && response.choices[0]) {
        setFraseDoDia(response.choices[0].message.content); // Atualiza a frase do dia com a resposta da IA
      } else {
        setFraseDoDia('Não conseguimos gerar uma frase no momento.'); 
      }
    } catch (error) {
      console.error('Erro ao gerar frase do dia:', error);
      setErro('Não foi possível gerar a frase do dia'); 
    }
  };

  return (
    <ScrollView style={styles.fundo}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.welcomeMessage}>Bem-vindo!</Text>
      </SafeAreaView>

      <SafeAreaView style={styles.frasedodiaContainer}>
        <Text style={styles.titfrasedodia}>FRASE DO DIA</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#134074" style={styles.loader} />
        ) : erro ? (
          <Text style={styles.erroText}>{erro}</Text> // Exibe erro se houver
        ) : (
          <Text style={styles.frasedodia}>
            {fraseDoDia || 'Carregando frase do dia...'}
          </Text>
        )}
      </SafeAreaView>

      <SafeAreaView style={styles.noticiasContainer}>
        <Text style={styles.titNoticias}>NOTÍCIAS</Text>
        {noticias.length > 0 ? (
          noticias.map((noticia, index) => (
            <View key={index} style={styles.noticiaItem}>
              <Image source={noticia.imagem} style={styles.noticiaImagem} />
              <Text style={styles.noticiaTitulo}>{noticia.titulo}</Text>
              <Text style={styles.noticiaConteudo}>{noticia.conteudo}</Text>
              <Text style={styles.noticiaFonte}>{noticia.fonte}</Text>
            </View>
          ))
        ) : (
          <ActivityIndicator size="large" color="#134074" style={styles.loader} />
        )}
      </SafeAreaView>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0b2545',
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#4B9CD3', 
  },
  welcomeMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 15,
  },
  fundo: {
    backgroundColor: '#8da9c4',
    flex: 1,
  },
  frasedodiaContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
    paddingHorizontal: 20,
  },
  frasedodia: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#0b2545',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 8,
    fontSize: 16,
    fontStyle: 'italic',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  titfrasedodia: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  erroText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
    marginTop: 20,
  },
  noticiasContainer: {
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  titNoticias: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  noticiaItem: {
    backgroundColor: '#0b2545',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 5, 
  },
  noticiaImagem: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  noticiaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  noticiaConteudo: {
    fontSize: 14,
    color: 'white',
    marginVertical: 5,
  },
  noticiaFonte: {
    fontSize: 12,
    color: '#A9A9A9',
  },
  loader: {
    marginTop: 30,
  },
});
