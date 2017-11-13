let Manager = require('./Manager');
let _model = require('../model/Rodizio');

class Rodizio extends Manager {

  /**
   * Método a ser implementado nas subclasses que ouvirem eventos fora do CRUD
   */
  wireCustomListeners() {
    this.hub.on("db." + this.event_name + ".atualizaentrega", this.handleAtualiza_entrega.bind(this));
  }

  handleAtualiza_entrega(msg) {
    if (msg.source_id === this.id) return;

    this.atualiza_entrega(msg.data.success).then((ret) => {
      this.answer(msg.id, "atualizaentrega", ret, null);
    }).catch((error) => {
      console.error(error);
      this.answer(msg.id, "atualizaentrega", null, error);
    });
  }

  async atualiza_entrega(dados) {

    let ret = await this.model.findById(dados.id);

    for(let i = 0; i < ret.participantes.length; i ++){
      for (let c = 0; c < dados.update.participantes.length; c ++){
        if(ret.participantes[i].participante.toString() === dados.update.participantes[c].participante){
          ret.participantes[i].ja_entregou = dados.update.participantes[c].ja_entregou;
          break;
        }
      }
    }

    let data = await ret.save();
    data = data.toJSON();

    return data;
  }

  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * model
   */
  get model() {
    return _model;
  }

  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * nome
   */
  get event_name() {
    return 'rodizio';
  }
}

module.exports = Rodizio;