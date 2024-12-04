const express = require('express'); // Importa o módulo responsável por criar o servidor
const mysql = require('mysql2'); // Importa o módulo responsável pela conexão com o banco
const app = express(); // Cria uma instância do express para configurar o servidor
const port = process.env.PORT || 3000;

app.use(express.json()); // Permite que o Express aceite requisições no formato JSON

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
    host: 'sql213.infinityfree.com', 
    user: 'if0_37838629', 
    password: 'COUNTER2024', 
    database: 'if0_37838629_counter' 
});

// Estabelece a conexão com o banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao Banco de Dados:', err.stack); // Exibe erro se falhar
        return;
    }
    console.log('Conexão feita com sucesso ao Banco de Dados'); // Mensagem de sucesso
});

// Rota GET simples para testar se o servidor está funcionando
app.get('/', (req, res) => {
    res.send('Servidor Funcionando: VAI PALMEIRAS! Meu primeiro servidor BACK-END');
});

// Rota para cadastrar ou atualizar as preferências do usuário
app.post('/preferencias', (req, res) => {
    const { id_user, escala_vicio, tempo_gasto, genero_jogo } = req.body;
    const query = 'UPDATE usuario SET Escala_vicio = ?, tempo_gasto = ?, Genero_jogo = ? WHERE id_user = ?';

    db.query(query, [escala_vicio, tempo_gasto, genero_jogo, id_user], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar preferências:', err);
            res.status(500).send('Erro ao atualizar preferências');
        } else {
            res.send('Preferências atualizadas com sucesso');
        }
    });
});

// Rota para login
app.post('/login', (req, res) => {
    const { email, senha } = req.body; // Recebe as credenciais do cliente
    const query = 'SELECT * FROM usuario WHERE email = ? AND Senha = ?';

    db.query(query, [email, senha], (err, results) => {
        if (err) {
            console.error('Erro ao realizar login:', err);
            res.status(500).send('Erro ao realizar login');
        } else if (results.length > 0) {
            res.status(200).json({
                message: 'Login bem-sucedido',
                user: results[0] // Retorna as informações do usuário logado
            });
        } else {
            res.status(401).send('Credenciais inválidas'); // Retorna erro se o login falhar
        }
    });
});

// Rota para verificar a conexão com o banco de dados
app.get('/conectar', (req, res) => {
    db.ping((err) => {  // Método ping para testar a conexão ativa com o banco
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            res.status(500).json({ message: 'Erro ao conectar ao banco de dados', error: err });
        } else {
            console.log('Conexão com o banco de dados está ativa');
            res.status(200).json({ message: 'Conexão com o banco de dados bem-sucedida!' });
        }
    });
});

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


// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
