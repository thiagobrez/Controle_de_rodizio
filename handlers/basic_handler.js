const Source = require('../eventos/source');
const clienteretorno = require('./util_handler/dado_retorno');

class Basic_handler extends Source{

  constructor(){
    super();
    this.clienteretorno = clienteretorno;
  }

  set clienteretorno(clienteretorno){
    this._clienteretorno = clienteretorno;
  }

  get clienteretorno(){
    return this._clienteretorno;
  }

  emitServer(event, dado){
    return this.hub.send(this, event, {success: dado, error: null,}).promise;
  }

  async retorno(data){
    if(data.error){
      return new this.clienteretorno(false, data.error);
    }

    return new this.clienteretorno(true, data.success);
  }

  async retornopromises(msgs){
    let retorno = {
      success: [],
      error: [],
    };

    for (let index = 0; index < msgs.length; index++) {
      if (msgs[index]._data.success){
        retorno.success.push(new this.clienteretorno(true,
          msgs[index]._data.success))
      } else {
        retorno.error.push(new this.clienteretorno(true,
          msgs[index]._data.error))
      }
    }

    return retorno;
  }
}

module.exports = Basic_handler;