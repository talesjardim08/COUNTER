const express = require('express'); // Framework para criar o servidor
const cors = require('cors'); // Middleware para gerenciar permissões de origem cruzada
const mysql = require('mysql2'); // Biblioteca para conectar ao banco de dados
const app = express(); // Inicializa o servidor
const port = process.env.PORT || 3000; // Porta do servidor

// Middleware para gerenciar CORS
app.use(cors()); // Permite requisições de qualquer origem
app.use(express.json()); // Permite que o Express processe requisições no formato JSON

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
    host: 'mysql-counter.alwaysdata.net',
    user: 'counter',
    password: 'Tj120408@',
    database: 'counter_projeto',
});

// Estabelece a conexão com o banco
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao Banco de Dados:', err.stack);
        return;
    }
    console.log('Conexão feita com sucesso ao Banco de Dados');
});

// Rota inicial de teste
app.get('/', (req, res) => {
    res.send('Servidor Funcionando: VAI PALMEIRAS! Meu primeiro servidor BACK-END');
});

// Rota para verificar a conexão com o banco
app.get('/conectar', (req, res) => {
    db.ping((err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            res.status(500).json({ message: 'Erro ao conectar ao banco de dados', error: err });
        } else {
            console.log('Conexão com o banco de dados está ativa');
            res.status(200).json({ message: 'Conexão com o banco de dados bem-sucedida!' });
        }
    });
});

// Rota para login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const query = 'SELECT * FROM usuario WHERE email = ? AND Senha = ?';

    db.query(query, [email, senha], (err, results) => {
        if (err) {
            console.error('Erro ao realizar login:', err);
            res.status(500).send('Erro ao realizar login');
        } else if (results.length > 0) {
            res.status(200).json({
                message: 'Login bem-sucedido',
                user: results[0], // Retorna os dados do usuário
            });
        } else {
            res.status(401).send('Credenciais inválidas');
        }
    });
});

// Rota para cadastro de usuário
app.post('/cadastro', (req, res) => {
    const { Nome_Completo, email, senha, Data_Nasci, Escala_vicio, tempo_gasto, Genero_jogo } = req.body;

    const query = `
        INSERT INTO usuario 
        (Nome_Completo, email, Senha, Data_Nasci, Escala_vicio, tempo_gasto, Genero_jogo) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [Nome_Completo, email, senha, Data_Nasci, Escala_vicio, tempo_gasto, Genero_jogo], (err, results) => {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err);
            res.status(500).send('Erro ao cadastrar usuário');
        } else {
            res.status(201).send('Usuário cadastrado com sucesso');
        }
    });
});

// Rota para atualizar preferências do usuário
app.post('/preferencias', (req, res) => {
    const { id_user, escala_vicio, tempo_gasto, genero_jogo } = req.body;

    const query = `
        UPDATE usuario 
        SET Escala_vicio = ?, tempo_gasto = ?, Genero_jogo = ? 
        WHERE id_user = ?
    `;

    db.query(query, [escala_vicio, tempo_gasto, genero_jogo, id_user], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar preferências:', err);
            res.status(500).send('Erro ao atualizar preferências');
        } else {
            res.send('Preferências atualizadas com sucesso');
        }
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
