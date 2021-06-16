function defineStructure() {

}
function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {

	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn('FOLDER');
	
	var listaConstraits = {};
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
        	listaConstraits[constraints[i].fieldName] = constraints[i].initialValue;
        }
    }
	
	try{

		//Instancia um novo documento e define as propriedades básicas
    	var dto = docAPI.newDocumentDto();
        dto.setDocumentDescription( listaConstraits['FOLDER_NAME'] );
        dto.setAdditionalComments('');
        dto.setDocumentType(1);
        dto.setParentDocumentId(parseInt( listaConstraits['PARENT_FOLDER_CODE'] ));
        dto.setInheritSecurity( true );
        dto.setDownloadEnabled( true );
    
        var dtosSecurity = new Array();
        
        if( listaConstraits['GROUP_HIDDEN'] != undefined 
         && listaConstraits['GROUP_HIDDEN'] != null
         && listaConstraits['GROUP_HIDDEN'] != '' ){
	            
	        var dtoGroupRestrictionSecurity = docAPI.newDocumentSecurityConfigDto();
	        dtoGroupRestrictionSecurity.setAttributionType(2);
	        dtoGroupRestrictionSecurity.setAttributionValue('comercial_hydrowheel_externo');
	        dtoGroupRestrictionSecurity.setPermission(false);
	        dtoGroupRestrictionSecurity.setShowContent(true);
	        dtoGroupRestrictionSecurity.setDownloadEnabled(true);
	        dtoGroupRestrictionSecurity.setSecurityLevel(0); 	
	 
	        dtosSecurity.push(dtoGroupRestrictionSecurity);
        }
        
        var FOLDER = docAPI.createFolder(dto, dtosSecurity, null);
        log.info("Folder successfully createad: ID :" + FOLDER.getDocumentId());
        
        newDataset.addRow( new Array( FOLDER.getDocumentId() ) );
		
	} catch (e){
		log.info( "ERROOOOOO"+ e.getMessage() );
		newDataset.addRow( new Array( ( new Date() ).toString(), 'ERRO', e.getMessage() ) );
	} finally {
		
	}

	return newDataset;
	
}

function onMobileSync(user) {

}