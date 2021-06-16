function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
	
	log.info( "### PROCESSO MOVIMENTO ###");

	var choosedState = '';
	var numProcesso = "";
	var userId = "admlog";
	var documentId = "";
	var parentDocumentId = "";
	var completeTask = true; 
	var managerMode = true;
	var assumir = false;
	var iniciarProcesso = '';
	var anexos = '';
	
//	log.info( "passo 0001 ");
	
	log.info(constraints.length);
	
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
    		if ( constraints[i].fieldName == 'atividade' ){
    			choosedState = constraints[i].initialValue;
    			log.info('Entrei atividade........... '+constraints[i].initialValue );
    		}
    		if ( constraints[i].fieldName == 'processo' ){
    			numProcesso = constraints[i].initialValue;
    			log.info('Entrei processo........... '+constraints[i].initialValue );
    		}
    		if ( constraints[i].fieldName == 'usuario' ){
    			userId = constraints[i].initialValue;
    			log.info('Entrei usuario........... '+constraints[i].initialValue );
			}
			if ( constraints[i].fieldName == 'parentDocumentId' ){
    			parentDocumentId = constraints[i].initialValue;
    			log.info('Entrei parentDocumentId........... '+constraints[i].initialValue );
    		}
    		if ( constraints[i].fieldName == 'documentId' ){
    			documentId = constraints[i].initialValue;
    			log.info('Entrei documentId........... '+constraints[i].initialValue );
    		}
    		if ( constraints[i].fieldName == 'managerMode' ){
    			managerMode = constraints[i].initialValue;
    			log.info('Entrei managerMode........... '+constraints[i].initialValue );
    		}
    		if ( constraints[i].fieldName == 'assumir' ){
    			assumir = constraints[i].initialValue;
    			log.info('Entrei assumir........... '+constraints[i].initialValue );
    		}
    		if ( constraints[i].fieldName == 'iniciarProcesso' ){
    			iniciarProcesso = constraints[i].initialValue;
    			log.info('Entrei iniciarProcesso........... '+constraints[i].initialValue );
    		}
    		if ( constraints[i].fieldName == 'anexos' ){
    			anexos = constraints[i].initialValue;
    			log.info('Entrei assumir........... '+constraints[i].initialValue );
    		}
    		
    		
        }
	}
	
//	log.info( "passo 0002 ");
	var dataset = DatasetBuilder.newDataset();
	
	dataset.addColumn( "atividade" );	
	
	var empresaId = "1";
	var user = "admlog";
	var senha = "";	
	var comments = "Processo movimentado via dataset.";   		  			    														
	var threadSequence = "0";

	if( (documentId == "" || documentId == undefined || documentId == null) && 
		(parentDocumentId != "" && parentDocumentId != undefined && parentDocumentId != null) ){
		
		log.info( "### createCardData ###");

		var dataset = DatasetBuilder.newDataset();
		
		var ECMCardServiceProvider = ServiceManager.getServiceInstance("ECMCardServiceAxis");
		// log.info( 'P........ 2.......' );
		var ECMCardServiceServiceLocator = ECMCardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.ECMCardServiceServiceLocator");
		// log.info( 'P........ 3.......' );
		var ECMCardServiceService = ECMCardServiceServiceLocator.getCardServicePort();
		// log.info( 'P........ 5.......' );		
		var cardDtoArray = ECMCardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.CardDtoArray");
		// log.info( 'P........ 6.......' );		
		var CardFieldDtoArray = ECMCardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDtoArray");
		// log.info( 'P........ 7.......' );
		var cardDto = ECMCardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.CardDto");
//		log.info( 'P........ 8.......' );
//		var attachment = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.Attachment");
//		var relatedDocument = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.RelatedDocumentDto");
//		var documentSecurity = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.DocumentSecurityConfigDto");
//		var approver = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.ApproverDto");
//		
//		cardDto.getAttachs().add(attachment);
//		cardDto.getReldocs().add(relatedDocument);
//		cardDto.getDocsecurity().add(documentSecurity);
//		cardDto.getDocapprovers().add(approver);
		
		cardDto.setParentDocumentId( parseInt(parentDocumentId) );
		cardDto.setAdditionalComments( comments );
		cardDto.setInheritSecurity(true);
		// cardDto.setDocumentDescription( description );

		// ADICIONA O REGISTRO NO ARRAY DO REGISTRO DE FORMULARIO
		log.info( 'Antes cData' );
		
		var vetCardFields = new Array();

		if (constraints != null) {			
			for (var i = 0; i < constraints.length; i++) {
				if ( constraints[i].finalValue == 'field' ){
					log.info('cData - '+constraints[i].fieldName+' | '+constraints[i].initialValue);
		    		var CardFieldDto = ECMCardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
		    		CardFieldDto.setField( constraints[i].fieldName );
		    		CardFieldDto.setValue( constraints[i].initialValue );
					// cardDto.getCardData().add(CardFieldDto);
					vetCardFields.push( CardFieldDto );
				}
			}
		}
		// cardDtoArray.getItem().add(cardDto);
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
			

		}catch( e ){
	 		log.info( e.toString() );
			dataset.addRow( new Array( '-1' ) );
		}
	}
	
	if( documentId != "" && documentId != undefined && documentId != null ){
		
		log.info( "### updateCardData ###");
		
		var ECMCardServiceProvider = ServiceManager.getServiceInstance("ECMCardService");
//		log.info( 'P........ 2.......' );
		var ECMCardServiceServiceLocator = ECMCardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.ECMCardServiceService");
//		log.info( 'P........ 3.......' );
		var ECMCardServiceService = ECMCardServiceServiceLocator.getCardServicePort();
//		log.info( 'P........ 4.......' );
		var CardFieldDtoArray = ECMCardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDtoArray");
//		log.info( 'P........ 5.......' );
		var CardFieldDto = ECMCardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
		log.info( 'P........ 6.......' );
		CardFieldDto.setField('tipo_ocor');
		log.info( 'P........ 7.......' );
		CardFieldDto.setValue('010');
		log.info( 'P........ 8.......' );
		CardFieldDtoArray.getItem().add(CardFieldDto);
		log.info( 'Antes cData' );
		
		if (constraints != null) {			
			for (var i = 0; i < constraints.length; i++) {
				if ( constraints[i].finalValue == 'field' ){
					log.info('cData - '+constraints[i].fieldName+' | '+constraints[i].initialValue);
		    		var CardFieldDto = ECMCardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
		    		CardFieldDto.setField( constraints[i].fieldName );
		    		CardFieldDto.setValue( constraints[i].initialValue );
		    		
		    		CardFieldDtoArray.getItem().add( CardFieldDto );
				}
			}
		}

		try{
			
			log.info('empresa...'+parseInt(empresaId));
			log.info('user...'+ user);
			log.info('senha...'+ senha);
			log.info('documentId...'+ parseInt(documentId));
			
			var retorno = ECMCardServiceService.updateCardData(parseInt(empresaId),
												 user, 	
												 senha,
												 parseInt(documentId),
												 CardFieldDtoArray );
		}catch( e ){
	 		log.info( e.toString() );
			dataset.addRow( new Array( '-1' ) );
		}
	}

	if( numProcesso != "" && numProcesso != undefined && numProcesso != null && iniciarProcesso == "S"){
		
		log.info( "### startProcess ###");

		var workflowEngineServiceProvider = ServiceManager.getServiceInstance("WorkflowEngineService");
		var workflowEngineServiceLocator = workflowEngineServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService");
		var workflowEngineService = workflowEngineServiceLocator.getWorkflowEngineServicePort();		
		var colleagues = workflowEngineServiceProvider.instantiate("net.java.dev.jaxb.array.StringArray");
		var CardFieldDtoArray = workflowEngineServiceProvider.instantiate("net.java.dev.jaxb.array.StringArrayArray");
	
		var parametros = {};
				
		if (constraints != null) {			
			for (var i = 0; i < constraints.length; i++) {				
				if( constraints[i].finalValue == 'colleagues' ){
					log.info('colleagues - '+constraints[i].fieldName + ' | ' + constraints[i].initialValue );
					colleagues.getItem().add( constraints[i].initialValue );
				}else{
			       	parametros[ constraints[i].fieldName ] = constraints[i].initialValue; 
			    }
			}
		}

		if (constraints != null) {			
			for (var i = 0; i < constraints.length; i++) {
				if ( constraints[i].finalValue == 'field' ){
					log.info('cData - '+constraints[i].fieldName+' | '+constraints[i].initialValue);
					var CardFieldDto = workflowEngineServiceProvider.instantiate("net.java.dev.jaxb.array.StringArray");
		    		CardFieldDto.getItem().add( constraints[i].fieldName );
		    		CardFieldDto.getItem().add( constraints[i].initialValue );
		    		CardFieldDtoArray.getItem().add( CardFieldDto );
				}
			}
		}
		
		var processAttachmentDtoArray = workflowEngineServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDtoArray");
		var ProcessTaskAppointmentDto = workflowEngineServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessTaskAppointmentDtoArray");

		try{
			log.info('user...'+ user);
			log.info('senha...'+ senha);
			log.info('empresa...'+parseInt(empresaId));
			log.info('numProcesso...'+ numProcesso);
			log.info('choosedState...'+ parseInt(choosedState));			
			log.info('userId...'+ userId);			
			log.info('completeTask...'+ completeTask);
			log.info('managerMode...'+ ( managerMode == true ));

			var Retorno = workflowEngineService.startProcess(	user, 	
																senha, 
																parseInt(empresaId), 
																numProcesso,
																parseInt(choosedState),
																colleagues,									    
																comments,
																userId,
																completeTask,
																processAttachmentDtoArray,
																CardFieldDtoArray,
																ProcessTaskAppointmentDto,
																( managerMode == true ) );
		    
		}catch( e ){
			log.info( e.toString() );
			dataset.addRow( new Array( '-1' ) );
		}
	}

	if( numProcesso != "" && numProcesso != undefined && numProcesso != null && iniciarProcesso != 'S'
	 && choosedState != "" && choosedState != undefined && choosedState != null){
		
		log.info( "### saveAndSendTask ###");

		var workflowEngineServiceProvider = ServiceManager.getServiceInstance("WorkflowEngineService");
		var workflowEngineServiceLocator = workflowEngineServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService");
		var workflowEngineService = workflowEngineServiceLocator.getWorkflowEngineServicePort();
		
		var colleagues = workflowEngineServiceProvider.instantiate("net.java.dev.jaxb.array.StringArray");
		//colleagues.getItem().add("Pool:Role:POOL_ALMOXARIFADO_5.7");
		
		var objectFactory  = workflowEngineServiceProvider.instantiate("net.java.dev.jaxb.array.ObjectFactory");     
	
		var parametros = {};
		var cardData = objectFactory.createStringArrayArray();
				
		if (constraints != null) {			
			for (var i = 0; i < constraints.length; i++) {				
				if( constraints[i].finalValue == 'colleagues' ){
					log.info('colleagues - '+constraints[i].fieldName + ' | ' + constraints[i].initialValue );
					colleagues.getItem().add( constraints[i].initialValue );
				}else{
			       	parametros[ constraints[i].fieldName ] = constraints[i].initialValue; 
			    }
			}
		}		
		
//		var cardData = objectFactory.createStringArrayArray();
		var processAttachmentDtoArray = workflowEngineServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDtoArray");
		var ProcessTaskAppointmentDto = workflowEngineServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessTaskAppointmentDtoArray");
		
		if( assumir == 'true' ){
			
			log.info('entrei assumir............ ');
			try{				
				log.info('user...'+ user);
				log.info('senha...'+ senha);
				log.info('empresa...'+parseInt(empresaId));
				log.info('userId...'+ userId);
				log.info('numProcesso...'+ parseInt(numProcesso));
				log.info('threadSequence...'+ parseInt(threadSequence));
				
				var Retorno = workflowEngineService.takeProcessTask(user,
																	senha, 
																	parseInt(empresaId), 
																	userId,	
																	parseInt(numProcesso),
																	parseInt(threadSequence));
			}catch( e ){
				log.info('ERRO assumir ');
				log.info( e.toString() );
			}
			
			log.info('Depois assumir ');
		}
		
		try{
			log.info('user...'+ user);
			log.info('senha...'+ senha);
			log.info('empresa...'+parseInt(empresaId));
			log.info('numProcesso...'+ parseInt(numProcesso));
			log.info('choosedState...'+ parseInt(choosedState));			
			log.info('userId...'+ userId);			
			log.info('completeTask...'+ completeTask);
			log.info('managerMode...'+ ( managerMode == 'true' ));
			log.info('threadSequence...'+ parseInt(threadSequence));
			
			var Retorno = workflowEngineService.saveAndSendTask(user, 	
																senha, 
									   					 		parseInt(empresaId), 
									   					 		parseInt(numProcesso),
									   					 		parseInt(choosedState),
									   					 		colleagues,
									   					 		comments,
									   					 		userId,
									   					 		completeTask,
									   					 		processAttachmentDtoArray,
									   					 		cardData,
									   					 		ProcessTaskAppointmentDto,
									   					 		( managerMode == 'true' ),
									   					 		parseInt(threadSequence) );	
			
			//Retorno.getItem().get(1).getItem().get(1);	 	               	 
	     
			//log.info( Retorno );
		 
			var iTask = '0';
			for( var x = 0; x < Retorno.getItem().size() ; x++ ){
				log.info( " retorno "+	Retorno.getItem().get(x).getItem().get(0) +" - "+Retorno.getItem().get(x).getItem().get(1) )   ;
				if( Retorno.getItem().get(x).getItem().get(0) == 'iTask' ){
					iTask = Retorno.getItem().get(x).getItem().get(1);
				}
			}
			
			dataset.addRow( new Array( iTask ) );
		    
		}catch( e ){
			log.info( e.toString() );
			dataset.addRow( new Array( '-1' ) );
		}
	}
	
//	if( anexos != "" ){
//		try{
//			
//			log.info('DEPOIS movimento ');
//		
//			log.info( 'Anexos.....'+anexos );
//			var aAnexos = anexos.split(';');
//		    for (var j = 0; j < aAnexos.length; j++) {
//		    	log.info( 'Anexos.....'+aAnexos[j]+' '+aAnexos );
//		    	var sql = " INSERT INTO anexo_proces( "+
//					    "			NUM_SEQ_ANEXO, "+
//					    "			COD_EMPRESA, NUM_PROCES, DT_ANEXO, CD_MATRICULA, "+
//					    "			NR_DOCUMENTO, NUM_SEQ_MOVTO_ORIG,  NUM_SEQ_THREAD_ORIG, "+
//					    "			NR_VERSAO "+
//					    "	)   "+
//					    "	SELECT MAX( a.NUM_SEQ_ANEXO ) + 1 AS NUM_SEQ_ANEXO, "+
//					    "			a.COD_EMPRESA, a.NUM_PROCES, NOW() AS DT_ANEXO, b.CD_MATRICULA, "+
//					    "			b.NR_DOCUMENTO, 1 as NUM_SEQ_MOVTO_ORIG,  1 AS NUM_SEQ_THREAD_ORIG, "+
//					    "			b.NR_VERSAO AS NR_VERSAO "+
//					    "	  FROM anexo_proces a "+
//					    "	  JOIN documento b ON (a.cod_Empresa = b.cod_Empresa) "+
//					    "	  WHERE a.cod_Empresa = 1  "+
//					    "	    AND a.num_proces = "+ numProcesso +" "+
//					    "	    AND b.NR_DOCUMENTO = "+ aAnexos[j] +" "+
//					    "	    AND b.VERSAO_ATIVA = 1 "+
//					    "	GROUP BY a.COD_EMPRESA, a.NUM_PROCES, b.CD_MATRICULA, "+
//					    "			b.NR_DOCUMENTO, b.NR_VERSAO ";
//		    	
//				log.info( '$001... ' );
//				contextWD = new javax.naming.InitialContext();
//				log.info( '$002... ' );
//				dataSourceWD = contextWD.lookup( "java:/jdbc/FluigDS" );
//				log.info( '$003... ' );
//				connectionWD = dataSourceWD.getConnection();
//				log.info( '$004... ' );
//				
//				log.info( '$005... '+sql );
//				statementWD = connectionWD.prepareStatement(sql);
//				statementWD.executeUpdate();
//				statementWD.close();
//		
//		    }
//			
//		    log.info('DEPOIS anexos ');
//
//		}catch( e ){
//			log.info( e.toString() );
//			dataset.addRow( new Array( '-1' ) );
//		}
//		finally {
//			log.info('##### 6 #####');
//			if(statementWD != null) statementWD.close();
//		    if(connectionWD != null) connectionWD.close();
//		}
//	}
 	
	return dataset;
}

function onMobileSync(user) {

}	
