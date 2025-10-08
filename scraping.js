const puppeteer = require('puppeteer');

// Função principal que será chamada pelo server.js
async function buscarPrecoMedio(marca, modelo, ano) {
    // Buscas individuais
    const precoOLX = await buscarOLX(marca, modelo, ano);
    const precoStand = await buscarStandvirtual(marca, modelo, ano);
    const precoCusto = await buscarCustoJusto(marca, modelo, ano);

    const precos = [precoOLX, precoStand, precoCusto].filter(p => p > 0);
    if (precos.length === 0) return 0;

    const media = precos.reduce((a,b)=>a+b,0)/precos.length;
    return Math.round(media);
}

// --- OLX ---
async function buscarOLX(marca, modelo, ano){
    const browser = await puppeteer.launch({ headless:true, args:['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const query = `${marca}+${modelo}`;
    const url = `https://www.olx.pt/autos-e-pecas/carros/?q=${encodeURIComponent(query)}&search[filter_float_year:from]=${ano}`;
    await page.goto(url, { waitUntil:'networkidle2' });

    const precos = await page.$$eval('.price', elements =>
        elements.map(el => parseInt(el.innerText.replace(/[^\d]/g,''))).filter(p=>p>0)
    );
    await browser.close();
    if (precos.length===0) return 0;
    return precos.reduce((a,b)=>a+b,0)/precos.length;
}

// --- Standvirtual ---
async function buscarStandvirtual(marca, modelo, ano){
    const browser = await puppeteer.launch({ headless:true, args:['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const query = `${marca}+${modelo}`;
    const url = `https://www.standvirtual.com/carros/${encodeURIComponent(marca)}/${encodeURIComponent(modelo)}/${ano}/`;
    await page.goto(url, { waitUntil:'networkidle2' });

    const precos = await page.$$eval('.PriceWithTax-sc', elements =>
        elements.map(el => parseInt(el.innerText.replace(/[^\d]/g,''))).filter(p=>p>0)
    );
    await browser.close();
    if (precos.length===0) return 0;
    return precos.reduce((a,b)=>a+b,0)/precos.length;
}

// --- Custo Justo ---
async function buscarCustoJusto(marca, modelo, ano){
    const browser = await puppeteer.launch({ headless:true, args:['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const query = `${marca}+${modelo}`;
    const url = `https://www.custojusto.pt/carros/?q=${encodeURIComponent(query)}&ano=${ano}`;
    await page.goto(url, { waitUntil:'networkidle2' });

    const precos = await page.$$eval('.price', elements =>
        elements.map(el => parseInt(el.innerText.replace(/[^\d]/g,''))).filter(p=>p>0)
    );
    await browser.close();
    if (precos.length===0) return 0;
    return precos.reduce((a,b)=>a+b,0)/precos.length;
}

module.exports = { buscarPrecoMedio };
