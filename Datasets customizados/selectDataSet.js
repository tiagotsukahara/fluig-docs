function defineStructure() {}
function onSync(lastSyncDate) {}
function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();

    var where = '';
    var order = '1 ';
    var limit = 300;
    var distinct = '';
    var dsName = 'usuario_comercial';
    var campos = new Array();
    var order = '1 ';
	
    
    if (fields != null) {
    	for (var i = 0; i < fields.length; i++) {
    		if ( fields[i] != 'distinct' ){
    			campos.push( fields[i] );
    			//dataset.addColumn( fields[i] );
    		}else{
    			distinct = 'distinct';
    		}
    	}
    }
    
	if (constraints != null) {			
        for (var i = 0; i < constraints.length; i++) {
        	log.info( 'Constrait '+i );
        	log.info( constraints[i] );
    		if ( constraints[i].fieldName == 'sqlLimit' ){
    			limit = constraints[i].initialValue;		
    		}else if( constraints[i].fieldName == 'dataset' )  {
    			dsName = constraints[i].initialValue;    			
    		}else{
    			var not = '';
    			var campo = constraints[i].getFieldName().toString();
    	    	var iniVal = constraints[i].initialValue;
    	    	var finVal = constraints[i].finalValue;
    	    	var tmpWhere = '';
    	    	if ( constraints[i].constraintType == 'MUST_NOT' )
    	    	  	not = 'not';
    	    	if ( campo.indexOf('___not___') >= 0 ){
   	    			not = 'not';
   	    			campo = campo.replace('___not___','');
    	    	}
    	    			   
    	    	if( constraints[i].initialValue == constraints[i].finalValue
    	    	 && constraints[i].initialValue.split('\\|').length >= 2 ){
    	    	   iniVal = constraints[i].initialValue.split('\\|')[0];
    	    	   finVal = constraints[i].initialValue.split('\\|')[1];
    	    	}
    	    	if ( campo.indexOf('=') >= 0 ){
    	    		tmpWhere = ' and ' + campo;
    	    	} else {
    	    		if ( campo.indexOf('___in___') >= 0 ){
    	    			if( constraints[i].initialValue.split('\\|').length > 0 ){
    	    				where += " and "+ campo.replace('___in___','') +
    	    						 " "+not+" in ( '"+ constraints[i].initialValue.split('\\|').join("','") +"' ) ";
    	    			}
    	    		}else if  ( constraints[i].likeSearch || constraints[i].constraintType == 'SHOULD' ){
    	    			where += " and "+ campo +
    	    					" "+not+" like upper( '%"+ constraints[i].initialValue +"%' ) ";
    	    		}else{
    	    			where += " and "+ campo +
    	    					" "+not+" between upper( '"+ iniVal +"' ) and upper( '"+ finVal +"' )";
    	    		}
    	    	}
    		}
    	}
	}
	
    if (sortFields != null) {
    	for (var i = 0; i < sortFields.length; i++) {
    		log.info( 'Order '+i );
    		order += ', '+sortFields[i];
    	}
    }
	
	try{    

		log.info( '$001... ' );
		var contextWD = new javax.naming.InitialContext();
		log.info( '$002... ' );
		var dataSourceWD = contextWD.lookup( "java:/jdbc/FluigDS" );
		log.info( '$003... ' );
		var connectionWD = dataSourceWD.getConnection();
		log.info( '$004... ' );

		var sql = " select doc.COD_LISTA " +
			  		" from documento doc "+ 
			 		" where doc.COD_EMPRESA = 1 "+
			   		"   and doc.NM_DATASET = '"+ dsName +"' "+
			   		"   and doc.VERSAO_ATIVA = 1 ";
	
		log.info( '$005... '+sql );
		statementWD = connectionWD.prepareStatement(sql);
		rsWD = statementWD.executeQuery();

		var mlPai = '';

	    while(rsWD.next()) {
	    	mlPai = rsWD.getString( 'COD_LISTA' );
	    }

	    log.info( '$005 campos...|'+campos+'|...' );
	    var sql = "	select ";
	    if( campos.length == 0 ){
	    	sql += " "+distinct+" p.* " ;
	    }else{
	    	sql += " "+distinct+" "+ campos.join(',') +" " ;
	    }
	    
	    
	    sql += "	from ML001"+ getLPad( mlPai, '000' ) +" p "+
				"	join DOCUMENTO d on (d.COD_EMPRESA = p.companyid "+ 
				"				 	 and d.NR_DOCUMENTO = p.documentid "+ 							 	 
				"				  	 and d.NR_VERSAO = p.version) "+
				"	where p.companyid = 1 "+ 
				"	  and d.VERSAO_ATIVA = 1 ";
	    sql += where;
	    
		if ( order != '' )
			sql += " order by "+ order ;
	    
	    log.info( '$005... '+sql );
	    statementWD = connectionWD.prepareStatement(sql);
		rsWD = statementWD.executeQuery();
		var columnCount = rsWD.getMetaData().getColumnCount();
		var created = false;
		while(rsWD.next()) {
	    	log.info( '$009... ' );
	    	if(!created) {
	    		for(var i=1;i<=columnCount; i++) {
	    			dataset.addColumn(rsWD.getMetaData().getColumnName(i).toLowerCase());
	    		}
	    		created = true;
	        }
	        var Arr = new Array();
	                                           
	        for(var i=1;i<=columnCount; i++) {
	          	var obj = rsWD.getObject(rsWD.getMetaData().getColumnName(i));
	            if(null!=obj){                                                                    
	               	Arr[i-1] = rsWD.getObject(rsWD.getMetaData().getColumnName(i)).toString();
	            }else{
	                Arr[i-1] = "null";
	            }
	        }
	        dataset.addRow(Arr);
		}
		rsWD.close();
		
	} catch (e){
		log.info( "ERROOOOOO"+ e.toString() );
	}
	finally {
		log.info('##### 6 #####');
		if(statementWD != null) statementWD.close();
	    if(connectionWD != null) connectionWD.close();
	}	
	return dataset;
	
}
function onMobileSync(user) {}

function getLPad( valor, pad){
	var str = "" + valor;
	if( pad.length < str.length )
		return str;
	return pad.substring(0, pad.length - str.length) + str;
	
}