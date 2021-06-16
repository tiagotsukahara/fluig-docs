function defineStructure() {}
function onSync(lastSyncDate) {}

function createDataset(fields, constraints, sortFields) {
	
	log.info( 'Start dataset ' );
    var dataset = DatasetBuilder.newDataset();
    
    var connectionWD;
    var statementWD;
    try{    

    	var dataBase = 'java:/jdbc/FluigDS';
	    var SQLconstrat = " SELECT u.COD_DEF_PROCES, def.DES_DEF_PROCES, u.num_proces, v.num_seq, t.NUM_SEQ_MOVTO, case when v.des_estado is not null then v.des_estado when u.status = 0 then 'Aberto' when u.status = 1 then 'Cancelado' else '' end as des_estado, x.num_seq_estado, u.status, case u.STATUS when 0 then 'Aberto' when 2 then 'Finalizado' when 1 then 'Cancelado' else '' end as den_status, case when u.STATUS = 0 and t.deadline < NOW() then 'Atrasado' when u.STATUS = 0 then v.DES_ESTADO when u.STATUS = 2 then 'Finalizado' when u.STATUS = 1 then 'Cancelado' else '' end as den_status_processo, ifnull( t.deadline, '' ) as prazo_tarefa, t.deadline as deadline, u.COD_MATR_REQUISIT, na.LOGIN as LOGIN_REQUISIT, " +
	    		"			t.CD_MATRICULA, n.LOGIN, n.USER_STATE, r.FULL_NAME as full_name, ra.FULL_NAME as 'full_name_requisit', u.END_DATE, u.START_DATE from proces_workflow u join histor_proces x on (x.COD_EMPRESA = u.COD_EMPRESA and x.NUM_PROCES = u.NUM_PROCES ) join tar_proces t on (x.COD_EMPRESA = t.COD_EMPRESA and x.NUM_PROCES = t.NUM_PROCES and case when u.STATUS = 1 then x.NUM_SEQ_MOVTO else x.NUM_SEQ_MOVTO_ANT end = t.NUM_SEQ_MOVTO ) join estado_proces v on (v.COD_EMPRESA = t.COD_EMPRESA and v.COD_DEF_PROCES = u.COD_DEF_PROCES and v.NUM_SEQ = x.NUM_SEQ_ESTADO and v.NUM_VERS = u.NUM_VERS) left join fdn_usertenant n on (n.USER_CODE = t.CD_MATRICULA ) left join fdn_user r on ( r.USER_ID = n.USER_ID ) join fdn_usertenant na on (na.USER_CODE = u.COD_MATR_REQUISIT ) join fdn_user ra on ( ra.USER_ID = na.USER_ID ) join def_proces def on (def.cod_empresa = u.cod_empresa and def.cod_def_proces = u.cod_def_proces ) WHERE u.STATUS in (1) and x.NUM_SEQ_MOVTO = ( select max( y.NUM_SEQ_MOVTO ) from histor_proces y where y.COD_EMPRESA = x.COD_EMPRESA and y.NUM_PROCES = x.NUM_PROCES ) and u.COD_DEF_PROCES = 'acertoViagem' " ;
	    var created = false;	
    	
		if (constraints != null) {			
	        for (var i = 0; i < constraints.length; i++) {
	        	log.info( 'Constrait '+i );
	        	log.info( constraints[i] );
	    		if ( constraints[i].fieldName.toUpperCase() == 'SQL' ){
	    			SQLconstrat = constraints[i].initialValue;
	    		}else if( constraints[i].fieldName.toUpperCase() == 'DATABASE' )  {
	    			dataBase = constraints[i].initialValue;    			
	    		}
	    	}
		}
	
		log.info( '$001... ' );
		var contextWD = new javax.naming.InitialContext();
		log.info( '$002... ' );
		var dataSourceWD = contextWD.lookup( dataBase );
		log.info( '$003... ' );
		connectionWD = dataSourceWD.getConnection();
		log.info( '$004... ' );
			
	
//		var SQL = "ALTER SESSION set NLS_DATE_FORMAT = 'DD/MM/YYYY'";
//		var statementWD = connectionWD.prepareStatement(SQL);
//		var rsWD = statementWD.executeUpdate();

		log.info( '$005... ' );
		statementWD = connectionWD.prepareStatement(SQLconstrat);
		rsWD = statementWD.executeQuery();
	    var columnCount = rsWD.getMetaData().getColumnCount();
	    
	    for(var i=1;i<=columnCount; i++) {
	    	log.info('$0088.....'+ rsWD.getMetaData().getColumnName(i)+' '+rsWD.getMetaData().getColumnName(i).toLowerCase() );
			dataset.addColumn(rsWD.getMetaData().getColumnLabel(i).toLowerCase());
		}
	    created = true;
	    
	    while(rsWD.next()) {
	    	
	        var Arr = new Array();
	                                           
	        for(var i=1;i<=columnCount; i++) {
	          	var obj = rsWD.getObject( rsWD.getMetaData().getColumnLabel(i) );
	            if(null!=obj){                                                                    
	               	Arr[i-1] = rsWD.getObject( rsWD.getMetaData().getColumnLabel(i) ).toString();
	            }else{
	                Arr[i-1] = "null";
	            }
	        }
	        dataset.addRow(Arr);
		}
		
		rsWD.close();
		statementWD.close();
		connectionWD.close();
    } catch (e){
		log.info( "ERRO"+ e.getMessage() );
		dataset.addColumn('status');
		dataset.addRow( new Array('Erro: '+e.getMessage()) );
	}
	finally {
    	log.info('##### 6 #####');
    	if(statementWD != null) statementWD.close();
        if(connectionWD != null) connectionWD.close();
    }	
	
	
    return dataset;
}

function onMobileSync(user) { }