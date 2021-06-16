var $this = null;
var user_code = null;
var loadWindow = null;

var MyWidget = SuperWidget.extend({
    //variáveis da widget
    variavelNumerica: null,
    variavelCaracter: null,

    //método iniciado quando a widget é carregada
    init: function() {
        $this = this;        
        //Carrega Título da página
        $('#page_title').html(WCMAPI.getPageTitle());
        //Carrega usuário logado
        user_code = WCMAPI.getUserCode();
        //Load do fluig
        loadWindow = FLUIGC.loading(window);
        //Mostra o load
        // loadWindow.show();

        // verifica se está em modo de edição
        if (!this.isEditMode) {
            //PopUp da versão
            FLUIGC.popover('.bs-docs-popover-hover',{ trigger: 'hover', placement: 'left', html: true, content: 'Versão: 05/02/2021 15:31<br>Técnico: Tiago Tsukahara'});

        }

    },
  
    //BIND de eventos
    bindings: {
        local: {
            'execute': ['click_executeAction']
        },
        global: {}
    },
 
    executeAction: function(htmlElement, event) {
    }

});