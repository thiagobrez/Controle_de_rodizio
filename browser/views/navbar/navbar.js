/**
 * Created by Gustavo on 21/05/2016.
 */
app.directive('navbar', [
  '$location',
  'getUserLogado',
  'setUserLogado',
  '$window',
  '$route',
  '$rootScope',
  function ($location, getUserLogado, setUserLogado, $window, $route, $rootScope) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl: '../../views/navbar/navbar.html',

      link: function (scope, element) {

        scope.logado = false;

        scope.$on('logado', function(event, args) {
          scope.logado = true;
        });

        scope.trocaRota = (rota) => {
          // SIOMLab.emiter('destroy');
          // utilvalues.rotaatual[rota] = 'active';

          if(rota === undefined){
            scope.logado = false;
            $location.path('/');
            $rootScope.$broadcast('logout');
            location.reload();
          } else {
            $location.path('/' + rota);
          }
        };

        let teste_retorno = (msg) => {
          console.log('retornou aqui', msg);
        };

        let ready = () => {
          let msg = new Mensagem('teste', {dados: 'osvaldo'}, 'teste_retorno', this);
          SIOM.send_to_server(msg);
        };

        let listeners = {
          'teste_retorno': teste_retorno.bind(this),
        };

        let wiring = () => {

          for (let name in listeners) {
            if (listeners.hasOwnProperty(name)) {
              SIOM.on(name, listeners[name]);
            }
          }

          ready();
        };

        wiring();

      },
    };
  }]);
