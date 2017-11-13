let Util = require('../../util/util');
let Manager = require('./Manager');
let model = require('../model/Participante');

class Participante extends Manager {
  wireCustomListeners() {
    this.hub.on("db." + this.event_name + ".login", this.login.bind(this));
  }

  async login(msg) {
    if (msg.source_id === this.id) return null;

    let data = msg.data.success;

    let usuario = await this.model.findOne({
      $or: [{email: data.email}, {numerocelular: data.login}]
    })
      .select("email numerocelular senha tipo")
      .exec();

    if (!usuario) {
      this.answer(msg.id, "login", null, "Usuário não existe");
    } else if (usuario.senha !== data.senha) {
      this.answer(msg.id, "login", null, "Usuário e senha não batem");
    } else if (usuario.logado) {
      this.answer(msg.id, "login", null, "Usuario já logado, deslogar do outro equipamento?");
    }
    else {

      let user_atualizado = await this.model.findByIdAndUpdate(usuario.id, {logado: true}, {new: true});
      usuario = usuario.toJSON();
      usuario.logado = user_atualizado.logado;
      this.answer(msg.id, "login", [usuario], null);
      // OK
    }
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * model
   */
  get model() {
    return model;
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * nome
   */
  get event_name() {
    return 'participante';
  }
}

module.exports = Participante;