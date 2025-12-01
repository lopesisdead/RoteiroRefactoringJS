const { readFileSync } = require('fs');

// Funções Auxiliares (Não de Cálculo) mantidas fora da classe
function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR",
                        { style: "currency", currency: "BRL",
                          minimumFractionDigits: 2 }).format(valor/100);
}

function getPeca(pecas, apresentacao) {
  return pecas[apresentacao.id];
}

// Classe de Serviço implementada
class ServicoCalculoFatura {

    calcularCredito(pecas, apre) {
        let creditos = 0;
        creditos += Math.max(apre.audiencia - 30, 0);
        // Usa a função externa getPeca
        if (getPeca(pecas, apre).tipo === "comedia") 
           creditos += Math.floor(apre.audiencia / 5);
        return creditos;
    }

    calcularTotalCreditos(pecas, apresentacoes) {
        let creditos = 0;
        for (let apre of apresentacoes) {
            // Chamada interna deve usar 'this.'
            creditos += this.calcularCredito(pecas, apre);
        }
        return creditos;
    }

    calcularTotalApresentacao(pecas, apre) {
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

    calcularTotalFatura(pecas, apresentacoes) {
        let totalFatura = 0;
        for (let apre of apresentacoes) {
            // Chamada interna deve usar 'this.'
            totalFatura += this.calcularTotalApresentacao(pecas, apre);
        }
        return totalFatura;
    }
}

// Função gerarFaturaStr atualizada para receber 'calc'
function gerarFaturaStr (fatura, pecas, calc) {
    
    let faturaStr = `Fatura ${fatura.cliente}\n`;
  
    for (let apre of fatura.apresentacoes) {
        // Chamadas de cálculo usam o objeto 'calc'
        const valorTotal = calc.calcularTotalApresentacao(pecas, apre);
        
        faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(valorTotal)} (${apre.audiencia} assentos)\n`;
    }
    
    // Chamadas de cálculo usam o objeto 'calc'
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
    return faturaStr;
}

// Função gerarFaturaHtml atualizada para receber 'calc' e com corpo comentado
function gerarFaturaHtml (fatura, pecas, calc) {
    /*
    let faturaHtml = `<html>\n<p>Fatura ${fatura.cliente}</p>\n`;
    faturaHtml += '<ul>\n';
    
    for (let apre of fatura.apresentacoes) {
        const peca = getPeca(pecas, apre);
        // Chamadas de cálculo usam o objeto 'calc'
        const valorFormatado = formatarMoeda(calc.calcularTotalApresentacao(pecas, apre));
        
        faturaHtml += `<li>${peca.nome}: ${valorFormatado} (${apre.audiencia} assentos)</li>\n`;
    }
    
    faturaHtml += '</ul>\n';
    
    // Chamadas de cálculo usam o objeto 'calc'
    const total = formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes));
    const creditos = calc.calcularTotalCreditos(pecas, fatura.apresentacoes);
    
    faturaHtml += `<p>Valor total: ${total}</p>\n`;
    faturaHtml += `<p>Créditos acumulados: ${creditos}</p>\n`;
    faturaHtml += '</html>';
    
    return faturaHtml;
    */
}


const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

// Programa principal: criação da instância da classe
const calc = new ServicoCalculoFatura();

// Chamada para a fatura em string, passando 'calc'
const faturaStr = gerarFaturaStr(faturas, pecas, calc);
console.log(faturaStr);

// Chamada para a fatura em HTML comentada (conforme solicitado)
// const faturaHtml = gerarFaturaHtml(faturas, pecas, calc);
// console.log('\n=================================\n'); 
// console.log(faturaHtml);