/**
 * Controller da interface Home
 *
 * Como usar:
 * @example
 *  var x = rota.get('home')
 *
 * @class homeController
 */
app.controller('homeController', [
  '$scope', '$mdDialog',
  function($scope, $mdDialog) {

    $scope.rodizios = null;

    $scope.verParticipantes = (participantes) => {

      $scope.participantes = participantes;

      $mdDialog.show({
        escapeToClose: false,
        contentElement: '#dialogoVerParticipantes',
        parent: angular.element(document.body)
      });
    };

    let ready = () => {
      let msg = new Mensagem('ler_rodizios', null, 'retorno_rodizios', this);
      SIOM.send_to_server(msg);
    };

    let retorno_rodizios = (msg) => {
      if(msg.source === this){
        if (msg.dados._issuccess){
          $scope.rodizios = msg.dados._data;
          $scope.$apply();
        }
      }
    };

    let listeners = {
      'retorno_rodizios': retorno_rodizios.bind(this),
    };

    let wiring = ()=>{
      for(let name in listeners){
        if(listeners.hasOwnProperty(name)){
          SIOM.on(name, listeners[name]);
        }
      }

      ready();
    };

    wiring();

  }]);
