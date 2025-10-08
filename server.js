const express = require('express');
const cors = require('cors');
const path = require('path');
const { buscarPrecoMedio } = require('./scraping');

const app = express();
app.use(cors());
app.use(express.json());

// --- Servir frontend estático ---
const frontendPath = path.join(__dirname, 'frontend');
app.use(express.static(frontendPath));

// Redirecionar qualquer acesso à raiz para index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// --- Rota para cálculo de preço médio ---
app.post('/preco-medio', async (req, res) => {
    const { marca, modelo, ano } = req.body;

    if (!marca || !modelo || !ano) {
        return res.status(400).json({ error: 'Faltam parâmetros' });
    }

    try {
        const precoMedio = await buscarPrecoMedio(marca, modelo, ano);
        res.json({ precoMedio });
    } catch (error) {
        console.error('Erro ao buscar preços:', error);
        res.status(500).json({ error: 'Erro ao buscar preços' });
    }
});

// --- Porta dinâmica para Render ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
