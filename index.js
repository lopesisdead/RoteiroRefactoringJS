const { readFileSync } = require('fs');

function gerarFaturaStr (fatura, pecas) {
    let totalFatura = 0;
    let creditos = 0;
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    const formato = new Intl.NumberFormat("pt-BR",
                          { style: "currency", currency: "BRL",
                            minimumFractionDigits: 2 }).format;

    // 1. Função de consulta (Query) extraída: getPeca
    function getPeca(apresentacao) {
      return pecas[apresentacao.id];
    }

    // 2. Função aninhada alterada: remove o parâmetro 'peca' e usa getPeca
    function calcularTotalApresentacao(apre) { // Parâmetro 'peca' removido
      const peca = getPeca(apre); // Consulta a peça internamente
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
  
    for (let apre of fatura.apresentacoes) {
      // 3. Variável local 'peca' foi DELETADA (ou comentada) e seu uso substituído pela query getPeca
      
      // const peca = pecas[apre.id]; <-- LINHA DELETADA

      // O uso de 'peca' dentro do loop foi substituído por getPeca(apre)
      const peca = getPeca(apre); // Reinstrui 'peca' no loop principal usando a query.
      let total = calcularTotalApresentacao(apre); // Apenas 'apre' é passado

      // créditos para próximas contratações
      creditos += Math.max(apre.audiencia - 30, 0);
      
      // O uso de 'peca.tipo' aqui também é substituído pela query, mas
      // como a variável 'peca' foi reintroduzida acima, podemos usá-la.
      if (peca.tipo === "comedia") // Se não tivesse a linha const peca = getPeca(apre); seria: if (getPeca(apre).tipo === "comedia")
         creditos += Math.floor(apre.audiencia / 5);
  
      // mais uma linha da fatura
      faturaStr += `  ${peca.nome}: ${formato(total/100)} (${apre.audiencia} assentos)\n`;
      totalFatura += total;
    }
    faturaStr += `Valor total: ${formato(totalFatura/100)}\n`;
    faturaStr += `Créditos acumulados: ${creditos} \n`;
    return faturaStr;
  }

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);