const express = require('express');
const cercaVirtualController = require('../controllers/cercaVirtualController');
const router = express.Router();

router.get('/cercas-virtuais', cercaVirtualController.listarCercasVirtuais);
router.post('/cercas-virtuais', cercaVirtualController.criarCercaVirtual);
router.put('/cercas-virtuais/:id', cercaVirtualController.atualizarCercaVirtual);
router.delete('/cercas-virtuais/:id', cercaVirtualController.deletarCercaVirtual);

module.exports = router;
