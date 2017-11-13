/**
 * Created by Lab on 02/05/2017.
 */
app.directive('dialogoverparticipantes', [
  '$mdDialog',
  function($mdDialog) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        participantes: '=',
      },
      // templateUrl: 'views/home/dialogoVerParticipantes/dialogoVerParticipantes.html',
      templateUrl: '../../../views/home/dialogoVerParticipantes/dialogoVerParticipantes.html',
      // templateUrl: 'dialogoVerParticipantes.html',

      link: function(scope, element) {

        scope.fechaDialogo = () => {
          $mdDialog.hide();
        };

      },
    };
  }]);
