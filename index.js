const { readFileSync } = require('fs');

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR",
                        { style: "currency", currency: "BRL",
                          minimumFractionDigits: 2 }).format(valor/100);
}

function getPeca(pecas, apresentacao) {
  return pecas[apresentacao.id];
}

function calcularTotalApresentacao(pecas, apre) {
  const peca = getPeca(pecas, apre);
  let total = 0;
  
  switch (peca.tipo) {
  case "tragedia":
    total = 40000;
    if (apre.audiencia > 30) {
      total += 1000 * (apre.audiencia - 30);
    }
    break;
  case "comedia":
    total = 30000;
    if (apre.audiencia > 20) {
       total += 10000 + 500 * (apre.audiencia - 20);
    }
    total += 300 * apre.audiencia;
    break;
  default:
      throw new Error(`Peça desconhecia: ${peca.tipo}`);
  }

  return total;
}

function calcularCredito(pecas, apre) {
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPeca(pecas, apre).tipo === "comedia") 
     creditos += Math.floor(apre.audiencia / 5);
  return creditos;
}

function calcularTotalCreditos(pecas, apresentacoes) {
    let creditos = 0;
    for (let apre of apresentacoes) {
        creditos += calcularCredito(pecas, apre);
    }
    return creditos;
}

function calcularTotalFatura(pecas, apresentacoes) {
    let totalFatura = 0;
    for (let apre of apresentacoes) {
        totalFatura += calcularTotalApresentacao(pecas, apre);
    }
    return totalFatura;
}

// Função existente que retorna a fatura em string pura
function gerarFaturaStr (fatura, pecas) {
    
    let faturaStr = `Fatura ${fatura.cliente}\n`;
  
    for (let apre of fatura.apresentacoes) {
      faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
    }
    
    faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
    return faturaStr;
}

// NOVA FUNÇÃO: Retorna a fatura em string com tags HTML
function gerarFaturaHtml (fatura, pecas) {
    let faturaHtml = `<html>\n<p>Fatura ${fatura.cliente}</p>\n`;
    faturaHtml += '<ul>\n';
    
    for (let apre of fatura.apresentacoes) {
        // Usa as funções de cálculo e formatação já existentes
        const peca = getPeca(pecas, apre);
        const valorFormatado = formatarMoeda(calcularTotalApresentacao(pecas, apre));
        
        faturaHtml += `<li>${peca.nome}: ${valorFormatado} (${apre.audiencia} assentos)</li>\n`;
    }
    
    faturaHtml += '</ul>\n';
    
    const total = formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes));
    const creditos = calcularTotalCreditos(pecas, fatura.apresentacoes);
    
    faturaHtml += `<p>Valor total: ${total}</p>\n`;
    faturaHtml += `<p>Créditos acumulados: ${creditos}</p>\n`;
    faturaHtml += '</html>';
    
    return faturaHtml;
}


const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

// Chamada para a fatura em string
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);

// Chamada para a nova fatura em HTML
const faturaHtml = gerarFaturaHtml(faturas, pecas);
console.log('\n=================================\n'); // Separador
console.log(faturaHtml);