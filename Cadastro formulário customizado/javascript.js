function novoCadastro(){

	//Utiliza dataset document interno e processo_movimento customizado
	//Para mensagem em tela usa função toast do utils
	
	var datasetName = 'cadastro_infracao_transito';

	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint( 'datasetName', datasetName, datasetName, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'activeVersion', true, true, ConstraintType.MUST) );
	var dataset = DatasetFactory.getDataset( 'document', null, constraints, null);
	console.log(dataset);

	if ( dataset != null && dataset != undefined){
		if (dataset.values.length > 0 ){
			retorno = dataset.values[0];

			// var formLink = WCMAPI.getServerURL() + '/webdesk/streamcontrol/'+ retorno['parentDocumentId'] +'/'+ selected.documentid +'/' +retorno['version']+ '/'; editar
			WCMAPI = parent.WCMAPI;

			var formLink = WCMAPI.getServerURL() + '/webdesk/streamcontrol/'+ retorno['documentPK.documentId'] +'/0/0/';
			var html = '<iframe style="border: 0px; " src="' + formLink + '" id="iFrameDoc" class="iFrameDoc"></iframe> ';
			
			console.log('HTML......',html);	

			var modalDocumentEdit = FLUIGC.modal({
				title: 'Novo Registro',
				content: html,
				id: 'documentEdit',
				size : 'full',
				actions: [{
					'label' : 'Confirmar',
					'bind' : 'data-open-modal',
					'classType' : 'btn-success confirmar'
				},{
					'label': 'Fechar',
					'autoClose': true
				}]
			}, function(err, data) {
				if(err) {
					
				} else {
					
				}
			});

			$('#iFrameDoc').on('load', function() {

				// Enquadramento de tela
				var modalWidth = $('#documentEdit .modal-body').width();
				$('#iFrameDoc').css("width", modalWidth + "px");
				modalWidth = $('#iFrameDoc').contents().find('html').width() - 8;
				$('#iFrameDoc').contents().find('html').css('width', modalWidth + "px");
				var screenHeight = $('#iFrameDoc').contents().find('form').height();
				if (screenHeight < 300){
					screenHeight = 300;
				}
				$('#iFrameDoc').css("height", screenHeight + "px");
				$('#iFrameDoc').contents().find('#printBt').hide();	

				$('.confirmar').click(function() {
					console.log('confirmar');

					var constraintsEntrada = new Array();
									
					$('#iFrameDoc').contents().find("input,select,textarea").each(function () {
						// if ( $(this).val() != '' ){
							// console.log('looop  ',$(this).attr( 'name' ), $(this).val(), $(this).attr( 'type' ) );
							if ( $(this).attr( 'type' ) == 'radio' && $(this).is(':checked')){
								constraintsEntrada.push( DatasetFactory.createConstraint( $(this).attr( 'name' ), $(this).val(), 'field', ConstraintType.MUST ) );
							}							
							if ( $(this).attr( 'type' ) != 'radio'){
								constraintsEntrada.push( DatasetFactory.createConstraint( $(this).attr( 'name' ), $(this).val(), 'field', ConstraintType.MUST ) );
							}
						// }
					});
						
					// Editar Documento
					// constraintsEntrada.push( DatasetFactory.createConstraint( 'documentId', selected.documentid, null, ConstraintType.MUST) );

					// Se for Iniciar Processo
					// constraintsEntrada.push( DatasetFactory.createConstraint( 'processo', 'Chamado', null, ConstraintType.MUST) );
					// constraintsEntrada.push( DatasetFactory.createConstraint( 'atividade', '9', null, ConstraintType.MUST) );
					// constraintsEntrada.push( DatasetFactory.createConstraint( 'iniciarProcesso', 'S', null, ConstraintType.MUST) );

					// Se for criar um documento
					constraintsEntrada.push( DatasetFactory.createConstraint( 'parentDocumentId', retorno['documentPK.documentId'], null, ConstraintType.MUST) );
					
					var dataset = DatasetFactory.getDataset( 'processo_movimento', null, constraintsEntrada, null);
					
					console.log(dataset);
					
					if (dataset != undefined && dataset != null) {
						if (dataset.values.length > 0 ){
							// console.log(dataset);
							if (dataset.values[0]["status"] == 'ok') {
								toast('Formulário :' + dataset.values[0]['documentId'] +' criado com sucesso!', 'success');
								// Exemplo atribuição de campo
								// $('#cod_infracao').val( $('#iFrameDoc').contents().find("#cod_infracao") );
								modalDocumentEdit.remove();
							} else {
								toast('Erro ao salvar formulário: ' + dataset.values[0]["status"], 'danger');
							}
												
						}
					}

				});

			});
		}
		
	}
		
  }