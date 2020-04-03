const conexao = require('../database/conexao');

module.exports = {
    async index(request, response) {
        const { page = 1 } = request.query;

        const [quant] = await conexao('casos').count();

        const casos = await conexao('casos')
            .join('ongs', 'ongs.id', '=', 'casos.ongs_id')
            .limit(5)
            .offset((page - 1) * 5)
            .select([
                'casos.*',
                'ongs.nome',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.cidade',
                'ongs.uf'
            ]);

        response.header('Quantidade', quant['count(*)']);

        return response.json(casos);
    },

    async create(request, response) {
        const { titulo, descricao, valor } = request.body;
        const ongs_id = request.headers.autorizacao;

        const [id] = await conexao('casos').insert({
            titulo,
            descricao,
            valor,
            ongs_id,
        });

        return response.json({ id });
    },

    async delete(request, response) {
        const { id } = request.params;
        const ongs_id = request.headers.autorizacao;

        const casos = await conexao('casos')
            .where('id', id)
            .select('ongs_id')
            .first();

        if (casos.ongs_id !== ongs_id) {
            return response.status(401).json({ erro: 'Operação não autorizada' });
        }

        await conexao('casos').where('id', id).delete();

        return response.status(204).send();
    }
};