/**
 * Created by Lab on 02/06/2017.
 */
app.directive('dialogoeditarodizio', [
  '$mdDialog', '$mdToast', '$rootScope',
  function($mdDialog, $mdToast, $rootScope) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        rodizios: '=',
        participantes: '=',
        editando: '=',
      },
      templateUrl: '../../../views/home_gerencia/dialogoEditaRodizio/dialogoEditaRodizio.html',

      link: function(scope, element, attribute) {
        scope.rodizioSelecionado = [];

        scope.fechaDialogo = () => {
          $rootScope.$broadcast('refresh');
          $mdDialog.hide();
        };

        scope.envia = () => {

          if(scope.rodizioSelecionado.length !== 0){
            $mdDialog.show({
              escapeToClose: false,
              contentElement: '#dialogoAdicionaRodizio2',
              parent: angular.element(document.body)
            });
          } else {
            $mdToast.showSimple('Por favor, selecione um rodízio');
          }

        };

      },
    };
  }]);
