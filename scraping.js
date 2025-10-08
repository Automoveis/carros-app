async function buscarPrecoMedio(marca, modelo, ano) {
    console.log(`Buscando preço médio para ${marca} ${modelo} ${ano}...`);
    
    // Mock: valor fixo para teste
    const precoSimulado = 5000 + Math.floor(Math.random() * 2000);
    
    return precoSimulado;
}

module.exports = { buscarPrecoMedio };
