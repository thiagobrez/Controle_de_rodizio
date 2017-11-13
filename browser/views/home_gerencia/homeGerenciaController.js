/**
 * Controller da interface homeGerencia
 *
 * Como usar:
 * @example
 *  var x = rota.get('home')
 *
 * @class homeGerenciaController
 */
app.controller('homeGerenciaController', [
  '$scope', '$mdDialog', '$mdToast',
  function ($scope, $mdDialog, $mdToast) {

    $scope.participantes = null;
    $scope.rodizios = null;
    $scope.editando = false;

    $scope.adicionaParticipante = () => {

      $mdDialog.show({
        escapeToClose: false,
        contentElement: '#dialogoAdicionaParticipante',
        parent: angular.element(document.body)
      });

    };

    $scope.adicionaRodizio = () => {

      $mdDialog.show({
        escapeToClose: false,
        contentElement: '#dialogoAdicionaRodizio',
        parent: angular.element(document.body)
      });

    };

    $scope.editaParticipante = (participantes) => {

      $mdDialog.show({
        escapeToClose: false,
        contentElement: '#dialogoEditaParticipante',
        parent: angular.element(document.body)
      });

    };

    $scope.editaRodizio = (rodizios) => {

      $scope.editando = true;
      $scope.rodizioSelecionado = null;

      $mdDialog.show({
        escapeToClose: false,
        contentElement: '#dialogoEditaRodizio',
        parent: angular.element(document.body)
      });

    };

    let ready = () => {

      let msg = new Mensagem('ler_participantes', null, 'retorno_participantes', this);
      let msg2 = new Mensagem('ler_rodizios', null, 'retorno_rodizios', this);
      SIOM.send_to_server(msg);
      SIOM.send_to_server(msg2);

    };

    $scope.$on('refresh', function(event, args) {
      ready();
    });

    let retorno_participantes = (msg) => {
      if(msg.source === this){
        if(msg.dados._issuccess){
          $scope.participantes = msg.dados._data;
          $scope.$apply();
        }
      }
    };

    let retorno_rodizios = (msg) => {
      if(msg.source === this){
        if(msg.dados._issuccess){
          $scope.rodizios = msg.dados._data;
          $scope.$apply();
        }
      }
    };

    let retorno_rodizio_cadastrado = (msg) => {
      if(msg.dados._issuccess) {
        $mdToast.showSimple('Rodízio cadastrado com sucesso');
        ready();
      } else {
        $mdToast.showSimple('Erro ao cadastrar o rodízio');
      }
    };

    let retorno_participante_cadastrado = (msg) => {
      if(msg.dados._issuccess) {
        $mdToast.showSimple('Participante cadastrado com sucesso');
        ready();
      } else {
        $mdToast.showSimple('Erro ao cadastrar o participante');
      }
    };

    let retorno_participante_atualizado = (msg) => {
      if(msg.dados._issuccess) {
        $mdToast.showSimple('Participante editado com sucesso');
        ready();
      } else {
        $mdToast.showSimple('Erro ao editar o participante');
      }
    };

    let retorno_rodizio_atualizado = (msg) => {
      if(msg.dados._issuccess) {
        $mdToast.showSimple('Rodízio editado com sucesso');
        ready();
      } else {
        $mdToast.showSimple('Erro ao editar o rodízio');
      }
    };

    let retorno_participante_removido = (msg) => {
      if(msg.dados._issuccess) {
        $mdToast.showSimple('Participante removido com sucesso');
        ready();
      } else {
        $mdToast.showSimple('Erro ao remover o participante');
      }
    };

    let retorno_rodizio_removido = (msg) => {
      if(msg.dados._issuccess) {
        $mdToast.showSimple('Rodízio removido com sucesso');
        ready();
      } else {
        $mdToast.showSimple('Erro ao remover o rodízio');
      }
    };

    let retorno_entregas_atualizadas = (msg) => {
      if(msg.dados._issuccess) {
        ready();
      } else {
        $mdToast.showSimple('Erro ao atualizar as entregas');
      }
    };

    let listeners = {
      'retorno_participantes': retorno_participantes.bind(this),
      'retorno_rodizios': retorno_rodizios.bind(this),
      'rodizio_cadastrado': retorno_rodizio_cadastrado.bind(this),
      'participante_cadastrado': retorno_participante_cadastrado.bind(this),
      'participante_atualizado': retorno_participante_atualizado.bind(this),
      'rodizio_atualizado': retorno_rodizio_atualizado.bind(this),
      'participante_removido': retorno_participante_removido.bind(this),
      'rodizio_removido': retorno_rodizio_removido.bind(this),
      'entregas_atualizadas': retorno_entregas_atualizadas.bind(this),

    };

    let wiring = () => {
      for(let name in listeners) {
        if(listeners.hasOwnProperty(name)) {
          SIOM.on(name, listeners[name]);
        }
      }
      ready();
    };

    wiring();

  }]);