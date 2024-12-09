const express = require('express'); // Framework para criar o servidor
const cors = require('cors'); // Middleware para gerenciar permissões de origem cruzada
const mysql = require('mysql2'); // Biblioteca para conectar ao banco de dados
const app = express(); // Inicializa o servidor

const port = process.env.PORT || 10000; // Porta do servidor

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
            res.status(500).json({ message: 'Erro ao conectar ao banco de dados', error: err.message });
        } else {
            console.log('Conexão com o banco de dados está ativa');
            res.status(200).json({ message: 'Conexão com o banco de dados bem-sucedida!' });
        }
    });
});

// Rota para login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    const query = 'SELECT * FROM usuario WHERE email = ?';

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Erro ao realizar login:', err.message);
            return res.status(500).json({ message: 'Erro ao realizar login', error: err.message });
        } else if (results.length > 0) {
            const user = results[0];
            // Comparando a senha em texto simples
            if (senha === user.Senha) {
                res.status(200).json({
                    message: 'Login bem-sucedido',
                    user: user,
                });
            } else {
                res.status(401).json({ message: 'Credenciais inválidas' });
            }
        } else {
            res.status(401).json({ message: 'Credenciais inválidas' });
        }
    });
});

// Rota para cadastro de usuário
app.post('/cadastro', async (req, res) => {
    const { Nome_Completo, email, Senha, Data_Nasci, Escala_vicio, tempo_gasto, Genero_jogo } = req.body;

    console.log('Dados recebidos:', req.body);

    if (!Nome_Completo || !email || !Senha || !Data_Nasci || !Escala_vicio || !tempo_gasto || !Genero_jogo) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    if (Escala_vicio < 1 || Escala_vicio > 10) {
        return res.status(400).json({ message: 'A escala de vício deve ser entre 1 e 10.' });
    }

    if (isNaN(tempo_gasto) || tempo_gasto <= 0) {
        return res.status(400).json({ message: 'O tempo gasto deve ser um número positivo.' });
    }

    const query = `
        INSERT INTO usuario 
        (Nome_Completo, email, Senha, Data_Nasci, Escala_vicio, tempo_gasto, Genero_jogo) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [results] = await db.promise().query(query, [Nome_Completo, email, Senha, Data_Nasci, Escala_vicio, tempo_gasto, Genero_jogo]);
        const id_user = results.insertId;
        res.status(201).json({ message: 'Usuário cadastrado com sucesso', id_user });
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).json({ message: 'Erro ao cadastrar usuário', error: err });
    }
});

// Rota para adicionar rotina
app.post('/rotina', async (req, res) => {
    const { id_user, descricao, horario, duracao } = req.body;

    if (!id_user || !descricao || !horario || !duracao) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const query = `
        INSERT INTO rotina 
        (id_userfk, descricao, horario, duracao) 
        VALUES (?, ?, ?, ?)
    `;

    try {
        const [results] = await db.promise().query(query, [id_user, descricao, horario, duracao]);
        res.status(201).json({ message: 'Rotina adicionada com sucesso', rotina_id: results.insertId });
    } catch (err) {
        console.error('Erro ao adicionar rotina:', err);
        res.status(500).json({ message: 'Erro ao adicionar rotina', error: err });
    }
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
            console.error('Erro ao atualizar preferências:', err.message);
            res.status(500).json({ message: 'Erro ao atualizar preferências', error: err.message });
        } else {
            res.status(200).json({ message: 'Preferências atualizadas com sucesso' });
        }
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
