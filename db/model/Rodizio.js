const Mongoose = require('mongoose');
const types = Mongoose.Schema.Types;
const messages = require('../../util/messages.json').rodizio;

let schema_options = {
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  timestamps: true
  // http://mongoosejs.com/docs/guide.html#options
};

let schema = Mongoose.Schema({
  nome: {
    type: types.String,
    trim: true,
    required: [true, messages.nome.REQUIRED],
    unique: true,
  },
  participantes: {
    type: [{
      _id: false,
      ja_entregou: {
        type: types.Boolean,
        default: false,
      },
      participante: {
        type: types.ObjectId,
        ref: 'participante'
      }
    }],
    default: []
  },
  padrao: {
    type: types.String,
    trim: true,
    required: [true, messages.padrao],
  },
  data_inicio: {
    type: types.Date,
    default: new Date()
  },
  data_fim: {
    type: types.Date,
  },
  entradas: {
    type: types.Number,
    default: 0,
  },
  saidas: {
    type: types.Number,
    default: 0,
  },
  rodada: {
    type: types.Number,
    default: 1,
  },
  ativo: {
    type: types.Boolean,
    default: true
  }
}, schema_options);

module.exports = Mongoose.model('rodizio', schema);