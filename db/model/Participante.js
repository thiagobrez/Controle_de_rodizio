'use strict';

const Mongoose = require('mongoose');
const types = Mongoose.Schema.Types;
const messages = require('../../util/messages.json').participante;
const Util = require('../../util/util');

let schema_options = {
  discriminatorKey: "tipo",
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
    required: [true, messages.nome.REQUIRED],
    trim: true
  },
  sobrenome: {
    type: types.String,
    trim: true
  },
  email: {
    type: types.String,
    required: [true, messages.email.REQUIRED],
    unique: true,
  },
  numerocelular: {
    type: types.Number,
    required: [true, messages.numerocelular.REQUIRED]
  },
  ativo: {
    type: types.Boolean,
    default: true
  }
}, schema_options);

module.exports = Mongoose.model('participante', schema);