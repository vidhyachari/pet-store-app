const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (_, res) => {
  db.all("SELECT * FROM food", [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

module.exports = router;
