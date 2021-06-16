function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
	
	log.info( "### REPLICA CADASTROS ###");

	var dataset = DatasetBuilder.newDataset();
	
	dataset.addColumn( "registros" );

	var qtdReg = 0;

	var datasetDe = 'equipamento';
	var tablesFilhos = ['tipo_teste'];
	var parentDocumentId = '5293';
	
	var empresaId = "1";
	var user = "";
	var senha = "";	
	var comments = "Documento criado via dataset.";

	var dataset = DatasetBuilder.newDataset();
	
	var ECMCardServiceProvider = ServiceManager.getServiceInstance("ECMCardServicePRD");	
	var ECMCardServiceServiceLocator = ECMCardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.ECMCardServiceServiceLocator");	
	var ECMCardServiceService = ECMCardServiceServiceLocator.getCardServicePort();	
	var cardDtoArray = ECMCardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.CardDtoArray");	
	var cardDto = ECMCardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.CardDto");
	
	cardDto.setParentDocumentId( parseInt(parentDocumentId) );
	cardDto.setAdditionalComments( comments );

	var dsDe = DatasetFactory.getDataset(datasetDe, null, null, null);
	
	console.log('### QUANTIDADE REGISTROS...' + dsDe.rowsCount);
	
	for (var x = 0; x < dsDe.rowsCount; x++) {
		
		var vetCardFields = new Array();

		var documentId      = dsDe.getValue(x, "metadata#id");
		var documentVersion = dsDe.getValue(x, "metadata#version");
		log.info('documentId...' + documentId);
		log.info('documentVersion...' + documentVersion);

		for (var i = 0; i < dsDe.getColumnsCount(); i++) {
			log.info('linha...' + dsDe.getColumnName(i) + ' | ' + dsDe.getValue(x, dsDe.getColumnName(i)));
			 var CardFieldDto = ECMCardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
			 CardFieldDto.setField( dsDe.getColumnName(i) );
			 CardFieldDto.setValue( dsDe.getValue(x, dsDe.getColumnName(i)) );
			 vetCardFields.push( CardFieldDto );
	
		}

		//BUSCAR TABLES FILHOS DO BANCO
		log.info('tablesFilhos...' + tablesFilhos.length);
		if (tablesFilhos.length > 0){
			
			for (var j = 0; j < tablesFilhos.length; j++) {

				log.info('Tables filho...' + tablesFilhos[j]);

				var constraintsFilhos = new Array();
				constraintsFilhos.push(DatasetFactory.createConstraint("tablename", tablesFilhos[j] ,tablesFilhos[j], ConstraintType.MUST));
				constraintsFilhos.push(DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST));
				constraintsFilhos.push(DatasetFactory.createConstraint("metadata#version", documentVersion, documentVersion, ConstraintType.MUST));

				var dsDeFilhos = DatasetFactory.getDataset(datasetDe, null, constraintsFilhos, null);

				for (var k = 0; k < dsDeFilhos.rowsCount; k++) {
					// log.info('entrou rows filho')
					var seq = k + 1;
					for (var l = 0; l < dsDeFilhos.getColumnsCount(); l++) {					
						log.info('linha...' + dsDeFilhos.getColumnName(l) + '___' + seq + ' | ' + dsDeFilhos.getValue(k, dsDeFilhos.getColumnName(l)));
						 var CardFieldDto = ECMCardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
						 CardFieldDto.setField( dsDeFilhos.getColumnName(l) + '___' + seq );
						 CardFieldDto.setValue( dsDeFilhos.getValue(k, dsDeFilhos.getColumnName(l)) );
						 vetCardFields.push( CardFieldDto );				
					}
					
				}

			}
			
		}		

		log.info('### Publicou ###');

		 cardDto.setCardData( vetCardFields );
		 var vetCardDto = new Array();
		 vetCardDto.push( cardDto );
		 cardDtoArray.setItem( vetCardDto );		
	
		 try{
			
		 	log.info('empresa...'+parseInt(empresaId));
		 	log.info('user...'+ user);
		 	log.info('senha...'+ senha);
			
		 	var Retorno = ECMCardServiceService.create(	parseInt(empresaId),
		 												user, 	
		 												senha,
		 												cardDtoArray );
		 	var result = new Array();
	
		 	result.push(Retorno.getItem(0).getDocumentId());
		 	result.push(Retorno.getItem(0).getDocumentDescription());
		 	result.push(Retorno.getItem(0).getWebServiceMessage());
					
		 	dataset.addColumn( "documentId" );
		 	dataset.addColumn( "documentDescription" );
		 	dataset.addColumn( "status" );
							
		 	dataset.addRow( result );
//			qtdReg++
	
		 }catch( e ){
		 	log.info( e.toString() );
			
		 }	
		
	}

	dataset.addRow( new Array( String(qtdReg) ) );

	return dataset;
	
}

function onMobileSync(user) {

}	
