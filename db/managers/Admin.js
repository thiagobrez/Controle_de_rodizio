let Participante = require('./Participante');
let _model = require('../model/Admin');

class Admin extends Participante {
  constructor() {
    super();
    // this.criaPrimeiroAdmin();
    // TODO: Comentar e descomentar a medida que o servidor cai
  }

  wireCustomListeners() {
    super.wireCustomListeners();
  }

  criaPrimeiroAdmin() {
    let admin = {
      nome: "Thiago",
      sobrenome: "Brezinski",
      email: "admin@labtic.com",
      senha: "admin",
      numerocelular: 48999510015
    };
    this.model.create(admin);
  };

  //noinspection JSMethodCanBeStatic
  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * model
   */
  get model() {
    return _model;
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * nome
   */
  get event_name() {
    return 'admin';
  }
}

module.exports = Admin;