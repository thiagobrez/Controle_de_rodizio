/**
 * Created by Osvaldo/Gustavo on 22/10/15.
 */

function ConfigRotas($routeProvider) {
  var me = this;
  me.route = $routeProvider;
  me.listeners = {};



  me.incluiRota = function () {
    me.ligaRota();
  };

  me.ligaRota = function () {
    for (var name in me.rotas) {
      me.route.when(name, me.rotas[name]);
    }
  };

  me.setaRota = function (msg) {
    let tipo_usuario = msg._dados.tipo;
    if(tipo_usuario === 'admin'){
      me.route.when('/gerencia', {
        templateUrl: '../views/home_gerencia/homeGerencia.html',
        controller: 'homeGerenciaController'
      });
    }

    let msg_retorno = new Mensagem('rotasetada', {}, null, me);
    SIOM.send_to_browser('rotasetada', msg_retorno);
  };

  me.usuariosaiu = function () {
    console.log('saiu');
    me.destroy();
    // me.route.when('/', {
    //   templateUrl: '../views/home/home.html',
    //   controller: 'homeController'
    // });
  };

  me.destroy = function () {
    for (var name in me.listeners) {
      SIOM.removeListener(name, me.listeners[name]);
    }
  };

  me.wiring = function () {

    me.route.when('/', {
      templateUrl: '../views/home/home.html',
      controller: 'homeController'
    });
    me.route.when('/login', {
      templateUrl: '../views/login/login.html',
      controller: 'loginController'
    });

    me.listeners['setarota'] = me.setaRota.bind(me);
    me.listeners['exit'] = me.usuariosaiu.bind(me);

    for (var name in me.listeners) {
      SIOM.on(name, me.listeners[name]);
    }

  };

  me.wiring();
}

app.config(ConfigRotas);