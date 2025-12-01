const { readFileSync } = require('fs');

// 1. Classe Repositorio (Nova)
class Repositorio {
  constructor() {
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }
}

// Funções Auxiliares mantidas fora da classe (getPeca externa será removida, formatarMoeda mantida)
function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR",
                        { style: "currency", currency: "BRL",
                          minimumFractionDigits: 2 }).format(valor/100);
}

// 2. Classe de Serviço atualizada com construtor e repositório
class ServicoCalculoFatura {

    constructor(repo) { // Recebe o Repositorio no construtor
        this.repo = repo;
    }

    // Parâmetro 'pecas' removido. Acesso à peça via this.repo
    calcularCredito(apre) {
        let creditos = 0;
        creditos += Math.max(apre.audiencia - 30, 0);
        // Acesso via this.repo.getPeca(apre)
        if (this.repo.getPeca(apre).tipo === "comedia") 
           creditos += Math.floor(apre.audiencia / 5);
        return creditos;
    }

    // Parâmetro 'pecas' removido.
    calcularTotalCreditos(apresentacoes) {
        let creditos = 0;
        for (let apre of apresentacoes) {
            // Chamada interna deve usar 'this.'
            creditos += this.calcularCredito(apre);
        }
        return creditos;
    }

    // Parâmetro 'pecas' removido. Acesso à peça via this.repo
    calcularTotalApresentacao(apre) {
        // Acesso à peça via this.repo.getPeca(apre)
        const peca = this.repo.getPeca(apre); 
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

    // Parâmetro 'pecas' removido.
    calcularTotalFatura(apresentacoes) {
        let totalFatura = 0;
        for (let apre of apresentacoes) {
            // Chamada interna deve usar 'this.'
            totalFatura += this.calcularTotalApresentacao(apre);
        }
        return totalFatura;
    }
}

// Função gerarFaturaStr atualizada para receber 'calc' (o parâmetro 'pecas' foi removido)
function gerarFaturaStr (fatura, calc) {
    
    let faturaStr = `Fatura ${fatura.cliente}\n`;
  
    for (let apre of fatura.apresentacoes) {
        // Chamadas de cálculo usam o objeto 'calc' (e os métodos agora têm menos parâmetros)
        const valorTotal = calc.calcularTotalApresentacao(apre);
        
        // Acesso à peça agora é via calc.repo.getPeca(apre)
        faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(valorTotal)} (${apre.audiencia} assentos)\n`;
    }
    
    // Chamadas de cálculo usam o objeto 'calc'
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
    return faturaStr;
}

// Função gerarFaturaHtml (o parâmetro 'pecas' foi removido e o corpo permanece comentado)
function gerarFaturaHtml (fatura, calc) {
    /*
    let faturaHtml = `<html>\n<p>Fatura ${fatura.cliente}</p>\n`;
    faturaHtml += '<ul>\n';
    
    for (let apre of fatura.apresentacoes) {
        const peca = calc.repo.getPeca(apre);
        const valorFormatado = formatarMoeda(calc.calcularTotalApresentacao(apre));
        
        faturaHtml += `<li>${peca.nome}: ${valorFormatado} (${apre.audiencia} assentos)</li>\n`;
    }
    
    faturaHtml += '</ul>\n';
    
    const total = formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes));
    const creditos = calc.calcularTotalCreditos(fatura.apresentacoes);
    
    faturaHtml += `<p>Valor total: ${total}</p>\n`;
    faturaHtml += `<p>Créditos acumulados: ${creditos}</p>\n`;
    faturaHtml += '</html>';
    
    return faturaHtml;
    */
}


const faturas = JSON.parse(readFileSync('./faturas.json'));
// O arquivo de peças não é mais lido aqui
const calc = new ServicoCalculoFatura(new Repositorio()); // Cria o repositório e injeta no serviço
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);