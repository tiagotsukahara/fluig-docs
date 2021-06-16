function defineStructure() {}
function onSync(lastSyncDate) {}

function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();
	
	try{
		
	    var campos = '1 as fixo';
	    var where = '';
	    var order = '1 ';
	    var limit = 300;
	    var distinct = '';
	    var table = '';
	    var banco = 'informix';
	    var dataBase = 'java:/jdbc/LogixDS';
	    
	    log.info("Passo 01");
	   
	    
	    if (fields != null) {
	    	for (var i = 0; i < fields.length; i++) {
	    		if ( fields[i] != 'distinct' ){
	    			campos += ', '+fields[i];
	    			dataset.addColumn( fields[i] );
	    		}else{
	    			distinct = 'distinct';
	    		}
	    	}
	    }
	   
	    log.info("Passo 02");
	    
		if (constraints != null) {			
	        for (var i = 0; i < constraints.length; i++) {
	        	log.info( constraints[i] );
	    		if ( constraints[i].fieldName == 'sqlLimit' ){
	    				limit = constraints[i].initialValue;
	    		}else if( constraints[i].fieldName == 'table' )  {
	    				table = constraints[i].initialValue;    			
	    		}else if( constraints[i].fieldName == 'dataBase' )  {
	    				dataBase = constraints[i].initialValue;
	    		}else if( constraints[i].fieldName == 'banco' )  {
	    				banco = constraints[i].initialValue;
	    		}else{ var not = '';
	    					   var campo = constraints[i].getFieldName().toString();
	    	    			   if ( constraints[i].constraintType == 'MUST_NOT' )
	    	    				  	not = 'not';
	    	    			   log.info( '######' + constraints[i].constraintType);
	    	    			   
	    	    			   if ( campo.indexOf('___not___') >= 0 ){
	   	    				  		not = 'not';
	   	    				  		campo = campo.replace('___not___','');
	    	    			   }
	    	    			   var upper_lower = "upper";
	    	    			   if ( campo.indexOf('___lower___') >= 0  ){
	    	    				   upper_lower = "lower";
	    	    				   campo = campo.replace('___lower___','');
	    	    			   }
	    	    			   
	    	    			   if( constraints[i].initialValue == 'true' 
	    	    				   || constraints[i].initialValue == 'false' ){
	    	    				   upper_lower = '';
	    	    			   }
	    	    			   if ( campo.indexOf('___in___') >= 0 ){
	    	    				   where += " and "+ campo.replace('___in___','') +" "+
	  				   			            " "+not+" in ( '"+ constraints[i].initialValue.replaceAll( '\\|', '\',\'' ) +"' ) ";
	    	    			   }else if  ( constraints[i].likeSearch || constraints[i].constraintType == 'SHOULD' ){
	    	    				   	where += " and "+campo +" "+
	    	    				   			 " "+not+" like "+ upper_lower +"( '%"+ constraints[i].initialValue +"%' ) ";
	    	    			   }else{
	    	    				   	where += " and "+ campo +" "+
	    	    				   			 " "+not+" between "+ upper_lower +"( '"+ constraints[i].initialValue +"' ) and "+ upper_lower +"( '"+ constraints[i].finalValue +"' )";
	    	    			   }
	    			}
	    	}
		}
	
		log.info("Passo 03");
		
	    if (sortFields != null) {
	    	for (var i = 0; i < sortFields.length; i++) {
	    		order += ', '+sortFields[i];
	    	}
	    }
	
	    
	    log.info( '$$$$$$$$$$$ '+ campos );
	    log.info( '$$$$$$$$$$$ '+ where );
	    log.info( '$$$$$$$$$$$ '+ order );
	    log.info( '$$$$$$$$$$$ '+ limit );
	    log.info( '$$$$$$$$$$$ '+ table );
	    log.info( '$$$$$$$$$$$ '+ dataBase );
		
		
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup( dataBase );
		var connectionWD = dataSourceWD.getConnection();
		
		if( banco == 'informix' ){
			var SQL = "set isolation to dirty read";
			var statementWD = connectionWD.prepareStatement(SQL);
			var rsWD = statementWD.executeUpdate();
		}
		
		    SQL = " select " ;
		    if( banco == 'informix' )
		    	SQL +=	" first "+ limit ;	

		    SQL +=	"  "+ distinct +" "+ campos +
		    		"  from "+ table +  
			        "  where 1=1 "+ where ;
		if ( order != '' )
			 SQL += " order by "+ order ;
		if( banco == 'postgresql' )
	    	SQL +=	" limit "+ limit ;	
		
		log.info( SQL );
		 
		 	statementWD = connectionWD.prepareStatement(SQL);
		 	rsWD = statementWD.executeQuery();
	
		while(rsWD.next()){
			
			var dados = new Array();
			if (fields != null) {
		    	for (var i = 0; i < fields.length; i++) {
		    		log.info( 'Field.....'+i );
		    		log.info( 'Field.....'+fields[i] );
		    		if ( fields[i] != 'distinct' ){
		    			dados.push( rsWD.getString( fields[i] )  );
		    		}
		    	}
		    }	
			
			dataset.addRow( dados );
			
		}
		
		rsWD.close();
		statementWD.close();
		connectionWD.close();
		
	} catch (e){
		log.info( "ERROOOOOO"+ e.toString() );
	}finally {
    	log.info('##### 6 #####');
    	if(statementWD != null) statementWD.close();
        if(connectionWD != null) connectionWD.close();
    }

		
    return dataset;

}

function isNumeric( obj ) {
	return !isNaN( parseFloat(obj) ) && isFinite( obj );
}

function onMobileSync(user) { }