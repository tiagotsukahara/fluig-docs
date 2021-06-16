function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {

	log.info('## Move Documentos ##');
	
	var dsRetorno = DatasetBuilder.newDataset();
 	dsRetorno.addColumn("status");
 	
	var listaConstraits = {};
	
	var usuario = "";
	var senha = "";
	var matricula = "";
	
	listaConstraits['documentos'] = '';
	listaConstraits['pasta'] = '';
	
	if (constraints != null) {
		for (var i = 0; i < constraints.length; i++) {
			listaConstraits[ constraints[i].fieldName.trim() ] = constraints[i].initialValue;
			log.info('fieldName.....'+constraints[i].fieldName+'...value....'+constraints[i].initialValue);
		}
	}
	
	try {

		var stub = ServiceManager.getServiceInstance("ECMDocumentService");
		var helper = stub.getBean();
		var service = helper.instantiate("com.totvs.technology.ecm.dm.ws.ECMDocumentServiceService");
		var servico = service.getDocumentServicePort();	
		var documentosArray = helper.instantiate("net.java.dev.jaxb.array.IntArray");
	
		var docArray = listaConstraits['documentos'].split(',');
	
		for (var i = 0; i < docArray.length; i++) {
		    var idDocumento = new java.lang.Integer( docArray[i] );
		    documentosArray.getItem().add(idDocumento);
		}
	
		var retorno = servico.moveDocument(usuario, senha, getValue("WKCompany"), documentosArray, matricula, listaConstraits['pasta']);
		
		dsRetorno.addRow(new Array('OK'));
	
	} catch(e){
	    log.info(e);
	    dsRetorno.addRow(new Array(e));
	}
	
	return dsRetorno;
}
function onMobileSync(user) {

}