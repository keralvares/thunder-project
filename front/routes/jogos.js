var express = require('express');
var router = express.Router();
const url = "https://silver-broccoli-9rvrr9w799ph7v6w-4000.app.github.dev/jogos/"

/* GET games listing. */
router.get('/', function (req, res, next) {

  fetch(url, { method: 'GET' })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json()
        throw err
      }
      return res.json()
    })
    .then((games) => {
      let title = "Gestão de Jogos"
      let cols = ["Id", "Nome", "Preço", "Data"]
      res.render('layout', {body: 'pages/games', title, games, cols, error: "" })
    })
    .catch((error) => {
      console.log('Erro', error)
      res.render('layout', { body: 'pages/games', title, error })
    })
});

// POST new game
router.post("/", (req, res) => {
  const { name, price, date } = req.body
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, date })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((pet) => {
      res.send(pet)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// UPDATE game
router.put("/:id", (req, res) => {
  const { id } = req.params
  const { name, price, date } = req.body
  fetch(url+id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, date })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((games) => {
      res.send(games)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// REMOVE game
router.delete("/:id", (req, res) => {
  const { id } = req.params
  fetch(url+id, {
    method: "DELETE"
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((games) => {
      res.send(games)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// GET game by id
router.get("/:id", (req, res) => {
  const { id } = req.params
  fetch(url+id, {
    method: "GET"
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((games) => {
      res.send(games)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

module.exports = router;
