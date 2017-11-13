/**
 * Created by Lab on 01/05/2017.
 */
app.directive('dialogoadicionaparticipante', [
  '$mdDialog', '$mdToast',
  function($mdDialog, $mdToast) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        participantes: '=',
        participanteselecionado: '=',
        editando: '='
      },
      templateUrl: '../../../views/home_gerencia/dialogoAdicionaParticipante/' +
      'dialogoAdicionaParticipante.html',

      link: function(scope, element, attribute) {

        let novoParticipante = () => {

          if(scope.editando){
            scope.addOuEdit = 'Editar';
            if(scope.participanteselecionado.sobrenome){
              return {
                nome: scope.participanteselecionado.nome,
                sobrenome: scope.participanteselecionado.sobrenome,
                email: scope.participanteselecionado.email,
                numerocelular: scope.participanteselecionado.numerocelular,
              }
            } else {
              return {
                nome: scope.participanteselecionado.nome,
                email: scope.participanteselecionado.email,
                numerocelular: scope.participanteselecionado.numerocelular
              }
            }

          } else {
            scope.addOuEdit = 'Adicionar';
            return {
              nome: '',
              sobrenome: '',
              email: '',
              numerocelular: ''
            };
          }
        };

        scope.$watch('participanteselecionado', () => {
          scope.novoParticipante = novoParticipante();
        });

        scope.novoParticipante = novoParticipante();

        scope.fechaDialogo = () => {
          if(scope.editando){
            scope.participanteselecionado = [];
          }
          $mdDialog.hide();
        };

        scope.envia = () => {

          if(scope.formAdicionaParticipante.inputEmail.$valid){

            for(let participante in scope.participantes){
              if(scope.participantes[participante].email === scope.novoParticipante.email){
                $mdToast.showSimple('E-mail já cadastrado');
                return;
              } else if(scope.participantes[participante].numerocelular === scope.novoParticipante.numerocelular){
                $mdToast.showSimple('Telefone já cadastrado');
                return;
              }
            }

            if(scope.novoParticipante.nome && scope.novoParticipante.email &&
              scope.novoParticipante.numerocelular){

              if(scope.editando){
                let dado_update = {
                  id: scope.participanteselecionado.id,
                  update: scope.novoParticipante,
                };
                let msg = new Mensagem('atualiza_participante', dado_update, 'participante_atualizado', this);
                SIOM.send_to_server(msg);
                scope.participanteselecionado = [];
              } else {
                let msg = new Mensagem('cadastra_participante', scope.novoParticipante, 'participante_cadastrado', this);
                SIOM.send_to_server(msg);
              }

              scope.novoParticipante = novoParticipante();
              $mdDialog.hide();

            } else if(scope.novoParticipante.nome.length === 0){
              $mdToast.showSimple('Por favor, informe um nome');
            } else if(scope.novoParticipante.email.length === 0){
              $mdToast.showSimple('Por favor, informe um e-mail');
            } else if(scope.novoParticipante.numerocelular.length === 0){
              $mdToast.showSimple('Por favor, informe um telefone');
            }

          }

        };

        scope.remove = () => {

          let dado_update = {
            id: scope.participanteselecionado.id,
            update: {
              ativo: false
            }
          };

          let msg = new Mensagem('atualiza_participante', dado_update, 'participante_removido', this);
          SIOM.send_to_server(msg);

          scope.participanteselecionado = [];
          scope.novoParticipante = novoParticipante();
          $mdDialog.hide();
        };

      },
    };
  }]);
