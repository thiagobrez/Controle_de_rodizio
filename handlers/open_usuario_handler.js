const Basic_handler = require('./basic_handler');
const Objeto_pesquisa = require('./util_handler/objeto_pesquisa');
const Objeto_update = require('./util_handler/objeto_update');

class Open_handler extends Basic_handler {

  /**
   * Verifica se usuario existe e efetua o login.
   *
   * @param dados_login
   * @returns {Promise}
   */
  async logar(dados_login) {

    let ret = await this.emitServer('db.admin.login', dados_login);

    return await this.retorno(ret.data);
  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Lê os rodízios cadastrados no banco de dados e retorna para o rtc
   * somente o nome e a unidade de medida.
   *
   * @returns {Promise}
   */

  async ler_rodizios() {

    let query = {'ativo': true};
    let select = 'nome padrao participantes entradas saidas rodada';
    let populate = {
      path: 'participantes.participante',
      select: 'nome sobrenome',
    };

    let pesquisa = new Objeto_pesquisa(query, select, populate);

    let ret = await this.emitServer('db.rodizio.read', pesquisa);

    return await this.retorno(ret.data);

  }

}

module.exports = Open_handler;