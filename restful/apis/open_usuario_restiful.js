'use strict';

const BasicRestful = require('../basicrestful');
const Open_handler = require('../../handlers/open_usuario_handler');
const httpStatus = require('http-status-codes');

class login_restiful extends BasicRestful {

  constructor(router) {
    super(router, Open_handler);

    this.rotas = {
      get: {
        '/open/login': this.logar.bind(this),
      },
    };

    this.wiring();
  }

  set rotas(rotas){
    this._rotas = rotas;
  }

  get rotas(){
    return this._rotas;
  }

  /**
   * Responsavel por encaminhar o login
   *
   * @param req
   * @param res
   * @returns {Promise.<void>}
   */
  async logar(req, res){
    let query = req.query;
    let ret = await this.handler.logar(query.ref);

    return res.status(httpStatus.OK).send(ret);
  }

}


module.exports = login_restiful;