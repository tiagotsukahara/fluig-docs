function defineStructure() {}
function onSync(lastSyncDate) {}
function onMobileSync(user) {}
function createDataset(fields, constraints, sortFields) {
	
//	422760
//	422752
	
	var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn( 'retorno' );
    
	try{
		
		var filePaths = [];
		filePaths.push( getFile('422760') ); //Passar Document ID 
		filePaths.push( getFile('422752') );
		
		f = new java.io.File("/tmp/teste.zip"); // Caminho onde arquivo será gerado
		
		var out = new java.util.zip.ZipOutputStream(new java.io.FileOutputStream(f));
		
		for (var i = 0; i < filePaths.length; i++){
			
			newDataset.addRow( new Array( filePaths[i] ) );
			var e = new java.util.zip.ZipEntry(filePaths[i].getName());
			out.putNextEntry(e);
			
			var data = new java.nio.file.Files.readAllBytes( new java.nio.file.Paths.get( filePaths[i] ));
			
//			var data = sb.toString().getBytes();
			out.write(data, 0, data.length);	
			out.closeEntry();
			
		}
		
		
		
		out.close();
		
		
		
	} catch(e){
		
		newDataset.addRow( new Array( erro.toString() ) );
		
	} finally{
		
		return newDataset;
		
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