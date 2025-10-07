const express = require('express');
const cors = require('cors');
const { buscarPrecoMedio } = require('./scraping');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/preco-medio', async (req, res) => {
    const { marca, modelo, ano } = req.body;

    if (!marca || !modelo || !ano) {
        return res.status(400).json({ error: 'Faltam parâmetros' });
    }

    try {
        const precoMedio = await buscarPrecoMedio(marca, modelo, ano);
        res.json({ precoMedio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar preços' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
