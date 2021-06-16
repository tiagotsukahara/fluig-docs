function defineStructure() {}
function onSync(lastSyncDate) {}

function createDataset(fields, constraints, sortFields) {

	var datasetReturn = DatasetBuilder.newDataset();
	
	datasetReturn.addColumn( "result" );
	
	try{

		var numDocum = '';
		
		if (constraints != null) {			
	        for (var i = 0; i < constraints.length; i++) {
	    		if ( constraints[i].fieldName == 'documentID' ){
	    			numDocum = parseInt( constraints[i].initialValue );
	    			log.info('Entrei documentID........... '+constraints[i].initialValue );
	    		}
	        }
		}
		
	    datasetReturn.addRow( new Array( fluigAPI.getDocumentService().getActive( numDocum )  ) );
        
 	}catch( e ){
 		log.error( e );
		datasetReturn.addRow( new Array( 'NOK' ) );
	}
	return datasetReturn;
		
}

function onMobileSync(user) {}