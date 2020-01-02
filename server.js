const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
 
// connection configurations
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_task_demo'
});
 

mc.connect();
 

app.get('/', function (req, res) {
    return res.send({ error: true, message: 'Olá amigo' })
});
 

app.get('/todos', function (req, res) {
    mc.query('SELECT * FROM tasks', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Todos itens.' });
    });
});

app.get('/todos/search/:keyword', function (req, res) {
    let keyword = req.params.keyword;
    mc.query("SELECT * FROM tasks WHERE task LIKE ? ", ['%' + keyword + '%'], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Pesquisa por nome.' });
    });
});

app.get('/todo/:id', function (req, res) {
 
    let task_id = req.params.id;
 
    mc.query('SELECT * FROM tasks where id=?', task_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Lista do banco.' });
    });
 
});

app.post('/todo', function (req, res) {
 
    let task = req.body.task;
 
    if (!task) {
        return res.status(400).send({ error:true, message: 'Erro' });
    }
 
    mc.query("INSERT INTO tasks SET ? ", { task: task }, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Criado com sucesso.' });
    });
});

app.put('/todo', function (req, res) {
 
    let task_id = req.body.task_id;
    let task = req.body.task;
 
    if (!task_id || !task) {
        return res.status(400).send({ error: task, message: 'Digite o ID' });
    }
 
    mc.query("UPDATE tasks SET task = ? WHERE id = ?", [task, task_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Atualizado com sucesso.' });
    });
});

app.delete('/todo/:id', function (req, res) {
 
    let task_id = req.params.id;
 
    mc.query('DELETE FROM tasks WHERE id = ?', [task_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Atualizado com sucesso.' });
    });
 
});

app.all("*", function (req, res, next) {
    return res.send('pagina não encotrada');
    next();
});
 

app.listen(8080, function () {
    console.log('Abra a porta 8080');
});
 

module.exports = app;