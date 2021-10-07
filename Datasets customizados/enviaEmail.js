function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {

    log.info( 'Dataset enviaEmail' );

    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn("Email");
    newDataset.addColumn("Conteudo");
    
//    var remetente = 'fluig@pormade.com.br';
    var remetente = 'admlog';
    var destinatario = new Array('tiago@kobit.com.br');
    var conteudo = 'TESTE CONTEUDO 3';
    var assunto = 'TESTE ASSUNTO 3';
    var tipo = 'simples';
    

    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
        	log.info( constraints[i] );
        	
        	if (constraints[i].fieldName == "EMAILS") { 
                remetente = constraints[i].initialValue;
                destinatario = constraints[i].finalValue.split(',');
            }
        	
            if (constraints[i].fieldName == "CONTEUDO") { 
                conteudo = constraints[i].initialValue;
                assunto = constraints[i].finalValue;
            }
            
            if (constraints[i].fieldName == "TIPO") { 
                tipo = constraints[i].initialValue;
            }
            
        }
      }
    
     if (!conteudo){
         return newDataset;
     }
     
	 
     try{
    	 
    	 if ( tipo == 'simples'){
    		 log.info('## SIMPLES');
    		 var obj = new com.fluig.foundation.mail.service.EMailServiceBean();
    		 
    		 for (var i in destinatario){
                 obj.simpleEmail(1 , assunto, remetente, destinatario[i], conteudo, "text/html");
                 newDataset.addRow(new Array(destinatario[i], 'enviado com sucesso!'));
             }
    	 }
    	 
    	 if ( tipo == 'notify') {
    		log.info('## NOTIFY');
    		//Monta mapa com parâmetros do template
		    var parametros = new java.util.HashMap();
		    parametros.put("CONTEUDO", conteudo);
		 
    		//Este parâmetro é obrigatório e representa o assunto do e-mail
		    parametros.put("subject", assunto);
    		    
    		//Monta lista de destinatários
		    var destinatarios = new java.util.ArrayList();
		    for (var i in destinatario){
		        destinatarios.add( destinatario[i] );
		    }
		    notifier.notify(remetente, "TPL_NEW_BLANK", parametros, destinatarios, "text/html");
		    
		    newDataset.addRow(new Array(destinatario.join(), 'enviado com sucesso!'));
    	 }
    	 
    	 if ( tipo == 'java'){
    		log.info('## JAVA');
    		// ##### ENVIO DE E-MAIL
	 		var contextWD = new javax.naming.InitialContext();
	 		var mailSession = contextWD.lookup("java:jboss/mail/Default");
	 		
	 		var to = new Array();	 		
	 		for (var i in destinatario){
                to.push(new javax.mail.internet.InternetAddress( destinatario[i] ));
            }
	 		
	 		// ### CRIA MENSSAGEM
	 		var menssagem = javax.mail.internet.MimeMessage(mailSession);
	 		var from = new javax.mail.internet.InternetAddress( remetente );
	 		menssagem.setFrom(from);
	 		menssagem.setRecipients(javax.mail.Message.RecipientType.TO, to);
	 		menssagem.setSubject( assunto );
	 		// ### Cria corpo do e-mail
	 		var textPart = new javax.mail.internet.MimeBodyPart();
	 		textPart.setText( conteudo , "utf-8");
	 		var htmlPart = new javax.mail.internet.MimeBodyPart();
	 		htmlPart.setContent( conteudo , "text/html; charset=utf-8");
	 		var multipart = new javax.mail.internet.MimeMultipart();
	 		multipart.addBodyPart(htmlPart);
	 		menssagem.setContent(multipart);
	 		
	 		// Cria anexo do e-mail
//	 		var messageBodyPart = new javax.mail.internet.MimeBodyPart();
	 		//messageBodyPart.setDataHandler(new javax.activation.DataHandler(new javax.mail.util.ByteArrayDataSource(HTML,"text/html; charset=utf-8")));
	 		//messageBodyPart.setDataHandler( new javax.activation.DataHandler( file ) );
//	 		var source = new javax.activation.FileDataSource('\\tmp\\'+filename);  
//	 		messageBodyPart.setDataHandler(new javax.activation.DataHandler( source ));  
	 	    
//	 		messageBodyPart.setFileName( filename );
//	 		multipart.addBodyPart(messageBodyPart);
//	 		menssagem.setContent(multipart);
	 		javax.mail.Transport.send(menssagem);
	 		// mailSession.close()
	 		newDataset.addRow(new Array(destinatario.join(), 'enviado com sucesso!'));
    	 }
         
     }catch(err){
         newDataset.addRow(new Array(destinatario, "erro:  " + err.toString()));
     }
     
     return newDataset;
}

function onMobileSync(user) {

}