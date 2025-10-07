const puppeteer = require('puppeteer');

async function buscarPrecoMedio(marca, modelo, ano) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const query = `${marca}+${modelo}`;
    const url = `https://www.olx.pt/autos-e-pecas/carros/?q=${encodeURIComponent(query)}&search[filter_float_year:from]=${ano}`;

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Seleciona preços dos anúncios (exemplo OLX)
    const precos = await page.$$eval('.price', elements =>
        elements.map(el => {
            let val = el.innerText.replace(/[^\d]/g, '');
            return parseInt(val) || 0;
        }).filter(p => p > 0)
    );

    await browser.close();

    if (precos.length === 0) return 0;

    const soma = precos.reduce((a, b) => a + b, 0);
    const media = soma / precos.length;

    return Math.round(media);
}

module.exports = { buscarPrecoMedio };
