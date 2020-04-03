const cripto = require('crypto');
const conexao = require('../database/conexao');

module.exports = {
    async index(request, response) {
        const ongs = await conexao('ongs').select('*');

        return response.json(ongs);
    },

    async create(request, response) {
        const { nome, email, whatsapp, cidade, uf } = request.body;

        const id = cripto.randomBytes(4).toString('HEX');

        await conexao('ongs').insert({
            id,
            nome,
            email,
            whatsapp,
            cidade,
            uf,
        })

        return response.json({ id })
    }
};