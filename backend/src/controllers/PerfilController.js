const conexao = require('../database/conexao');

module.exports = {
    async index(request, response) {
        const ongs_id = request.headers.autorizacao;

        const casos = await conexao('casos')
            .where('ongs_id', ongs_id)
            .select('*');

        return response.json(casos);
    },

}