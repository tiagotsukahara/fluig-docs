function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
	
	log.info('Start cancelaProcesso ');
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn( "status" );
	
	try {
		var workflowEngineServiceProvider = ServiceManager.getServiceInstance("WorkflowEngineService");
	    var workflowServiceLocator = workflowEngineServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService");
	    var workflowService = workflowServiceLocator.getWorkflowEngineServicePort();
	
	    var userAdm = "";
	    var passAdm = ""
	    var companyId = '1';
	    var processId = '';
	    var cancelText = '';
	    
	    if (constraints != null) {			
	        for (var i = 0; i < constraints.length; i++) {
	    		if ( constraints[i].fieldName == 'processId' ){
	    			processId = constraints[i].initialValue;
	    			log.info('Entrei processId........... '+constraints[i].initialValue );
	    		}
	    		if ( constraints[i].fieldName == 'cancelText' ){
	    			cancelText = constraints[i].initialValue;
	    			log.info('Entrei cancelText........... '+constraints[i].initialValue );
	    		}    		
	        }
		}
	    
	    var cancelamentoProcesso = workflowService.cancelInstance(userAdm, passAdm, companyId, processId, userAdm, cancelText);
	
	    if (cancelamentoProcesso.equals("OK")) {
	    	dataset.addRow(new Array( 'OK' ) );
	    }
	    
	}catch( e ){
 		log.error( e.toString() );
 		dataset.addRow(new Array( 'Erro ' + e.toString() ) );
	} 	
 	
	return dataset;
}

function onMobileSync(user) {

}