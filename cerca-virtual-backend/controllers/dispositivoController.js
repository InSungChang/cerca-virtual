const Dispositivo = require('../models/Dispositivo');

// Listar todos os dispositivos
exports.listarDispositivos = async (req, res) => {
    try {
        const dispositivos = await Dispositivo.findAll();
        res.json(dispositivos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar dispositivos' });
    }
};

// Criar novo dispositivo
exports.criarDispositivo = async (req, res) => {
    const { nome, imei, status, localizacao_atual } = req.body;
    try {
        const novoDispositivo = await Dispositivo.create({ nome, imei, status, localizacao_atual });
        res.json(novoDispositivo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar dispositivo' });
    }
};

// Atualizar dispositivo
exports.atualizarDispositivo = async (req, res) => {
    const { id } = req.params;
    const { nome, imei, status, localizacao_atual } = req.body;
    try {
        const dispositivo = await Dispositivo.findByPk(id);
        if (!dispositivo) {
            return res.status(404).json({ error: 'Dispositivo não encontrado' });
        }
        dispositivo.nome = nome;
        dispositivo.imei = imei;
        dispositivo.status = status;
        dispositivo.localizacao_atual = localizacao_atual;
        await dispositivo.save();
        res.json(dispositivo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar dispositivo' });
    }
};

// Deletar dispositivo
exports.deletarDispositivo = async (req, res) => {
    const { id } = req.params;
    try {
        const dispositivo = await Dispositivo.findByPk(id);
        if (!dispositivo) {
            return res.status(404).json({ error: 'Dispositivo não encontrado' });
        }
        await dispositivo.destroy();
        res.json({ message: 'Dispositivo removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar dispositivo' });
    }
};
