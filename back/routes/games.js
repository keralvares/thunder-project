var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");

const db = new sqlite3.Database('./database/database.db');

// Criação da tabela games
db.run(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    date TEXT
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela games: ', err);
  } else {
    console.log('Tabela games criada com sucesso!');
  }
});

// Rota para adicionar um novo jogo
router.post('/games', (req, res) => {
  const { name, price, date } = req.body;
  console.log(req.body);
  db.run('INSERT INTO games (name, price, date) VALUES (?, ?, ?)', [name, price, date], (err) => {
    if (err) {
      console.log("Erro ao adicionar o jogo", err);
      return res.status(500).send({ error: 'Erro ao adicionar o jogo' });
    } else {
      res.status(201).send({ message: 'Jogo adicionado com sucesso' });
    }
  });
});

// Rota para listar todos os jogos
router.get('/games', function (req, res, next) {
  db.all('SELECT * FROM games', (err, games) => {
    if (err) {
      console.log("Jogos não encontrados", err);
      return res.status(500).send({ error: "Jogos não encontrados" });
    } else {
      res.status(200).send(games);
    }
  });
});

// Rota para obter um jogo por ID
router.get('/games/:id', function (req, res, next) {
  const { id } = req.params;
  db.get('SELECT * FROM games WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Jogo não encontrado', err);
      return res.status(500).json({ error: 'Jogo não encontrado' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }
    res.status(200).json(row);
  });
});

// Rota para atualizar um jogo por ID
router.put('/games/:id', function (req, res, next) {
  const { id } = req.params;
  const { name, price, date } = req.body;
  db.run('UPDATE games SET name = ?, price = ?, date = ? WHERE id = ?', [name, price, date, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar o jogo', err);
      return res.status(500).json({ error: "Erro ao atualizar o jogo" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }
    res.status(200).json({ message: "Jogo atualizado com sucesso" });
  });
});

// Rota para atualização parcial de um jogo por ID
router.patch('/games/:id', function (req, res, next) {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
  }
  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  db.run(`UPDATE games SET ${setClause} WHERE id = ?`, [...values, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar o jogo parcialmente', err);
      return res.status(500).json({ error: 'Erro ao atualizar o jogo parcialmente' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }
    res.status(200).json({ message: "Jogo atualizado parcialmente com sucesso" });
  });
});

// Rota para deletar um jogo por ID
router.delete('/games/:id', function (req, res, next) {
  const { id } = req.params;
  db.run('DELETE FROM games WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Erro ao deletar o jogo', err);
      return res.status(500).json({ error: 'Erro ao deletar o jogo' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }
    res.status(200).json({ message: "Jogo deletado com sucesso" });
  });
});

module.exports = router;
