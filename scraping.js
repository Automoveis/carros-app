const puppeteer = require('puppeteer');

async function buscarPrecosDeSite(url, seletor) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  let precos = [];

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector(seletor, { timeout: 5000 });
    precos = await page.$$eval(seletor, els =>
      els
        .map(el => el.innerText.replace(/[^\d]/g, ''))
        .map(n => parseInt(n))
        .filter(n => n > 100 && n < 200000)
    );
  } catch (err) {
    console.log(`⚠️ Falha ao obter preços de ${url}`);
  } finally {
    await browser.close();
  }

  return precos;
}

async function buscarPrecoMedio(marca, modelo, ano) {
  const termo = encodeURIComponent(`${marca} ${modelo}`);
  console.log(`🔍 Buscando preço médio para: ${marca} ${modelo} (${ano})`);

  // URLs dos 3 sites
  const urls = [
    {
      nome: 'OLX',
      url: `https://www.olx.pt/autos-e-pecas/carros/?q=${termo}&search[filter_float_year:from]=${ano}`,
      seletor: '.price',
    },
    {
      nome: 'Standvirtual',
      url: `https://www.standvirtual.com/carros/?search%5Bfilter_float_year%3Afrom%5D=${ano}&q=${termo}`,
      seletor: 'span.offer-price__number',
    },
    {
      nome: 'CustoJusto',
      url: `https://www.custojusto.pt/portugal?q=${termo}`,
      seletor: '.aditem-price',
    },
  ];

  let todosPrecos = [];

  for (const site of urls) {
    const precos = await buscarPrecosDeSite(site.url, site.seletor);
    console.log(`✅ ${site.nome}: ${precos.length} preços obtidos`);
    todosPrecos = todosPrecos.concat(precos);
  }

  if (todosPrecos.length === 0) return 0;

  const soma = todosPrecos.reduce((a, b) => a + b, 0);
  const media = soma / todosPrecos.length;
  console.log(`💰 Preço médio geral: ${Math.round(media)} €`);
  return Math.round(media);
}

module.exports = { buscarPrecoMedio };
