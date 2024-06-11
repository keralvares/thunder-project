var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3")

const db = new sqlite3.Database('./database/database.db')

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT UNIQUE,
    phone TEXT UNIQUE
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela users: ', err);
  } else {
    console.log('Tabela users criada com sucesso!');
  }
});

router.post('/register', (req, res)=>{
const { username, password, email, phone } = req.body
console.log(req.body)
db.run('INSERT INTO users (username, password, email, phone) VALUES (?,?,?,?)', [username, password, email, phone],(err)=>{
  if(err){
    console.log("Erro ao criar o usuario", err)
    return res.status(500).send({erro: 'Erro ao criar o usuario'})
  }else {
    res.status(201).send({message: 'Usuario criado'})
  }
})
})

/* GET users listing. */
router.get('/', function(req, res, next) {
 db.all('SELECT * FROM users', (err, users)=>{
  if(err){
    console.log("usuarios nao foram encontrados", err)
    return res.status(500).send({error: "usuario nao encontrados"})
  }else{
    res.status(200).send(users)
  }
 })
});

router.get('/:id', function(req, res, next) {
  const { id } = req.params;
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('usuario nao encontrado', err);
      return res.status(500).json({error: 'usuario nao encontrado'});
    }
    if (!row) {
      return res.status(404).json({error: 'usuario nao encontrado'});
    }
    res.status(200).json(row);
  });
});

router.put('/:id', function(req, res, next) {
  const { id } = req.params;
  const { username, password, email, phone } = req.body;
  db.run('UPDATE users SET username = ?, password = ?, email = ?, phone = ?', [username, password, email, phone, id], function(err) {
    if (err) {
      console.error('Erro ao atualizar o usuarios', err);
      return res.status(500).json({error: "Error ao atualizaro usuario"});
    }
    if (this.changes === 0) {
      return res.status(404).json({error: 'usuario nao encontrado'});
    }
     res.status(200).json({message: "usuario atualizado com sucesso"});
  });
});

 router.patch('/:id', function(req, res, next) {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length ===0) {
    return res.status(400).json({error: 'Nenhum campo fornecido para atualizaçao'});
 }
 const setClause = keys.map((key) => '${key} = ?').join(', ');
 
 db.run('UPDATE users SET ${setClause} WHERE id = ?', [...values, id], function(err) {
  if (err) {
    console.error('Erro ao atualizar o usuario parcialmente', err);
    return res.status(500).json({error: 'Error ao atualizar o usuario parcialmente'});
  }
  if (this.changes === 0) {
    return res.status(404).json({error: 'usuario nao encontrado'});
  }
  res.status(200).json({message: "usuario atualizado parcialmente com sucesso"});
 });
 });

 router.delete('/:id', function(req, res, next) {
  const { id } = req.params;
  db.run('DETETE FROM users WHERE id = ?', [id], function(err) {
    if (err){
      console.error('Ero ao deletar o usuario', err);
      return res.status(500).json({error: 'Erro ao deletar o usuario'});
    }
    if (this.changes === 0) {
      return res.status(404).json({error: 'Usuario nao encontrado'});
    }
    res.status(200).json({message: "Usuario deletado com sucesso"});
  });
 });



module.exports = router;
//