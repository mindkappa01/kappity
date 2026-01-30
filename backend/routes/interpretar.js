const express = require('express');
const router = express.Router();
const { interpretarSonho } = require('../services/gpt');

router.post('/', async (req, res) => {
  try {
    const resultado = await interpretarSonho(req.body);
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      leitura_inicial: "Houve um problema ao interpretar este sonho.",
      teasers: { simbolica: "", psicologica: "", cientifica: "" },
      leituras: { simbolica: "", psicologica: "", cientifica: "" }
    });
  }
});

module.exports = router;
