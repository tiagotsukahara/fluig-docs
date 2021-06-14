//Chamada de função

const constraintDS = [
    publicDataset.createConstraint("data_inicio_de", '2020-05-10', '2020-05-10', ConstraintType.MUST),
    publicDataset.createConstraint("data_inicio_ate", '2020-05-12', '2020-05-12', ConstraintType.MUST),
    publicDataset.createConstraint("data_fim_de", '2020-05-10', '2020-05-10', ConstraintType.MUST),
    publicDataset.createConstraint("data_fim_ate", '2020-05-12', '2020-05-12', ConstraintType.MUST),
];

publicDataset.getDataset("dsk_indica_obras", null, constraintDS, null, {
    success: data => {

        if (data.hasOwnProperty("values") && data.values.length > 0) {
            
            console.log(data.values);

        }
    }
});