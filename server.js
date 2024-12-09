const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Configuração do servidor
const app = express();
app.use(bodyParser.json());

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',  // Substitua pelo seu host
    user: 'root',       // Substitua pelo seu usuário
    password: '',       // Substitua pela sua senha
    database: 'counter' // Substitua pelo nome do seu banco de dados
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1);
    }
    console.log('Conectado ao banco de dados');
});

// Rota para cadastro de usuário sem bcryptjs (sem criptografar a senha)
app.post('/cadastro', (req, res) => {
    const { Nome_Completo, email, senha, Data_Nasci, Escala_vicio, tempo_gasto, Genero_jogo } = req.body;

    // Validações dos campos obrigatórios
    if (!Nome_Completo || !email || !senha || !Data_Nasci || !Escala_vicio || !tempo_gasto || !Genero_jogo) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Validação da escala de vício
    if (Escala_vicio < 1 || Escala_vicio > 10) {
        return res.status(400).json({ message: 'A escala de vício deve ser entre 1 e 10.' });
    }

    // Validação do tempo gasto
    if (isNaN(tempo_gasto) || tempo_gasto <= 0) {
        return res.status(400).json({ message: 'O tempo gasto deve ser um número positivo.' });
    }

    // Insersão do Usuario no banco mas sem a senha criptográfada 
    const query = `
        INSERT INTO usuario 
        (Nome_Completo, email, Senha, Data_Nasci, Escala_vicio, tempo_gasto, Genero_jogo) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Executando a query
    db.query(query, [Nome_Completo, email, senha, Data_Nasci, Escala_vicio, tempo_gasto, Genero_jogo], (err, results) => {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err);
            res.status(500).json({ message: 'Erro ao cadastrar usuário' });
        } else {
            res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
        }
    });
});

// Definindo a porta para o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
