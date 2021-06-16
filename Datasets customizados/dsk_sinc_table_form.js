function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
	
	log.info( "### Importa INFRAÇÕES ###");

	var dataset = DatasetBuilder.newDataset();
	
	dataset.addColumn( "registros" );

	var qtdReg = 0;

    var SQL = 'select * from sba_infracao';

    var constraints = new Array();	
	constraints.push(DatasetFactory.createConstraint("SQL", SQL ,SQL, ConstraintType.MUST));
	var dataSet = DatasetFactory.getDataset("select", null, constraints, null);
    
    for (var i = 0; i < dataSet.rowsCount; i++) {

        var ct = new Array();
        ct.push(DatasetFactory.createConstraint("infracao", dataSet.getValue(i, "infracao") ,'field', ConstraintType.MUST));
        ct.push(DatasetFactory.createConstraint("descricao_infracao", dataSet.getValue(i, "descricao_infracao") ,'field', ConstraintType.MUST));
        ct.push(DatasetFactory.createConstraint("amparo_legal", dataSet.getValue(i, "amparo_legal") ,'field', ConstraintType.MUST));
        ct.push(DatasetFactory.createConstraint("infrator", dataSet.getValue(i, "infrator") ,'field', ConstraintType.MUST));
        ct.push(DatasetFactory.createConstraint("gravidade", dataSet.getValue(i, "gravidade") ,'field', ConstraintType.MUST));
        ct.push(DatasetFactory.createConstraint("orgao_competente", dataSet.getValue(i, "orgao_competente") ,'field', ConstraintType.MUST));
        ct.push(DatasetFactory.createConstraint("valor", dataSet.getValue(i, "valor") ,'field', ConstraintType.MUST));
        ct.push(DatasetFactory.createConstraint("descritor", dataSet.getValue(i, "infracao") + ' - ' + dataSet.getValue(i, "descricao_infracao") ,'field', ConstraintType.MUST));

        ct.push(DatasetFactory.createConstraint("parentDocumentId", "337527" ,null, ConstraintType.MUST));
        var ds = DatasetFactory.getDataset("processo_movimento", null, ct, null);

        qtdReg++

    }    

	dataset.addRow( new Array( String(qtdReg) ) );

	return dataset;
	
}

function onMobileSync(user) {

}	
