/**
 * Created by Lab on 02/06/2017.
 */
app.directive('dialogoeditaparticipante', [
  '$mdDialog', '$mdToast',
  function($mdDialog, $mdToast) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        participantes: '=',
      },
      templateUrl: '../../../views/home_gerencia/dialogoEditaParticipante/dialogoEditaParticipante.html',

      link: function(scope, element, attribute) {

        scope.participanteSelecionado = [];

        scope.fechaDialogo = () => {
          $mdDialog.hide();
        };

        scope.envia = () => {

          if(scope.participanteSelecionado.length !== 0){
            $mdDialog.show({
              escapeToClose: false,
              contentElement: '#dialogoAdicionaParticipante2',
              parent: angular.element(document.body)
            });
          } else {
            $mdToast.showSimple('Por favor, selecione um participante');
          }

        };

      },
    };
  }]);
