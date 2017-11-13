/**
 * Created by Lab on 01/06/2017.
 */
app.directive('dialogoadicionarodizio', [
  '$mdDialog', '$mdToast', '$rootScope',
  function ($mdDialog, $mdToast, $rootScope) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        participantes: '=',
        rodizioselecionado: '=',
        editando: '=',
      },
      templateUrl: '../../../views/home_gerencia/dialogoAdicionaRodizio/dialogoAdicionaRodizio.html',

      link: function (scope, element, attribute) {

        scope.participantesAdicionados = [];

        let estaAtivo = () => {
          let ativos = [];
          for(let participanteRodizio in scope.rodizioselecionado.participantes){
            for(let participanteGeral in scope.participantes){
              if(scope.rodizioselecionado.participantes[participanteRodizio].participante.id
                === scope.participantes[participanteGeral].id){
                  ativos.push(scope.rodizioselecionado.participantes[participanteRodizio]);
              }
            }
          }
          return ativos;
        };

        let tiraParticipantesJaNoRodizio = () => {
          let participantesRestantes = [];

          for (let i = 0; i < scope.participantes.length; i++) {
            let achei = false;
            for (let c = 0; c < scope.participantesAdicionados.length; c++) {
              if (scope.participantes[i].id ===
                scope.participantesAdicionados[c].participante.id) {
                achei = true;
                break;
              }
            }
            if (!achei) participantesRestantes.push(scope.participantes[i]);
          }
          return participantesRestantes;
        };

        let novoRodizio = () => {
          if (scope.editando) {
            scope.addOuEdit = 'Editar';
            scope.participantesAdicionados = estaAtivo();
            scope.participantes = tiraParticipantesJaNoRodizio();

            let dado_update = {
              nome: scope.rodizioselecionado.nome,
              padrao: scope.rodizioselecionado.padrao,
              data_inicio: new Date(scope.rodizioselecionado.data_inicio),
              entradas: scope.rodizioselecionado.entradas === null ?
                0 : scope.rodizioselecionado.entradas,
              saidas: scope.rodizioselecionado.saidas === null ?
                0 : scope.rodizioselecionado.saidas,
              rodada: scope.rodizioselecionado.rodada === null ?
                0 : scope.rodizioselecionado.rodada,
              participantes: scope.participantesAdicionados
            };

            return dado_update;

          } else {
            scope.addOuEdit = 'Adicionar';
            return {
              dados: {
                nome: '',
                padrao: '',
                data_inicio: null,
                entradas: null,
                saidas: null,
                rodada: null,
                participantes: []
              }
            };
          }

        };

        scope.novoRodizio = novoRodizio();

        scope.$watch('rodizioselecionado', () => {
          if(scope.rodizioselecionado){
            scope.novoRodizio = novoRodizio();
          }
        });

        scope.fechaDialogo = () => {
          $rootScope.$broadcast('refresh');
          if(scope.editando){
            scope.rodizioselecionado = [];
          }
          scope.participantesAdicionados = [];
          $mdDialog.hide();
        };

        let get_ids_participantes = () => {
          let ids = [];

          for (let part = 0; part < scope.participantesAdicionados.length; part++) {
            ids.push({participante: scope.participantesAdicionados[part].participante.id});
          }
          return ids;
        };

        scope.envia = () => {

          scope.novoRodizio.participantes = get_ids_participantes();

          if(scope.formAdicionaRodizio.inputData.$valid) {

            if (scope.novoRodizio.nome) {
              if (scope.novoRodizio.padrao) {
                if (scope.novoRodizio.data_inicio === null) {
                  scope.novoRodizio.data_inicio = new Date();
                }

                if (scope.editando) {

                  let dado = {
                    id: scope.rodizioselecionado.id,
                    update: scope.novoRodizio,
                  };

                  let msg = new Mensagem('atualiza_rodizios', dado, 'rodizio_atualizado', this);
                  SIOM.send_to_server(msg);

                  if (scope.update) {
                    let msg = new Mensagem('atualiza_entregas', scope.update, 'entregas_atualizadas', this);
                    SIOM.send_to_server(msg);
                    let msg2 = new Mensagem('atualiza_rodizios', scope.updateEntradasESaidas, 'entradas_atualizadas', this);
                    SIOM.send_to_server(msg2);
                  }

                  scope.rodizioselecionado = [];

                } else {
                  let msg = new Mensagem('cadastra_rodizio', scope.novoRodizio, 'rodizio_cadastrado', this);
                  SIOM.send_to_server(msg);
                }

                for (let participanteAdicionado in scope.participantesAdicionados) {
                  scope.participantes.push(scope.participantesAdicionados[participanteAdicionado]);
                }

                scope.novoRodizio = novoRodizio();

                scope.participantesAdicionados = [];

                $mdDialog.hide();

              } else {
                $mdToast.showSimple('Por favor, informe um padrão');
              }
            } else {
              $mdToast.showSimple('Por favor, informe um nome');
            }

          }

        };

        scope.remove = () => {

          let dado_update = {
            id: scope.rodizioselecionado.id,
            update: {
              ativo: false
            }
          };

          let msg = new Mensagem(
            'atualiza_rodizios',
            dado_update,
            'rodizio_removido',
            this
          );

          SIOM.send_to_server(msg);
          scope.rodizioselecionado = [];
          $mdDialog.hide();

        };

        scope.entradasESaidas = () => {
          if(scope.participantesAdicionados.length !== 0){
            $mdDialog.show({
              escapeToClose: false,
              contentElement: '#dialogoEntradasESaidas',
              parent: angular.element(document.body),
              multiple: true
            });
          } else {
            $mdToast.showSimple('Você deve selecionar ao menos um participante')
          }

        };

        scope.$on('jaEntregou_atualizado', function(event, args) {

          let retornaParticipantes = () => {
            let participantes = [];
            for(let i=3; i < args.dado_update.length; i++){
              participantes.push(args.dado_update[i]);
            }
            return participantes;
          };

          if (scope.rodizioselecionado) {
            scope.update = {
              id: scope.rodizioselecionado.id,
              update: {
                participantes: retornaParticipantes()
              }
            };

            scope.updateEntradasESaidas = {
              id: scope.rodizioselecionado.id,
              update: {
                entradas: args.dado_update[0],
                saidas: args.dado_update[1],
                rodada: args.dado_update[2]
              }
            };

          }
        });

        scope.adicionaParticipanteAoRodizio = (participante_ret, index) => {
          scope.participantesAdicionados.push({participante: participante_ret});
          scope.participantes.splice(index, 1);
        };

        scope.removeParticipanteDoRodizio = (
          participanteAdicionado_ret,
          index) => {
          scope.participantes.push(participanteAdicionado_ret);
          scope.participantesAdicionados.splice(index, 1);
        };

      },
    };
  }]);
