const Basic_handler = require('./basic_handler');
const Objeto_pesquisa = require('./util_handler/objeto_pesquisa');
const Objeto_update = require('./util_handler/objeto_update');

class Gerente_handler extends Basic_handler {

  /**
   * Created by Thiago on 19/05/2017
   *
   * Recebe o nome e a unidade de medida do rodízio, solicita ao banco que
   * realize o cadastro, e retorna o rodízio cadastrado para o rtc.
   *
   * @param rodizio
   * @returns {Promise}
   */

  async cadastra_rodizio(rodizio) {

    let ret = await this.emitServer('db.rodizio.create', rodizio);

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

    let populate = {
      path: 'participantes.participante',
      select: 'nome sobrenome'
    };

    let query = {'ativo': true};

    let pesquisa = new Objeto_pesquisa(query, null, populate);

    let ret = await this.emitServer('db.rodizio.read', pesquisa);

    return await this.retorno(ret.data);

  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Recebe o id e os updates do rodizío a ser atualizado, solicita ao banco
   * de dados que substitua os dados antigos pelo update e retorna para o rtc.
   *
   * @param dados_update
   * @returns {Promise}
   */

  async atualiza_rodizios(dados_update) {

    let update = await new Objeto_update(dados_update.id, dados_update.update);
    let ret = await this.emitServer('db.rodizio.update', update);
    return await this.retorno(ret.data);

  }

  async atualiza_entregas(dados_update) {

    let ret = await this.emitServer('db.rodizio.atualizaentrega', dados_update);
    return await this.retorno(ret.data);

  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Recebe o nome, email e número de celular do participante a ser cadastrado,
   * solicita ao bando de dados que faça o cadastro e retorna para o rtc.
   *
   * @param participante
   * @returns {Promise}
   */

  async cadastra_participante(participante) {

    let ret = await this.emitServer('db.participante.create', participante);

    return await this.retorno(ret.data);

  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Recebe o id e os updates do participante a ser atualizado, solicita ao banco
   * de dados que substitua os dados antigos pelo update e retorna para o rtc.
   *
   * @param dados_update
   * @returns {Promise}
   */

  async atualiza_participante(dados_update) {

    let update = new Objeto_update(dados_update.id, dados_update.update);

    let ret = await this.emitServer('db.participante.update', update);

    return await this.retorno(ret.data);

  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Recebe o id do participante a ser deletado, solicita ao banco de dados
   * que faça a deleção e retorna para o rtc.
   *
   * @param participante
   * @returns {Promise}
   */

  async deleta_participante(dados_update) {

    let update = new Objeto_update(dados_update.id, dados_update.update);

    let ret = await this.emitServer('db.participante.update', update);

    return await this.retorno(ret.data);

  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Lê os participantes cadastrados no banco de dados e retorna para o rtc
   * somente o nome e o sobrenome.
   *
   * @returns {Promise}
   */

  async ler_participantes() {

    let query = {'ativo': true};

    let pesquisa = new Objeto_pesquisa(query);

    let ret = await this.emitServer('db.participante.read', pesquisa);

    return await this.retorno(ret.data);

  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Recebe o id do rodízio cadastrado e o id do participante a ser inserido,
   * solicita ao banco de dados que atualize os participantes do rodízio e retorna
   * para o rtc.
   *
   * @param dados_cadastro
   * @returns {Promise}
   */

  async insere_participante_no_rodizio(dados_cadastro) {

    let participantes_front = [];

    for (let index = 0; index < dados_cadastro.participantes.length; index++) {
      participantes_front.push({participante: dados_cadastro.participantes[index]});
    }

    let dadoupdate = {
      $pushAll: {
        participantes: participantes_front,
      },
    };

    let update = await new Objeto_update(dados_cadastro.id, dadoupdate);

    let ret = await this.emitServer('db.rodizio.update', update);

    return await this.retorno(ret.data);

  }

  /**
   * Created by Thiago on 22/05/2017
   *
   * Recebe o id do rodízio e o número de entradas a serem adicionadas a ele,
   * solicita ao banco de dados que adicione e retorna para o rtc.
   *
   * @param dados_cadastro
   * @returns {Promise}
   */

  async adiciona_entrada_no_rodizio(dados_cadastro) {

    let update = await new Objeto_update(dados_cadastro.id, dados_cadastro.update);

    let ret = await this.emitServer('db.rodizio.update', update);

    return await this.retorno(ret.data);

  }

  /**
   * Created by Thiago on 22/05/2017
   *
   * Recebe o id do rodízio e o número de saídas a serem adicionadas a ele,
   * solicita ao banco de dados que adicione e retorna para o rtc.
   *
   * @param dados_cadastro
   * @returns {Promise}
   */

  async adiciona_saida_no_rodizio(dados_cadastro) {

    let update = await new Objeto_update(dados_cadastro.id, dados_cadastro.update);

    let ret = await this.emitServer('db.rodizio.update', update);

    return await this.retorno(ret.data);

  }

  /**
   * Created by Thiago on 22/05/2017
   *
   * Recebe o id do rodízio e do participante a ser deletado dele, solicita ao
   * banco de dados que faça a remoção e retorna para o rtc.
   *
   * @param dados_remocao
   * @returns {Promise}
   */

  async remove_participante_do_rodizio(dados_remocao) {

    let update = await new Objeto_update(dados_remocao.id, dados_remocao.update);

    let ret = await this.emitServer('db.rodizio.update', update);

    return await this.retorno(ret.data);

  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Recebe o id do rodízio a ser deletado, solicita ao banco que faça a deleção
   * e retorna para o rtc.
   *
   * @param id
   * @returns {Promise}
   */

  async deleta_rodizio(dados_update) {

    let update = new Objeto_update(dados_update.id, dados_update.update);

    let ret = await this.emitServer('db.rodizio.update', update);

    return await this.retorno(ret.data);
  }

  /**
   * Faz o update no usuario logado para deslogado.
   *
   * @param id_usuario
   * @returns {Promise}
   */
  async logout(id_usuario) {

    let dado_update_usuario = {
      logado: false,
    };

    let update = new Objeto_update(id_usuario, dado_update_usuario);

    // todo: fazer os tratamentos de erro.

    let ret = await this.emitServer('db.admin.update', update);

    return await this.retorno(ret.data);

  }

}

module.exports = Gerente_handler;