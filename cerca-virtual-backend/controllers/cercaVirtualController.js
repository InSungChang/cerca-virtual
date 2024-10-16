const CercaVirtual = require('../models/CercaVirtual');

// Listar todas as cercas virtuais
exports.listarCercasVirtuais = async (req, res) => {
    try {
        const cercasVirtuais = await CercaVirtual.findAll();
        res.json(cercasVirtuais);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar cercas virtuais' });
    }
};

// Criar nova cerca virtual
exports.criarCercaVirtual = async (req, res) => {
    const { nome, raio, dispositivoId, lat, lng } = req.body;

    // Validação básica de entrada
    if (!nome || !raio || !dispositivoId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        const novaCercaVirtual = await CercaVirtual.create({ nome, raio, dispositivoId, lat, lng });
        res.status(201).json(novaCercaVirtual);
    } catch (error) {
        console.error('Erro ao criar cerca virtual:', error);
        res.status(500).json({ error: 'Erro ao criar cerca virtual' });
    }
};

// Atualizar cerca virtual
exports.atualizarCercaVirtual = async (req, res) => {
    const { id } = req.params;
    const { nome, raio, dispositivoId, lat, lng } = req.body;

    if (!nome || !raio || !dispositivoId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        const cercaVirtual = await CercaVirtual.findByPk(id);
        if (!cercaVirtual) {
            return res.status(404).json({ error: 'Cerca virtual não encontrada' });
        }

        // Atualizando campos
        cercaVirtual.nome = nome;
        cercaVirtual.raio = raio;
        cercaVirtual.dispositivoId = dispositivoId;
        cercaVirtual.lat = lat;
        cercaVirtual.lng = lng;

        await cercaVirtual.save();
        res.json(cercaVirtual);
    } catch (error) {
        console.error('Erro ao atualizar cerca virtual:', error);
        res.status(500).json({ error: 'Erro ao atualizar cerca virtual' });
    }
};

// Deletar cerca virtual
exports.deletarCercaVirtual = async (req, res) => {
    const { id } = req.params;
    try {
        const cercaVirtual = await CercaVirtual.findByPk(id);
        if (!cercaVirtual) {
            return res.status(404).json({ error: 'Cerca virtual não encontrada' });
        }

        await cercaVirtual.destroy();
        res.json({ message: 'Cerca virtual removida com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar cerca virtual:', error);
        res.status(500).json({ error: 'Erro ao deletar cerca virtual' });
    }
};
