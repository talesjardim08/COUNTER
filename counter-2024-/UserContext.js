import React, { createContext, useState, useContext } from 'react';

// Criação do contexto de usuário
const UserContext = createContext();

// Provedor do contexto de usuário
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Função para logar o usuário
  const login = (userData) => {
    setUser(userData); // Atualiza o estado com os dados do usuário
  };

  // Função para deslogar o usuário
  const logout = () => {
    setUser(null); // Limpa o estado do usuário no logout
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook customizado para acessar o contexto de usuário
export const useUser = () => useContext(UserContext);
