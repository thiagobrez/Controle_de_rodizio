const Basico = require('../basico_rtc');
const Admin_handler = require('../../handlers/admin_handler');

class rtc_admin extends Basico {
  /**
   * Recebe o socketId passado pelo cliente.
   *
   * @param conf
   */
  constructor(conf, msgtobrowser, rtc_login) {
    super('Admin', Admin_handler, conf);

    this.interfaceListeners = {
      'logout': this.logout.bind(this),
      'cadastra_rodizio': this.cadastra_rodizio.bind(this),
      'deleta_rodizio': this.deleta_rodizio.bind(this),
      'ler_rodizios': this.ler_rodizios.bind(this),
      'atualiza_rodizios': this.atualiza_rodizios.bind(this),
      'ler_participantes': this.ler_participantes.bind(this),
      'insere_participante_no_rodizio': this.insere_participante_no_rodizio.bind(this),
      'cadastra_participante': this.cadastra_participante.bind(this),
      'atualiza_participante': this.atualiza_participante.bind(this),
      'deleta_participante': this.deleta_participante.bind(this),
      'remove_participante_do_rodizio': this.remove_participante_do_rodizio.bind(this),
      'adiciona_entrada_no_rodizio': this.adiciona_entrada_no_rodizio.bind(this),
      'adiciona_saida_no_rodizio': this.adiciona_saida_no_rodizio.bind(this),
      'atualiza_entregas': this.atualiza_entregas.bind(this),
    };

    rtc_login.destroy();

    this.emitprainterface(msgtobrowser);

    this.wiring();
  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Recebe o nome e a unidade de medida do rodizio a ser cadastrado e encaminha
   * para ser tratado.
   *
   * @param msg
   * @returns {Promise.<void>}
   */
  async cadastra_rodizio(msg) {

    let rodizio = msg.dados;

    msg.dados = await this.handler.cadastra_rodizio(rodizio);

    this.emitprainterface(msg);

  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Encaminha o pedido de leitura de rodízios para o handler.
   *
   * @param msg
   * @returns {Promise.<void>}
   */

  async ler_rodizios(msg){

    msg.dados = await this.handler.ler_rodizios();

    this.emitprainterface(msg);

  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Recebe o id do rodízio já cadastrado e os updates que devem substituir os
   * dados antigos e encaminha para ser tratado pelo handler.
   *
   * @param msg
   * @returns {Promise.<void>}
   */

  async atualiza_rodizios(msg) {

    msg.dados = await this.handler.atualiza_rodizios(msg.dados);

    this.emitprainterface(msg);
  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Recebe o nome, email e número de celular do participante a ser cadastrado e
   * encaminha para ser tratado pelo handler.
   *
   * @param msg
   * @returns {Promise.<void>}
   */

  async atualiza_entregas(msg) {

    msg.dados = await this.handler.atualiza_entregas(msg.dados);

    this.emitprainterface(msg);

  }

  async cadastra_participante(msg) {

    msg.dados = await this.handler.cadastra_participante(msg.dados);

    this.emitprainterface(msg);

  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Recebe o id do participante cadastrado, os updates que serão substituídos
   * pelos dados antigos e encaminha para ser tratado pelo handler.
   *
   * @param msg
   * @returns {Promise.<void>}
   */

  async atualiza_participante(msg) {

    msg.dados = await this.handler.atualiza_participante(msg.dados);

    this.emitprainterface(msg);

  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Recebe o id do participante a ser deletado e encaminha para ser tratado
   * pelo handler.
   *
   * @param msg
   * @returns {Promise.<void>}
   */

  async deleta_participante(msg) {

    msg.dados = await this.handler.deleta_participante(msg.dados);

    this.emitprainterface(msg);

  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Encaminha o pedido de leitura de participantes para o handler.
   *
   * @param msg
   * @returns {Promise.<void>}
   */

  async ler_participantes(msg){

    msg.dados = await this.handler.ler_participantes();

    this.emitprainterface(msg);

  }

  /**
   * Created by Thiago on 19/05/2017
   *
   * Recebe o id do rodízio cadastrado e o id do participante a ser inserido
   * neste rodízio e encaminha para ser tratado pelo handler.
   *
   * @param msg
   * @returns {Promise.<void>}
   */

  async insere_participante_no_rodizio(msg) {

    msg.dados = await this.handler.insere_participante_no_rodizio(msg.dados);

    this.emitprainterface(msg);

  }

  /**
   * Created by Thiago on 22/05/2017
   *
   * Recebe o id do rodízio e o número de entradas a serem adicionadas a ele e
   * encaminha para ser tratado pelo handler.
   *
   * @param msg
   * @returns {Promise.<void>}
   */

  async adiciona_entrada_no_rodizio(msg) {

    msg.dados = await this.handler.adiciona_entrada_no_rodizio(msg.dados);

    this.emitprainterface(msg);

  }

  /**
   * Created by Thiago on 22/05/2017
   *
   * Recebe o id do rodízio e o número de saídas a serem adicionadas a ele e
   * encaminha para ser tratado pelo handler.
   *
   * @param msg
   * @returns {Promise.<void>}
   */

  async adiciona_saida_no_rodizio(msg) {

    msg.dados = await this.handler.adiciona_saida_no_rodizio(msg.dados);

    this.emitprainterface(msg);

  }

  /**
   * Created by Thiago on 22/05/2017
   *
   * Recebe o id do rodízio e id do participante a ser deletado dele e encaminha
   * para ser tratado pelo handler.
   *
   * @param msg
   * @returns {Promise.<void>}
   */

  async remove_participante_do_rodizio(msg) {

    msg.dados = await this.handler.remove_participante_do_rodizio(msg.dados);

    this.emitprainterface(msg);

  }

  /**
   * Created by Thiago on 16/05/2017
   *
   * Envia o id do rodizio a ser deletado para o handler.
   *
   * @param msg
   * @returns {Promise.<void>}
   */

  async deleta_rodizio(msg) {

    let id = msg.dados;

    msg.dados = await this.handler.deleta_rodizio(id);

    this.emitprainterface(msg);

  }

  /**
   * Recebe a solicitacao de logout e encaminha para ser tratado.
   * @param msg
   * @returns {Promise.<void>}
   */
  async logout(msg){
    let id_usuario = msg.dados;

    msg.dados = await this.handler.logout(id_usuario);

    this.emitprainterface(msg);
  }

}

module.exports = rtc_admin;