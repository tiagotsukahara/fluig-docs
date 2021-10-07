// function openABC(id){

//     if ($('#empresa_'+$this.instanceId).val() == ''){
//         toast('Selecione a empresa','danger');
//         return false;
//     }

//     var compon = new Array();
// 	compon['columns'] = ['select','classificacoes'];
// 	compon['values'] = [];

//     var constraints = new Array();

//     var SQL =   " select distinct trim(classificacoes) as classificacoes from ITEM_ABC "+
//                 " where cod_empresa = '"+$('#empresa_'+ $this.instanceId).val() +"' "+
//                 " order by classificacoes ";

//     constraints.push(DatasetFactory.createConstraint("SQL", SQL, SQL, ConstraintType.MUST));
//     constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/LogixDS', null, ConstraintType.MUST));

//     var compon = DatasetFactory.getDataset("select", null, constraints, null);


// 	console.log('compon......',compon);
// 	var fields = [ 
// 		{'field':'select',
// 		'titulo':'Sel.',
// 		'type':'checkbox',
// 		'style':'margin-top:0px;padding-top: 0px;padding-bottom: 0px;',
// 		'class':'form-control',
// 		'livre':'',
// 		'width':'10%'},
//         {'field':'classificacoes',
// 	    'titulo':'Classificações',
// 	    'type':'text',
// 	    'style':'padding-top: 0px;padding-bottom: 0px;',
// 	    'class':'form-control',
// 	    'livre':'readonly="readonly"',
// 	    //'precision':3,
// 	    'width':'10%'},
// 	    ];
// 	// var lista = id.split('___')[0].split('_')[2];
// 	if( $('#item_abc_'+ $this.instanceId ).val() != "" ){
// 		var lsClassificacoes = $('#item_abc_'+ $this.instanceId ).val().split(',');
// 		console.log('lsClassificacoes.......',lsClassificacoes);
// 		for( var j = 0; j < compon.values.length; j++ ){
// 			if( $.inArray( compon.values[j].classificacoes, lsClassificacoes ) >= 0 ){
// 				// compon.values[j]['classificacoes'] = lsClassificacoes[j].replace('.',',');
// 				compon.values[j]['select'] = 'S';
// 			}
// 			else{
// 				compon.values[j]['select'] = 'N';
// 			}
// 		}
// 		console.log('compon.values.......',compon.values);
// 	}

//     var retorno = modalTable( 'zoom_abc', 'Classificacoes ABC', fields, compon.values, 'large', id, 'N' );
    
//     console.log(retorno);
// }

function returnModalTable( retorno ){
	console.log('retorno.....', retorno.id, retorno);
	// var lista = retorno.idChave.split('___')[0].split('_')[2];
	if( retorno.id == 'zoom_abc' ){
		var lstClassificacoes = [];
		for( var i = 0; i < retorno.dados.length; i++ ){
			if( retorno.dados[i].select == 'S' ){
				lstClassificacoes.push(retorno.dados[i].classificacoes);
			}
		}
		// console.log(lstClassificacoes);
		$('#item_abc_'+ $this.instanceId ).val( lstClassificacoes );
		// autoSize();
		return true;
	}
	return true;
	
}

function modalTable( id, titulo, fields, dados, size, idChave, seqInicial, addDel ){
		
	//addDel (A=adiciona - D=deleta - A=ambos - N=Nenhum )
	
	parent.$('#workflowView-cardViewer').css( 'zIndex', 1 );
	//parent.$('#workflowview-header').hide();
	
	console.log('id modal.....',id);
	
	var seq = seqInicial;
	
	$(".table-modal > thead").html("");
	$(".table-modal > tbody").html("");
	
	var html = "<body class='fluig-style-guide' style='margin:0px; padding-top:0px; padding-bottom:0px; padding-left:0px; padding-right:0px;' >" +
			"<div class='table-responsive' id='pai_filho_modal' style='overflow: auto; height: 220px;'>" +
			"<table class='table table-hover table-modal'>" +
			"<thead>" +
			"</thead>" +
			"<tbody>" +
			"</tbody>" +
			"</table>" +
			"</div>" +
			"</body>";					
			
			
	var seq_linhe_modal = 0;
	
	var actions = [];
	
	if( addDel == 'A' || addDel == 'T' ){
		actions.push( {'label': 'Adiconar', 'classType': 'add_linha' } );
	}
	actions.push( {'label': 'Salvar','classType': 'save','autoClose': false} );
	actions.push( {'label': 'Fechar','autoClose': true} );
	
	var myModal = FLUIGC.modal({
		title: titulo,
		content: html,
		id: id,
		formModal: false,
		size: size,
		actions: actions, 
	}, function(err, data) {
		if(err) {
			// do error handling
		} else {
		
			var setup = function(lista) {
				var html = "<tr>";
				
				for (var i=0; i<lista.length; i++) {
					
					var cplStyle = "";
					if( lista[i].width == "0" ){
						cplStyle = "display:none;";
					}
					
					html += "<th style='"+cplStyle+lista[i].style+"' width='"+lista[i].width+"' >" + lista[i].titulo + "</th>"
				}
				if( addDel == 'D' || addDel == 'T' ){
					html += "<th width='5%' ></th>";
				}
				html += "</tr>";
				$(".table-modal > thead").append(html);
			}
		
			RemoveTableRow = function( handler ) {
				
				var tr = $(handler).closest('tr');
				tr.remove();
				
				var campoBase = fields[0].field;
				var  qtd = 0;
				$( "input[name*=md_"+campoBase+"___]" ).each(function( index ) {
					qtd += 1;
				});
				
				if ( qtd == 0 ){
					seq = "A";
					console.log('Alterado sequencia.....',seq);
				}
				
				return false;
			}

			loadDados = function( dados, fields ){
				console.log('Dados.....',dados);
				for (var i=0; i<dados.length; i++) {
					var seq = addTableRow( fields, 'S' );
					for (var j=0; j<fields.length; j++) {
						
						
						if( fields[j].type == 'checkbox' ){
							if( dados[i][ fields[j].field ] == 'S'
								|| dados[i][ fields[j].field ] == true
								|| dados[i][ fields[j].field ] == 'checked'
								|| fields[j]['default'] == 'S' 
							){
								$('#md_'+fields[j].field+'___'+seq).prop('checked',true);	
							}else{
								$('#md_'+fields[j].field+'___'+seq).prop('checked',false);
							}
						}else{
							$('#md_'+fields[j].field+'___'+seq).val( dados[i][ fields[j].field ] );
						}
					}
				}
				
				$('#checkAll').click(function() {
					var check = $(this).prop("checked");
					$(".checkItem").each(function(idx){
						if( $(this).parent().parent().css('display') != 'none' ){	
							$(this).prop("checked", check );
						}
					});
					//$('.checkItem').prop("checked", $(this).prop("checked") );
				});
				
				
				
				
			};
			
			addTableRow = function( lista, load ) {
				seq_linhe_modal += 1;
				var newRow = $("<tr>");
				var cols = "";
				for (var i=0; i<lista.length; i++) {							
					var type = lista[i].type;
					if ( type == 'date' )
							type = 'text';
					
					var cplStyle = "";
					if( lista[i].width == "0" ){
						cplStyle = "display:none;";
					}
					
					var valor = '';
					if (  load == 'N' && lista[i].prefixoAutoIncremento != null && lista[i].prefixoAutoIncremento != undefined ){
						console.log('valor add ',lista[i].prefixoAutoIncremento.trim(),seq );
						valor = lista[i].prefixoAutoIncremento.trim()+'-'+seq;
						seq = String.fromCharCode(seq.charCodeAt(0) + 1);
						valor = " value='"+valor+"'";
					};
						
					cols += "<td style='"+ cplStyle+lista[i].style+"' > <input type='"+type+"' style='"+lista[i].style+"' class='"+lista[i].class+"' name='md_"+lista[i].field+"___"+seq_linhe_modal+"' id='md_"+lista[i].field+"___"+seq_linhe_modal+"' "+lista[i].livre+" "+valor+" /> </td>"
				}
				if( addDel == 'D' || addDel == 'T' ){
					cols += "<td style='"+ cplStyle +"' > <button name='btDelApon' class='btn btn-default btn-sm fluigicon fluigicon-trash fluigicon-xs' type='button' onclick='RemoveTableRow(this)'></button> </td>";
				}
				newRow.append(cols);
				$(".table-modal > tbody").append(newRow);
				
				for (var i=0; i<lista.length; i++) {							
					if ( lista[i].type == 'date' ){
						var campoData = FLUIGC.calendar("[name^=md_"+lista[i].field+"___]" );
					}
					if ( lista[i].type == 'tel' && lista[i].precision != null && lista[i].precision != undefined ){
						$("[name^=md_"+lista[i].field+"___]").maskMoney( { precision:lista[i].precision, thousands:'.',decimal:','} );
					}
				}
				return seq_linhe_modal;
			}				
		
			$('.save').click(function() {
				var retorno = { 'id': id,
								'idChave': idChave,
								'seq': seq
							};
							
				var campoBase = fields[0].field;
				
				var dadosRet = [];
				
				$( "input[name*=md_"+campoBase+"___]" ).each(function( index ) {
					seq = $(this).attr('name').split('___')[1];
					reg = {};
					for (var j=0; j<fields.length; j++) {
						if( fields[j].type == 'checkbox' ){		
							if( $( '#md_'+fields[j].field+'___'+seq ).prop('checked') ){
								reg[ fields[j].field ] = 'S';
							}else{
								reg[ fields[j].field ] = 'N';
							}
						}else{
							reg[ fields[j].field ] = $( '#md_'+fields[j].field+'___'+seq ).val();
						}
					}
					dadosRet.push( reg );
				});	
				retorno['dados'] = dadosRet;
				if( returnModalTable( retorno ) ){
					myModal.remove();
				}
			});
			
			$('.add_linha').click(function() {
				addTableRow( fields, 'N' );
			});
			
			setup(fields);
			loadDados(dados, fields);
			
			$('.filter').keyup(function(e) {
				var keycode;
				filtro( e.target.id );
										
			});
			
			var filtro = function(id) {
				
				var entrouFiltro = false;
				
				$("input[name^=md_"+id+"___]").each(function(index){
					var seq = $(this).attr('id').split('___')[1];
					var achou = true;
					$(".filter").each(function(idx){
						entrouFiltro = true;
						if( $(this).val() != "" ){
													
							var campo = $(this).attr("id");
							var valor = $(this).val();
							
							if( $("#md_"+campo+"___"+seq).val().toUpperCase().indexOf( valor.toUpperCase() ) == -1 ){
								achou = false;		
							}
						}
					});
					if( achou || !entrouFiltro ){
						$(this).parent().parent().show();
					}else{
						$(this).parent().parent().hide();
					}
				});
				
			};
			
		}
	});			
	
}

function marcaTodos() {

	$("input[name*=ckb_gerar___]").each(function (index, value) {

		if ($(this).prop("checked")) {
			$(this).prop("checked", false);
		} else {
			$(this).prop("checked", true);
		}

	});
	
}