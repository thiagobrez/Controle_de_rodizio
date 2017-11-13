/**
 * Created by LabTIC on 22/06/2017.
 */
app.directive('dialogoentradasesaidas', [
  '$mdDialog', '$mdToast', '$rootScope',
  function ($mdDialog, $mdToast, $rootScope) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        participantesadicionados: '=',
        rodizioselecionado: '=',
        saidas: '=',
        rodada: '='
      },
      templateUrl: '../../../views/home_gerencia/dialogoEntradasESaidas/' +
      'dialogoEntradasESaidas.html',

      link: function (scope, element, attribute) {

        scope.jaEntregou = [];
        scope.dado_update = [];
        scope.entradas = 0;

        let atualizaEntradas = () => {
          for(let participante in scope.participantesadicionados){
            if(scope.participantesadicionados[participante].ja_entregou){
              scope.entradas++;
            }
          }
        };

        scope.$watch('rodizioselecionado', () => {
          atualizaEntradas();
        });

        scope.toggleEntradas = ($index) => {
          if (scope.jaEntregou[$index]) {
            scope.entradas++;
          } else {
            scope.entradas--;
          }
        };

        scope.envia = () => {
          if(scope.dado_update){
            scope.dado_update = [];
          }
          if(scope.saidas <= scope.entradas){
            if(scope.entradas === scope.participantesadicionados.length && scope.entradas === scope.saidas){
              scope.dado_update.push(0);                  //entradas
              scope.dado_update.push(0);                  //saidas
              scope.dado_update.push(scope.rodada + 1);   //rodada
              for(let participante in scope.participantesadicionados){
                scope.dado_update.push(
                  {
                    ja_entregou: false,
                    participante: scope.participantesadicionados[participante].participante.id
                  },
                );
              }
            } else {
              scope.dado_update.push(scope.entradas);     //entradas
              scope.dado_update.push(scope.saidas);       //saidas
              scope.dado_update.push(scope.rodada);       //rodada
              for (let participante in scope.participantesadicionados) {
                scope.dado_update.push(
                  {
                    ja_entregou: scope.jaEntregou[participante],
                    participante: scope.participantesadicionados[participante].participante.id
                  },
                );
              }
            }
            $rootScope.$broadcast('jaEntregou_atualizado', { dado_update: scope.dado_update });
            $mdDialog.hide();
          } else {
            $mdToast.showSimple('O número de saídas não deve ser superior ao número de entradas');
          }
        };

        scope.fechaDialogo = () => {
          $mdDialog.hide();
        };

      },
    };
}]);