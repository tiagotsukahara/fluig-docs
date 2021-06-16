var beforeSendValidate = function(numState,nextState){
	
	var task = $('#task').val();

	if (task == 0 || task == 1){
		if ( !valida('.valida') ){
			toast('Existem campos obrigatórios não preenchidos','danger');
			return false;
		}
	}

	return true;
	
}

function loadBody(){

	console.log('loadBody');
    displayFields();
    
}

function displayFields(){
	console.log('displayFields');
    var task = $('#task').val();
    
}