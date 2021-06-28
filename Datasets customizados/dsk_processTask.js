function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {

	var listaConstraits = {};
	
	listaConstraits['cod_processo'] = 'cadastro_item';
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
        	listaConstraits[ constraints[i].fieldName.trim() ] = constraints[i].initialValue;
        	log.info('fieldName.....'+constraints[i].fieldName+'...value....'+constraints[i].initialValue);
        }
    }
	log.info( 'Start dataset ' );
	
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn( 'cod_atividade' );
    newDataset.addColumn( 'den_atividade' );
//    newDataset.addColumn( 'idi_tip_estado' );
    
    
    var processId = listaConstraits['cod_processo'];

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("processId", processId , processId, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("active", 'true' ,'true', ConstraintType.MUST));
	var dataSet = DatasetFactory.getDataset("workflowProcess", null, constraints, ["workflowProcessPK.processInstanceId"]);
	
	if ( dataSet != null && dataSet != undefined ){
		if ( dataSet.rowsCount > 0){
			var versao = dataSet.getValue(dataSet.rowsCount -1, "version");
			
			var SQL = " select NUM_SEQ , DES_ESTADO from estado_proces where COD_DEF_PROCES  = '"+processId+"' and NUM_VERS = "+versao+" and COD_MECAN_ATRIBUIC != '' "
			var ct = new Array();
			ct.push(DatasetFactory.createConstraint("SQL", SQL , null, ConstraintType.MUST));
			ct.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/FluigDS' , null, ConstraintType.MUST));

			var ds = DatasetFactory.getDataset("select", null, ct, null);
			
			if ( ds != null && ds != undefined){
				if ( ds.rowsCount > 0){
					for (var i=0; i < ds.rowsCount; i++){
						var arr = new Array();
						arr.push( ds.getValue(i, 'num_seq' ) );
						arr.push( ds.getValue(i, 'des_estado') );
//						arr.push( ds.getValue(i, 'idi_tip_estado') );
						newDataset.addRow(arr);
					}
				}
			}
			
		}
	}
	
	return newDataset;
	
	
	
}
function onMobileSync(user) {

}