const express = require ('express');//importa o módulo responsavel para criar o servidor
const mysql = require('mysql2'); //importa o módulo responsavel pela coenxão com o banco
const app = express(); // Cria uma instancia do express para configurar o servidor
const port = process.env.PORT || 3000;

const db = mysql.createConnection({//constante responsavel por armazenar as informações de conexão
    host: 'sql213.infinityfree.com', 
    user: 'if0_37838629',
    password: 'COUNTER2024',
    database: 'if0_37838629_counter'
});

db.connect((err) => {
    if(err){ // Se der err(ERR) printa uma mensagem de erro 
        console.error('Erro ao conectar ao Banco de Dados', err.stack);
        return; //Sai da função 
    }
    console.log("Conexão feita com sucesso");
});

app.get('/', (req, res) =>{//Define uma rota GET simples para testar o servidor. Quando acessar a raiz '/', retorna uma mensagem
    res.send('Servidor Funcionando: VAI PALMEIRAS meu primeiro servidor BACK-END')//Mensaqgem dada se o servidor funcionar 
});

app.listen(port, () =>{
    console.log('Servidor rodando na porta'); // Mensagem para saber se o servidor está funcionndo juntamente com a porta de operação
});