// arquivo servico.js
// getPeca e formatarMoeda não são mais necessários aqui, pois Repositorio já tem getPeca e formatarMoeda está em util.js

module.exports = class ServicoCalculoFatura {

    constructor(repo) {
        this.repo = repo;
    }

    // Parâmetro 'pecas' removido.
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
            creditos += this.calcularCredito(apre);
        }
        return creditos;
    }

    // Parâmetro 'pecas' removido.
    calcularTotalApresentacao(apre) {
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
            totalFatura += this.calcularTotalApresentacao(apre);
        }
        return totalFatura;
    }
}