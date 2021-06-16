function displayFields(form,customHTML){
	
	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);
	
	var manager = 'N';
	if( getValue('WKManagerMode') ){
		manager = 'S';
	}
	form.setValue("isManager", manager );

	var mobile = 'N';
	if( form.getMobile() ){
		mobile = 'S';
	}
	form.setValue("isMobile", mobile );
	
	form.setValue("task", getValue('WKNumState') );
	form.setValue("processo", getValue('WKNumProces') );
	form.setValue("cod_user", getValue('WKUser') );
}