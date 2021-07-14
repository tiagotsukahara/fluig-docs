function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {

    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn( 'name' );
    newDataset.addColumn( 'deal_id' );
	var params = {};
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
        	if( constraints[i].fieldName.trim() == "area" ){
        		area = constraints[i].initialValue;
        	}else if( constraints[i].fieldName.trim() == "deal_id" ){
        		params[ constraints[i].fieldName.trim() ] = new org.apache.http.entity.mime.content.StringBody( constraints[i].initialValue );
        	}else {
				params[ constraints[i].fieldName.trim() ] = new org.apache.http.entity.mime.content.FileBody( getFile(constraints[i].initialValue ) );
	       		log.info('fieldName.....'+constraints[i].fieldName+'...value....'+constraints[i].initialValue);
        	}
        }
    }
	
	try{
		// log.info("COMEÇOU");

		var client = org.apache.http.impl.client.HttpClients.createDefault();	
		// log.info( client );
	
		var url = "SUA URL AQUI";
		var post = new org.apache.http.client.methods.HttpPost(url);
		// log.info(post);
		// var par = new org.apache.http.entity.mime.content.StringBody('91');
		var reqEntity = new org.apache.http.entity.mime.MultipartEntityBuilder.create();
		
		for ( var key in params ){
			// log.info( key + " - " + params[key] );
			reqEntity.addPart(key, params[key]);
		}

		// log.info( reqEntity );

		var builEntity = reqEntity.build();
		// log.info( builEntity );
	
		post.setEntity(builEntity);
		// log.info(post);
		var response = client.execute(post);
		var responseJson = org.apache.http.util.EntityUtils.toString(response.getEntity());
		// log.info (responseJson);
		
		if ( responseJson == "" || responseJson.isEmpty()) {
			throw "Retorno esta vazio";
		} else {
			var jr = JSON.parse(responseJson);
			// printLog( 'info', "## success ## " + jr.success);		
			
			if( !jr.success ){
				throw 'Erro na integração com PipeDrive';
			}
			
			if( jr.data != null ){
				newDataset.addRow( 
							new Array( jr.data.name+"",
									   jr.data.deal_id+""
									) );
			}
		}
		
	} catch(erro) { 
		printLog( 'erro', "ERROOOOOO" + erro.toString() );
		throw erro.toString();
	}
	
	return newDataset;
	
}
function onMobileSync(user) {

}


var debug = true;

function printLog( tipo, msg ){
	
	if( debug ){
		var msgs = getValue("WKDef")+" - "+getValue("WKNumProces")+" - "+msg
		if( tipo == 'info'){
			log.info( msgs );
		}else if( tipo == 'error' ){
			log.error( msgs );
		}else if( tipo == 'fatal' ){
			log.fatal( msgs );
		}else{
			log.warn( msgs );
		}
	}
}

function getFile(anexo) {
	var sql = 	" select sit.storage, doc.nr_documento, doc.nr_versao, doc.nm_arquivo_fisico, doc.ds_principal_documento "+ 
				"	from documento doc  "+
				"	join fdn_volume vol on (vol.TENANT_ID = doc.COD_EMPRESA "+
				"						and vol.VOLUME_CODE = doc.COD_VOL_FISIC) "+
				"	left join fdn_volumesite sit on (sit.volume_id = vol.volume_id) "+
				"  where doc.cod_empresa = '1' "+
				"	 and doc.NR_DOCUMENTO = "+ anexo +" "+
				"	 and doc.VERSAO_ATIVA = 1 ";

	var ct = new Array();
	ct.push(DatasetFactory.createConstraint('DATABASE', 'java:/jdbc/FluigDS',	null, ConstraintType.MUST) );
	ct.push(DatasetFactory.createConstraint('SQL', 	 	sql, 					null, ConstraintType.MUST) );
	dsPath = DatasetFactory.getDataset("select", null, ct, null);
	if( dsPath.rowsCount > 0 ){		

		var filePath = dsPath.getValue(0,'storage')+'public/'+dsPath.getValue(0,'nr_documento')+'/'+dsPath.getValue(0,'nr_versao')+'/'+dsPath.getValue(0,'nm_arquivo_fisico'); 
		// log.info( 'filePath......'+filePath );

		var file = new java.io.File(filePath);
		// log.info(file);

		return file;
	}
}