function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
	
	var choosedState = "";
	var numProcesso = "";
	var usuario = "";
	
	log.info( "passo 0001 ");
	
	if (constraints != null) {			
        for (var i = 0; i < constraints.length; i++) {
    		if ( constraints[i].fieldName == 'atividade' ){
    			choosedState = constraints[i].initialValue;
    			log.info('Entrei atividade........... '+constraints[i].initialValue );
    		}
    		if ( constraints[i].fieldName == 'processo' ){
    			numProcesso = constraints[i].initialValue;
    			log.info('Entrei processo........... '+constraints[i].initialValue );
    		}
    		if ( constraints[i].fieldName == 'usuario' ){
    			usuario = constraints[i].initialValue;
    			log.info('Entrei usuario........... '+constraints[i].initialValue );
    		}
        }
	}
	
	log.info( "passo 0002 ");	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn( "num_seq_movto" );
	
	if( choosedState == "" && numProcesso == "" ){
		return dataset;
	}
	
	var contextWD = null;
	var dataSourceWD = null;
	var connectionWD = null;
	var statementWD = null;
	
	try{
		contextWD = new javax.naming.InitialContext();
		dataSourceWD = contextWD.lookup( "java:/jdbc/FluigDS" );
		connectionWD = dataSourceWD.getConnection();
		//connectionWD.setAutoCommit(false);
		
		
		var sql = " INSERT INTO histor_proces( "+
			 	"	COD_EMPRESA, NUM_SEQ_MOVTO, NUM_PROCES, log_ativ, LOG_FLUXO_AUTOM, NUM_SEQ_CONVER, LOG_FLUXO_PADRAO, "+ 
			    "	 DAT_MOVTO, HRA_MOVTO, num_seq_movto_ant, LOG_FLUXO_RET, num_seq_estado, NUM_SUB_PROCES, NUM_SEQ_THREAD, MOVTO_DATE_TIME "+ 
				") "+
				"SELECT COD_EMPRESA, NUM_SEQ_MOVTO + 1, NUM_PROCES, 1, LOG_FLUXO_AUTOM, NUM_SEQ_CONVER, LOG_FLUXO_PADRAO, "+ 
			    "	 	DAT_MOVTO, HRA_MOVTO, NUM_SEQ_MOVTO, LOG_FLUXO_RET, "+ choosedState +", NUM_SUB_PROCES, NUM_SEQ_THREAD, MOVTO_DATE_TIME  "+
			  	"  FROM histor_proces  "+
			 	"  WHERE num_proces = "+ numProcesso +" "+
			    "	 AND num_seq_movto = ( SELECT max(num_seq_movto) "+ 
				"							  FROM histor_proces "+
				"							 WHERE num_proces = "+ numProcesso +" ) ";
	
		log.info( "sql.......... "+sql);
		statementWD = connectionWD.prepareStatement(sql);
		statementWD.executeUpdate();
		
		var sql = " UPDATE proces_workflow "+ 
				" 	   SET log_ativ = 1, end_date = NULL, STATUS = 0, total_runtime = NULL "+ 
				"	 WHERE num_proces = "+ numProcesso +" ";
	
		log.info( "sql.......... "+sql);
		statementWD = connectionWD.prepareStatement(sql);
		statementWD.executeUpdate();
		
		var sql = " INSERT INTO tar_proces( "+
				"		CD_MATRICULA, COD_EMPRESA, NUM_SEQ_MOVTO, "+ 
				"		NUM_PROCES, NUM_SEQ_TRANSF, log_ativ, ASSIGN_START_DATE, assign_end_date, DAT_MSG_ATRASO_RESPONS, "+
				"		NUM_HORA_MSG_ATRASO_RESPONS, COD_MATR_ESCOLHID, NUM_SEQ_ESCOLHID, CLOSURE_STATUS, CD_MATRICULA_CONCLUS, IDI_TIP_CONCLUS, DEADLINE, deadlineDate, "+
				"		deadlineHour, END_DATE,	initialTermDate, initialTermHour, DAT_MSG_ATRASO_GESTOR, NUM_HORA_MSG_ATRASO_GESTOR, DAT_MSG_EXPIRAC_RESPONS, "+
				"		NUM_HORA_MSG_EXPIRAC_RESPONS, DAT_MSG_EXPIRAC_GESTOR, NUM_HORA_MSG_EXPIRAC_GESTOR, DAT_MSG_EXPIRAC_REQUISIT, NUM_HORA_MSG_EXPIRAC_REQUISIT, "+
				"		DAT_MSG_ATRASO_REQUISIT, NUM_HORA_MSG_ATRASO_REQUISIT, START_DATE, IDI_STATUS, taskCompletionDate, taskCompletionHour, DSL_OBS_TAR, "+
				"		LOG_ASSINADO, DS_ARQUIVO_HASH, DS_NOME_ARQUIVO_ASS, WARNING_DATE, TOTAL_RUNTIME  "+
				") "+
				" SELECT case when cd_matricula LIKE 'Pool:%' then CD_MATRICULA ELSE " +
				"			case when '"+ usuario +"' <> '' then '"+ usuario +"' else cd_matricula end end, COD_EMPRESA, (SELECT MAX(num_seq_movto) FROM histor_proces WHERE histor_proces.num_proces =  tar_proces.num_proces ) as NUM_SEQ_MOVTO, "+ 
				"		NUM_PROCES, NUM_SEQ_TRANSF, case when cd_matricula NOT LIKE 'Pool:%' then 1 ELSE 0 end, ASSIGN_START_DATE, case when cd_matricula NOT LIKE 'Pool:%' then null ELSE assign_end_date end, DAT_MSG_ATRASO_RESPONS, "+
				"		NUM_HORA_MSG_ATRASO_RESPONS, '' as COD_MATR_ESCOLHID, 0 as NUM_SEQ_ESCOLHID, 0 as CLOSURE_STATUS, CD_MATRICULA_CONCLUS, IDI_TIP_CONCLUS, DEADLINE, deadlineDate, "+
				"		deadlineHour, null as END_DATE,	initialTermDate, initialTermHour, DAT_MSG_ATRASO_GESTOR, NUM_HORA_MSG_ATRASO_GESTOR, DAT_MSG_EXPIRAC_RESPONS, "+
				"		NUM_HORA_MSG_EXPIRAC_RESPONS, DAT_MSG_EXPIRAC_GESTOR, NUM_HORA_MSG_EXPIRAC_GESTOR, DAT_MSG_EXPIRAC_REQUISIT, NUM_HORA_MSG_EXPIRAC_REQUISIT, "+
				"		DAT_MSG_ATRASO_REQUISIT, NUM_HORA_MSG_ATRASO_REQUISIT, START_DATE, case when cd_matricula NOT LIKE 'Pool:%' then 0 ELSE 3 end as IDI_STATUS, taskCompletionDate, taskCompletionHour, DSL_OBS_TAR, "+
				"		LOG_ASSINADO, DS_ARQUIVO_HASH, DS_NOME_ARQUIVO_ASS, WARNING_DATE, null as TOTAL_RUNTIME  "+
				"  FROM tar_proces  "+
				" WHERE num_proces = "+ numProcesso +"  "+
				"   AND num_seq_movto = ( select max(num_seq_movto) FROM tar_proces WHERE num_proces = "+ numProcesso +" AND cd_matricula NOT IN ('System:Auto') AND cd_matricula NOT LIKE 'Pool:%' ) ";

		log.info( "sql.......... "+sql);
		statementWD = connectionWD.prepareStatement(sql);
		statementWD.executeUpdate();
		
		var sql = " SELECT max(num_seq_movto) as num_seq_movto"+ 
				  "   FROM histor_proces "+
				  "	 WHERE num_proces = "+ numProcesso ;
		
		statementWD = connectionWD.prepareStatement(sql);
		rsWD = statementWD.executeQuery();
		
		if(rsWD.next()){
			var dados = new Array();
   			dados.push( rsWD.getString( 'num_seq_movto' )  );
				dataset.addRow( dados );
		}
		
		
		//connectionWD.commit( );
		
	} catch (e){
		log.erro( "ERRO reabreProcesso.js...."+ e.toString() );
		//connectionWD.rollback();
	}
	finally {
		log.info('##### 6 #####');
		if(statementWD != null) statementWD.close();
		if(connectionWD != null) connectionWD.close();
	}	
	return dataset;
}

function onMobileSync(user) {

}