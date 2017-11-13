const Admin = require('./Admin');
const Participante = require('./Participante');
const Rodizio = require('./Rodizio');

/**
 * Inicia todos os managers.
 */
let Mongoosemodels = {
  participante: new Participante(),
  admin: new Admin(),
  rodizio: new Rodizio(),
};

module.exports = Mongoosemodels;