const express = require('express');
const dispositivoController = require('../controllers/dispositivoController');
const router = express.Router();

router.get('/dispositivos', dispositivoController.listarDispositivos);
router.post('/dispositivos', dispositivoController.criarDispositivo);
router.put('/dispositivos/:id', dispositivoController.atualizarDispositivo);
router.delete('/dispositivos/:id', dispositivoController.deletarDispositivo);

module.exports = router;
