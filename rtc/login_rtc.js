const Basico = require('./basico_rtc');
const Open_handler = require('../handlers/open_usuario_handler');
const Rtc_admin = require('./principal/rtc_admin');

class login_rtc extends Basico {
  /**
   * Recebe o socketId passado pelo cliente.
   *
   * @param conf
   */
  constructor(conf) {
    super('login', Open_handler, conf);

    this.rtc_clientes = {
      admin: Rtc_admin,
    };

    this.interfaceListeners = {
      'logar': this.logar.bind(this),
      'ler_rodizios': this.ler_rodizios.bind(this),
    };

    this.wiring();
  }

  set rtc_clientes(rtc_clientes){
    this._rtc_clientes = rtc_clientes;
  }

  get rtc_clientes(){
    return this._rtc_clientes;
  }

  async ler_rodizios(msg){

    msg.dados = await this.handler.ler_rodizios();

    this.emitprainterface(msg);

  }

  /**
   * Repassa o pedido de login do cliente.
   * @param msg
   * @returns {Promise.<void>}
   */
  async logar(msg){

    let dado = msg.dados;
    msg.dados = await this.handler.logar(dado);
    console.log('msg', msg);

    if(msg.dados._issuccess){
      this.trocar_rtc(msg);
      return;
    }

    this.emitprainterface(msg);
  }

  /**
   * Responsavel por criar o rtc para o tipo de funcionario.
   * @param dado
   */
  trocar_rtc(msg){

    let rtc_tipo = msg.dados.data[0].tipo;
    new this.rtc_clientes[rtc_tipo](this.config, msg, this);
  }
}

module.exports = login_rtc;