function defineStructure() {}
function onSync(lastSyncDate) {}

function createDataset(fields, constraints, sortFields) {

	var listaConstraits = {};
	
//	listaConstraits['dataSet'] = 'veiculo';
//	listaConstraits['table'] = 'rateio';
	

    var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn( 'table' );
	newDataset.addColumn( 'tableFilha' );	
	
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
        	listaConstraits[ constraints[i].fieldName.trim() ] = constraints[i].initialValue;
        	log.info('fieldName...'+ constraints[i].fieldName.trim() + ' value...' + constraints[i].initialValue);
        }
    }
	
	log.info( 'Start dataset ' );
	
    try{    

		log.info( '$001... ' );
		var contextWD = new javax.naming.InitialContext();
		log.info( '$002... ' );
		var dataSourceWD = contextWD.lookup( "java:/jdbc/FluigDS" );
		log.info( '$003... ' );
		var connectionWD = dataSourceWD.getConnection();
		log.info( '$004... ' );

		// ITEM
    	
		var sql = "";
		if( listaConstraits['table'] != "" 
		 && listaConstraits['table'] != null
		 && listaConstraits['table'] != undefined ){
			sql = 	" select doc.COD_LISTA, " +
					" ml.COD_LISTA_FILHO as COD_FILHO "+
			  		" from documento doc "+
			  		" join META_LISTA_REL ml on (ml.COD_EMPRESA = doc.COD_EMPRESA "+
			        "                     and ml.COD_LISTA_PAI = doc.COD_LISTA "+
			        "                     and ml.COD_TABELA = '"+ listaConstraits['table'] +"' ) "+		        
			 		" where doc.COD_EMPRESA = "+ getValue("WKCompany") +
			   		"   and doc.NM_DATASET = '"+ listaConstraits['dataSet'] +"' "+
			   		"   and doc.VERSAO_ATIVA = 1 ";
		}else{
			sql = " select doc.COD_LISTA "+
	  				" from documento doc "+
	  				" where doc.COD_EMPRESA = "+ getValue("WKCompany") +
	  				"   and doc.NM_DATASET = '"+ listaConstraits['dataSet'] +"' "+
	  				"   and doc.VERSAO_ATIVA = 1 ";			
		}
	
		log.info( '$005 documento... '+sql );
		statementWD = connectionWD.prepareStatement(sql);
		rsWD = statementWD.executeQuery();
		
	    if( rsWD.next() ){
	    	log.info('table...' + rsWD.getString( 'COD_LISTA' ));
	    	var arr = new Array();
	    	arr.push( "ML"+ getLPad( getValue("WKCompany"), '000' ) + getLPad( rsWD.getString( 'COD_LISTA' ), '000' ) );
	    	if( listaConstraits['table'] != ""
	   		 && listaConstraits['table'] != null
			 && listaConstraits['table'] != undefined ){
		    	arr.push( "ML"+ getLPad( getValue("WKCompany"), '000' ) + getLPad( rsWD.getString( 'COD_FILHO' ), '000' ) );
		    }else{
		    	arr.push( "" );
		    }	    	
	    	newDataset.addRow( arr );
	    	
	    }else{
	    	
	    	sql = " SELECT a.COD_LISTA "+
	    		  "   FROM serv_dataset a "+
	    		  "  WHERE a.COD_EMPRESA = "+ getValue("WKCompany") +
	    	      "    AND a.IS_ACTIVE = 1 "+
	    	      "    and a.COD_DATASET = '"+ listaConstraits['dataSet'] +"' ";
	    	
			log.info( '$005 serv_dataset... '+sql );
			statementWD = connectionWD.prepareStatement(sql);
			rsWD = statementWD.executeQuery();
			if( rsWD.next() ){
				var arr = new Array();
		    	arr.push( "MD"+ getLPad( getValue("WKCompany"), '000' ) + getLPad( rsWD.getString( 'COD_LISTA' ), '000' ) );
		    	arr.push( "" );
			    newDataset.addRow( arr );
			}
	    }
				
	} catch (e){
		log.info( "ERROOOOOO"+ e.toString() );
	}
	finally {
		log.info('##### 6 #####');
		if(statementWD != null) statementWD.close();
	    if(connectionWD != null) connectionWD.close();
	}	
	return newDataset;
	
	
}

function onMobileSync(user) {

}

function getLPad( valor, pad){
	var str = "" + valor;
	var ans = pad.substring(0, pad.length - str.length) + str;
	return ans;
}