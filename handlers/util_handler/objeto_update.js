class Objeto_update{

  constructor(query, update){
    this.query = query;
    this.update = update;
  };

  set query(query) {
    if(typeof query === 'object'){
      this._query = query;
    } else {
      this._query = {
        _id: query,
      };
    }
  }

  get query() {
    return this._query;
  }

  set update(update){

    if(update.$pushAll){
      return this._update = update;
    }

    this._update = {
      $set: update,
    };
  }

  get update(){
    return this._update;
  }
}

module.exports = Objeto_update;