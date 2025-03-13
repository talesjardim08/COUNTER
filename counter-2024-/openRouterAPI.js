import axios from 'axios'; // Biblioteca para facilitar requisições HTTP

const OPENROUTER_API_KEY = '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'; // chave da API OpenRouter
const SERVER_API_KEY = "https://counter-1-90ds.onrender.com:10000"; // URL do servidor

// Função para enviar requisições ao OpenRouter
export const enviarRequisicoesOpenRouter = async (prompt) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions', // URL da API OpenRouter
      {
        model: 'gpt-3.5-turbo', // Modelo da IA
        messages: [{ role: 'user', content: prompt }], 
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`, // Autorização com o token do OpenRouter
          'Content-Type': 'application/json', // Definir o tipo de conteúdo como JSON
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error('Falha ao conectar à requisição OpenRouter', error);
    return null;
  }
};

// Função de login no servidor (conexão com o banco de dados)
export const loginUsuario = async (email, senha) => {
  try {
    const response = await axios.post(`${SERVER_API_KEY}/login`, { email, senha });
    return response.data; 
  } catch (error) {
    console.error('Erro no login', error);
    return null; // Retorna null se houver erro
  }
};

// Função de cadastro no servidor
export const cadastrarUsuario = async (email, senha, nome) => {
  try {
    const response = await axios.post(`${SERVER_API_KEY}/cadastro`, { email, senha, nome });
    return response.data; 
  } catch (error) {
    console.error('Erro no cadastro', error);
    return null; // Retorna null se houver erro
  }
};

// Função para atualizar as preferências do usuário
export const atualizarPreferencias = async (id_user, escala_vicio, tempo_gasto, genero_jogo) => {
  try {
    const response = await axios.post(`${SERVER_API_KEY}/preferencias`, { id_user, escala_vicio, tempo_gasto, genero_jogo });
    return response.data; // Retorna resposta da atualização
  } catch (error) {
    console.error('Erro ao atualizar preferências', error);
    return null;
  }
};
