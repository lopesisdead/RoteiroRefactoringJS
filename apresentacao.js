// arquivo apresentacao.js
var { formatarMoeda } = require("./util.js");

function gerarFaturaStr (fatura, calc) {
    
    let faturaStr = `Fatura ${fatura.cliente}\n`;
  
    for (let apre of fatura.apresentacoes) {
        const valorTotal = calc.calcularTotalApresentacao(apre);
        
        // Acesso à peça via calc.repo.getPeca(apre)
        faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(valorTotal)} (${apre.audiencia} assentos)\n`;
    }
    
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
    return faturaStr;
}

// A função gerarFaturaHtml (comentada) foi removida ou não incluída por simplificação.

module.exports = gerarFaturaStr;