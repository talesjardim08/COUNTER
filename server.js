const express = require('express'); // Importa o módulo responsável por criar o servidor
const mysql = require('mysql2'); // Importa o módulo responsável pela conexão com o banco
const app = express(); // Cria uma instância do express para configurar o servidor
const port = process.env.PORT || 3000;


app.use(express.json());

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
        console.error('Erro ao conectar ao Banco de Dados:', err.stack);
        return; // Sai da função em caso de erro
    }
    console.log('Conexão feita com sucesso ao Banco de Dados');
});

// Define uma rota GET simples para testar o servidor
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

// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
