function defineStructure() {}
function onSync(lastSyncDate) {}
function onMobileSync(user) {}
function createDataset(fields, constraints, sortFields) {

    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn( 'token' );
	
	try{

		var header = {
			"alg" : String( "HS256" ),
			"typ" : String( "JWT" ),
		 }

		var str_header = new java.lang.String( JSON.stringify( header ) );
		b64_header = new java.util.Base64.getUrlEncoder().withoutPadding().encodeToString( str_header.getBytes() );
		var sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		var payload = {
						"iat" : String( sdf.format( new Date() ) ),
						"exp" : String( sdf.format( new Date().setMinutes(120) ) ),
						"nome" : String( "Tiago" ),
						"email" : String( "tiago.tsukahara@gmail.com" ),
					};
		var str_payload = new java.lang.String( JSON.stringify(payload) );
		b64_payload = new java.util.Base64.getUrlEncoder().withoutPadding().encodeToString( str_payload.getBytes() );

		var key = new java.lang.String( "kobit" ).getBytes();
		var sha256 = new javax.crypto.Mac.getInstance("HmacSHA256");
		var keySpec = new javax.crypto.spec.SecretKeySpec(key, "HmacSHA256");
		sha256.init( keySpec );			
		var str_signature = new java.lang.String( b64_header + "." + b64_payload );
		var sha256_signature = sha256.doFinal( str_signature.getBytes() );
		b64_signature = new java.util.Base64.getUrlEncoder().withoutPadding().encodeToString( sha256_signature );
		
		var jwt_token = b64_header + "." + b64_payload + "." + b64_signature;

		newDataset.addRow([ jwt_token ]);
		
	} catch(erro) { 
		newDataset.addRow( [ erro.toString() ] );
	} finally {
		return newDataset;
	}	
	
}
