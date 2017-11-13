'use strict';

const chai = require('chai');
const chaihttp = require('chai-http');
const TestManager = require('../TestManager');

chai.use(chaihttp);

let should = chai.should();
let expect = chai.expect;

let io = require('socket.io-client');
let socketUrl = 'http://localhost:1337';
let options = {
  transport: ['websocket'],
  'force new connection': true,
};

let testManager = null;

describe('Teste rtc_admin', () => {
  before(function (done) {
    testManager = new TestManager(done);
  });

  let cliente = io(socketUrl);

  let admin_logado = null;
  let rodizio_cadastrado = null;
  let participantes_cadastrados = null; // [] ?

  /**
   * Created by Osvaldo
   * Testa se admin erra login
   */
  it('1. Admin login incorreto', (done) => {

    cliente.on('connect', (data) => {

      let retorno_login = function (msgresposta) {

        expect(msgresposta.dados._issuccess).to.be.false;
        expect(msgresposta.dados._data).to.equal("Usuário não existe");
        expect(msgresposta.evento_retorno).to.equal("logado_sucesso");

        cliente.removeListener('retorno', retorno_login);
        done();
      };

      cliente.on('retorno', retorno_login);

      let user = {
        email: 'não existe',
        senha: 'admin',
      };

      let msg = {
        evento_retorno: 'logado_sucesso',
        dados: user,
      };

      cliente.emit('logar', msg);
    });

    cliente.connect();

  });

  /**
   * Created by Osvaldo
   * Testa se admin acerta login e erra senha
   */
  it('2. Admin login senha incorreta', (done) => {

    let retorno_login = function (msgresposta) {

      expect(msgresposta.dados._issuccess).to.be.false;
      expect(msgresposta.dados._data).to.equal("Usuário e senha não batem");

      cliente.removeListener('retorno', retorno_login);
      done();
    };

    cliente.on('retorno', retorno_login);

    let user = {
      email: 'admin@labtic.com',
      senha: 'naoexiste',
    };

    let msg = {
      evento_retorno: 'logado_sucesso',
      dados: user,
    };

    cliente.emit('logar', msg);

  });

  /**
   * Created by Osvaldo
   *
   */
  it('3. Admin login correto', (done) => {

    let retorno_login = function (msgresposta) {

      expect(msgresposta.dados._issuccess).to.be.true;
      expect(msgresposta.dados._data).to.be.instanceOf(Array);
      expect(msgresposta.dados._data[0]).to.be.any.key('email', 'numerocelular', 'tipo');

      admin_logado = msgresposta.dados._data[0];

      cliente.removeListener('retorno', retorno_login);
      done();
    };

    cliente.on('retorno', retorno_login);

    let user = {
      email: 'admin@labtic.com',
      senha: 'admin',
    };

    let msg = {
      evento_retorno: 'logado_sucesso',
      dados: user,
    };

    cliente.emit('logar', msg);

  });

  it('4. Admin cadastra rodizio', (done) => {

    let retorno_rodizio_cadastrado = (msgresposta) => {

      expect(msgresposta.dados._issuccess).to.be.true;
      expect(msgresposta.dados._data).to.be.instanceOf(Array);
      expect(msgresposta.dados._data[0]).to.be.any.key('nome', 'padrao');
      expect(msgresposta.evento_retorno).to.equal("retorno_rodizio_cadastrado");

      rodizio_cadastrado = msgresposta.dados._data[0];

      cliente.removeListener('retorno', retorno_rodizio_cadastrado);
      done();
    };

    cliente.on('retorno', retorno_rodizio_cadastrado);

    let rodizio = {
      nome: 'cafezinho',
      padrao: 'Melitta 0.5 kg',
    };

    let msg = {
      evento_retorno: 'retorno_rodizio_cadastrado',
      dados: rodizio,
    };

    cliente.emit('cadastra_rodizio', msg);

  });

  it('5. Admin le rodizios', (done) => {

    let retorno_rodizio_lidos = (msgresposta) => {

      expect(msgresposta.dados._issuccess).to.be.true;
      expect(msgresposta.evento_retorno).to.equal("retorno_rodizio_lidos");

      cliente.removeListener('retorno', retorno_rodizio_lidos);
      done();
    };

    cliente.on('retorno', retorno_rodizio_lidos);

    let msg = {
      evento_retorno: 'retorno_rodizio_lidos',
      dados: null,
    };

    cliente.emit('ler_rodizios', msg);

  });

  it('6. Admin atualiza rodizio', (done) => {

    let retorno_rodizio_atualizado = (msgresposta) => {

      expect(msgresposta.dados._issuccess).to.be.true;
      expect(msgresposta.evento_retorno).to.equal("retorno_rodizio_atualizado");

      rodizio_cadastrado = msgresposta.dados._data[0];

      cliente.removeListener('retorno', retorno_rodizio_atualizado);
      done();
    };

    cliente.on('retorno', retorno_rodizio_atualizado);

    let msg = {
      evento_retorno: 'retorno_rodizio_atualizado',
      dados: {
        id: rodizio_cadastrado.id,
        update: {
          nome: "água",
          padrao: "1 litro"
        }
      },
    };

    cliente.emit('atualiza_rodizios', msg);

  });

  it('7. Admin atualiza entregas', (done) => {

    let retorno_entregas_atualizadas = (msgresposta) => {

      expect(msgresposta.dados._issuccess).to.be.true;
      expect(msgresposta.evento_retorno).to.equal("retorno_entregas_atualizadas");

      rodizio_cadastrado = msgresposta.dados._data[0];

      cliente.removeListener('retorno', retorno_entregas_atualizadas);
      done();
    };

    cliente.on('retorno', retorno_entregas_atualizadas);

    let msg = {
      evento_retorno: 'retorno_entregas_atualizadas',
      dados: {
        id: rodizio_cadastrado.id,
        update: {
          participantes: {
            ja_entregou: true,
            participante: '58fa84bcfb3374281895fab9'
          }
        }
      },
    };

    cliente.emit('atualiza_entregas', msg);

  });

  it('8. Admin cadastra participantes', (done) => {

    let retorno_participante_cadastrado = (msgresposta) => {

      expect(msgresposta.dados._issuccess).to.be.true;
      expect(msgresposta.dados._data).to.be.instanceOf(Array);
      expect(msgresposta.dados._data[0]).to.be.any.key('nome', 'email', 'numerocelular');
      expect(msgresposta.evento_retorno).to.equal("retorno_participante_cadastrado");

      participantes_cadastrados = msgresposta.dados._data[0];

      cliente.removeListener('retorno', retorno_participante_cadastrado);
      done();
    };

    cliente.on('retorno', retorno_participante_cadastrado);

    let participante = {
      nome: 'participantezinho',
      email: 'participantezinho@teste.com',
      numerocelular: '4899999999',
    };

    let msg = {
      evento_retorno: 'retorno_participante_cadastrado',
      dados: participante,
    };

    cliente.emit('cadastra_participante', msg);

  });

  it('9. Admin atualiza participante', (done) => {

    let retorno_participante_atualizado = (msgresposta) => {

      expect(msgresposta.dados._issuccess).to.be.true;
      expect(msgresposta.evento_retorno).to.equal("retorno_participante_atualizado");

      participantes_cadastrados = msgresposta.dados._data[0];

      cliente.removeListener('retorno', retorno_participante_atualizado);
      done();
    };

    cliente.on('retorno', retorno_participante_atualizado);

    let msg = {
      evento_retorno: 'retorno_participante_atualizado',
      dados: {
        id: participantes_cadastrados.id,
        update: {
          nome: "testezão",
          email: "testezão@testezão.com",
        }
      },
    };

    cliente.emit('atualiza_participante', msg);

  });

  it('10. Admin deleta participante', (done) => {

    let retorno_participante_deletado = function (msgresposta) {

      expect(msgresposta.dados._issuccess).to.be.true;
      expect(msgresposta.dados._data).to.be.instanceOf(Array);
      expect(msgresposta.dados._data[0]).to.be.any.key('nome', 'email', 'numerocelular');
      expect(msgresposta.evento_retorno).to.equal("retorno_participante_deletado");

      cliente.removeListener('retorno', retorno_participante_deletado);
      done();
    };

    cliente.on('retorno', retorno_participante_deletado);

    let msg = {
      evento_retorno: 'retorno_participante_deletado',
      dados: {
        id: participantes_cadastrados.id,
        update: {
          ativo: false
        }
      }
    };

    cliente.emit('deleta_participante', msg);

  });

  it('11. Admin le participantes', (done) => {

    let retorno_participantes_lidos = (msgresposta) => {

      expect(msgresposta.dados._issuccess).to.be.true;
      expect(msgresposta.evento_retorno).to.equal("retorno_participantes_lidos");

      cliente.removeListener('retorno', retorno_participantes_lidos);
      participantes_cadastrados = msgresposta.dados._data;
      done();
    };

    cliente.on('retorno', retorno_participantes_lidos);

    let msg = {
      evento_retorno: 'retorno_participantes_lidos',
      dados: null,
    };

    cliente.emit('ler_participantes', msg);

  });

  it('12. Admin insere participantes no rodizio', (done) => {

    let retorno_participante_inserido_no_rodizio = (msgresposta) => {

      expect(msgresposta.dados._issuccess).to.be.true;
      expect(msgresposta.dados._data).to.be.instanceOf(Array);
      expect(msgresposta.dados._data[0]).to.be.any.key('nome', 'email');
      expect(msgresposta.evento_retorno).to.equal("retorno_participante_inserido_no_rodizio");

      cliente.removeListener('retorno', retorno_participante_inserido_no_rodizio);
      done();
    };

    cliente.on('retorno', retorno_participante_inserido_no_rodizio);

    let msg = {
      evento_retorno: 'retorno_participante_inserido_no_rodizio',
      dados: {
        id: rodizio_cadastrado.id,
        participantes: [participantes_cadastrados[0].id]
      }
    };

    cliente.emit('insere_participante_no_rodizio', msg);

  });

  it('13. Admin adiciona entrada no rodízio', (done) => {

    let retorno_entrada_adicionada_ao_rodizio = (msgresposta) => {

      expect(msgresposta.dados._issuccess).to.be.true;
      expect(msgresposta.dados._data).to.be.instanceOf(Array);
      expect(msgresposta.dados._data[0]).to.be.any.key('entradas', 'nome');
      expect(msgresposta.evento_retorno).to.equal("retorno_entrada_adicionada_ao_rodizio");

      cliente.removeListener('retorno', retorno_entrada_adicionada_ao_rodizio);
      done();
    };

    cliente.on('retorno', retorno_entrada_adicionada_ao_rodizio);

    let msg = {
      evento_retorno: 'retorno_entrada_adicionada_ao_rodizio',
      dados: {
        id: rodizio_cadastrado.id,
        update: {
          entradas: 1
        }
      }
    };

    cliente.emit('adiciona_entrada_no_rodizio', msg);

  });

  it('14. Admin adiciona saída no rodízio', (done) => {

    let retorno_saida_adicionada_ao_rodizio = (msgresposta) => {

      expect(msgresposta.dados._issuccess).to.be.true;
      expect(msgresposta.dados._data).to.be.instanceOf(Array);
      expect(msgresposta.dados._data[0]).to.be.any.key('saidas', 'nome');
      expect(msgresposta.evento_retorno).to.equal("retorno_saida_adicionada_ao_rodizio");

      cliente.removeListener('retorno', retorno_saida_adicionada_ao_rodizio);
      done();
    };

    cliente.on('retorno', retorno_saida_adicionada_ao_rodizio);

    let msg = {
      evento_retorno: 'retorno_saida_adicionada_ao_rodizio',
      dados: {
        id: rodizio_cadastrado.id,
        update: {
          saidas: 1
        }
      }
    };

    cliente.emit('adiciona_saida_no_rodizio', msg);

  });

  it('15. Admin remove participante do rodizio', (done) => {

    let retorno_participante_removido_do_rodizio = (msgresposta) => {

      expect(msgresposta.dados._issuccess).to.be.true;
      expect(msgresposta.evento_retorno).to.equal("retorno_participante_removido_do_rodizio");


      cliente.removeListener('retorno', retorno_participante_removido_do_rodizio);
      done();
    };

    cliente.on('retorno', retorno_participante_removido_do_rodizio);

    let msg = {
      evento_retorno: 'retorno_participante_removido_do_rodizio',
      dados: {
        id: rodizio_cadastrado.id,
        update: {
          participantes: [{
            participante: participantes_cadastrados[0].id
          }]
        }
      }
    };

    cliente.emit('remove_participante_do_rodizio', msg);

  });

  it('16. Admin deleta rodizio', (done) => {

    let retorno_rodizio_deletado = function (msgresposta) {

      expect(msgresposta.dados._issuccess).to.be.true;
      expect(msgresposta.dados._data).to.be.instanceOf(Array);
      expect(msgresposta.dados._data[0]).to.be.any.key('nome', 'padrao');
      expect(msgresposta.evento_retorno).to.equal("retorno_rodizio_cadastrado");

      cliente.removeListener('retorno', retorno_rodizio_deletado);
      done();
    };

    cliente.on('retorno', retorno_rodizio_deletado);

    let msg = {
      evento_retorno: 'retorno_rodizio_cadastrado',
      dados: {
        id: rodizio_cadastrado.id,
        update: {
          ativo: false
        }
      }
    };

    cliente.emit('deleta_rodizio', msg);

  });

  it('17. Admin Logout', (done) => {

    let retorno_logout = function (msgresposta) {

      expect(msgresposta.dados._issuccess).to.be.true;
      expect(msgresposta.dados._data).to.be.instanceOf(Array);
      expect(msgresposta.dados._data[0]).to.be.any.key('email', 'numerocelular', 'tipo');
      expect(msgresposta.evento_retorno).to.equal("logado_sucesso");

      cliente.removeListener('retorno', retorno_logout);
      done();
    };

    cliente.on('retorno', retorno_logout);

    let msg = {
      evento_retorno: 'logado_sucesso',
      dados: admin_logado.id,
    };

    cliente.emit('logout', msg);

  });

});