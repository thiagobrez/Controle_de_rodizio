'[use strict]';
/**
 * Created by Osvaldo on 05/10/15.
 */

// Var sjcl = require('sjcl');

app.controller('loginController', [
  '$scope',
  // 'utilvalues',
  '$location',
  'setUserLogado',
  '$route',
  'seguranca',
  '$rootScope',
  function ($scope, $location,
            // utilvalues,
            setUserLogado, $route, seguranca, $rootScope) {

    var me = this;
    me.listeners = {};
    me.nonce = null;
    me.senhaHash = null;

    $scope.usuario_logado = {};

    //Rota de navegação
    me.wind = '/gerencia';
    //Titulo modal de retorno
    $scope.modalTitulo = '';
    //Mensagem modal de retorno
    $scope.modalTexto = '';
    //Formulario do usuario
    $scope.dadousuario = {
      nome: '',
      sobrenome: '',
      email: '',
      senha: '',
      confirmasenha: '',
      datanascimento: null,
      sexo: '',
      numerocelular: '',
      foto: '',
      tipo: 2,
      idioma: null,
    };

    // -------VARIAVEIS DE VALIDACAO
    $scope.validoSenha = true;
    $scope.validoEmailCadastrado = true;
    $scope.validoServer = true;
    // -----------------------------

    // ----------------todo remover
    // $scope.usuario = {
    //   email: 'admin@labtic.com',
    //   senha: 'admin'
    // };
    // ----------------------------

    /**
     * Criado por: Gustavo
     *
     * Transforma senha em hash
     */
    $scope.criaHash = function () {
      me.senhaHash = seguranca.hash(angular.copy($scope.usuario.senha));
    };

    /**
     * Criado por: Osvaldo;
     *
     * Tenta logar usuario;
     */
    $scope.logar = function () {

      $scope.trocaRota = function () {
        SIOM.emit('destroy');
        // limpanav(local, function () {
        //   // utilvalues.rotaatual [local] = 'active';
        //   $location.path('/' + local);
        // });
      };

      // me.senhaHash = seguranca.hash(angular.copy($scope.usuario.senha));
      //
      // me.nonce = Math.floor((Math.random() * 1000000000) + 1);
      //
      // var user = angular.copy($scope.usuario);
      // user.senha = {
      //   senha: me.senhaHash,
      //   nonce: me.nonce
      // };
      //
      // user.senha = seguranca.cifra(user.senha);

        // $scope.trocaRota();
      let msg = new Mensagem('logar', $scope.usuario, 'logado_sucesso', me);
      SIOM.send_to_server(msg);
      $rootScope.$broadcast('logado');

    };

    $scope.$on('logout', function(event, args) {
      let msg = new Mensagem('exit', $scope.usuario, 'exit', me);
      SIOM.send_to_browser(msg);
    });

    /**
     * Criado por: Osvaldo;
     *
     * quando o usuario entra, joga o usuario logado globalmente.
     *
     * @param msg
     */
    me.logou = function (msg) {
      let dado = msg._dados;
      // var log = seguranca.verificaAutenticacao(dado, me.nonce, me.senhaHash);
      if(dado._issuccess){
        setUserLogado.setLogado(dado._data[0]);
        $scope.usuario_logado = dado._data[0];
        $scope.usuario_logado.logado = true;
        $rootScope.$broadcast('logado');
        let msg = new Mensagem('setarota', {tipo: dado._data[0].tipo}, 'setarota', me);
        SIOM.send_to_browser('setarota', msg);
        me.nextView();
      } else {
        console.log('erro');
      }

    };

    /**
     * Criado por: Osvaldo;
     *
     * destroy a interface.
     */
    me.destroy = function () {
      for (var name in me.listeners) {
        if (me.listeners.hasOwnProperty(name)) {

          SIOM.removeListener(name, me.listeners[name]);

        }
      }
    };

    /**
     * Criado por: Osvaldo;
     *
     * Troca rota;
     */
    me.nextView = function () {
      $location.path(me.wind);
      $route.reload();
    };

    /**
     * Criado/modificado por: Osvaldo e Gustavo;
     *
     * Retorno do server de erro do server;
     *
     * @param msg
     */
    me.serverError = function (msg) {
      $scope.validoServer = false;
      $scope.$apply();
    };

    /**
     * Criado/modificado por: Osvaldo e Gustavo;
     *
     * Retorno do server de email nao cadastrado;
     *
     * @param msg
     */
    me.invalidUser = function (msg) {
      $scope.validoEmailCadastrado = false;
      $scope.$apply();
    };

    /**
     * Criado/modificado por: Osvaldo e Gustavo;
     *
     * Retorno do server de senha incorreta;
     *
     * @param msg
     */
    me.senhaincorreta = function (msg) {
      $scope.validoSenha = false;
      $scope.$apply();
    };

    /**
     * Criado por: Gustavo;
     *
     * Alterna entre mostra formulario de cadastro e formulario de login;
     *
     * @param alterna
     * @param esconde
     * @param mostra
     */
    $scope.trocaLoginCadastro = function (alterna, esconde, mostra) {

      $('.' + esconde).animate({width: 'toggle'}, 350, function () {
        $('.' + mostra).animate({width: 'toggle'}, 350);
      });

    };

    /**
     * Criado por: Gustavo;
     *
     * Retorna ao usuario que cadastro foi um sucesso;
     *
     * @param msg
     */
    me.retCadastrado = function(msg) {
      $scope.modalTitulo = 'Cadastro sucesso';
      $scope.modalTexto = 'Seu usuario foi cadastrado com sucesso';
      $scope.trocaLoginCadastro(0, 'span-cadastrausuario', 'span-loginusuario');
      $('#modalRetorno').modal();
      $scope.$apply();
    };

    me.teste = (msg)=>{
      console.log('chegou aqui no logar', msg);
    };

    me.wiring = function() {
      me.listeners['usuario.login'] = me.logou.bind(me);
      me.listeners['logado_sucesso'] = me.logou.bind(me);
      me.listeners['logar'] = me.logou.bind(me);
      me.listeners['usuario.error.logar'] = me.serverError.bind(me);
      me.listeners['usuario.emailnaocadastrado'] = me.invalidUser.bind(me);
      me.listeners['usuario.senhaincorreta'] = me.senhaincorreta.bind(me);
      me.listeners['rotasetada'] = me.nextView.bind(me);
      me.listeners['usuario.created'] = me.retCadastrado.bind(me);

      for (var name in me.listeners) {
        if (me.listeners.hasOwnProperty(name)) {

          SIOM.on(name, me.listeners[name]);

        }
      }

    };

    me.wiring();

  }]);