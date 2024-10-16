const express = require('express');
const sequelize = require('./config/database');
const dispositivoRoutes = require('./routes/dispositivoRoutes');
const cercaVirtualRoutes = require('./routes/cercaVirtualRoutes');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar o CORS para permitir requisições do frontend
app.use(cors({
    origin: 'http://localhost:3000' // Substitua pela URL do seu frontend
}));

app.use(express.json());

// Rotas
app.use('/api', dispositivoRoutes);
app.use('/api', cercaVirtualRoutes);

// Conectar ao banco de dados e iniciar o servidor
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}).catch(error => {
    console.error('Erro ao conectar ao banco de dados:', error);
});
