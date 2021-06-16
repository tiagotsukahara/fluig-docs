function print() {
	var retorno;

	$("input[name^=nome_posto___]").each(function (index, value) {
		var linha = validafunctions.getPosicaoFilho($(this).attr("id"));
		if ($(this).attr("id")[0] != '_') {
			// var s = $('#nome_posto___' + linha).val();
			if ($('#nome_posto___' + linha).val().indexOf('PORMADE') != -1) {
				retorno = true;
				return false;
			} else {
				retorno = false;
			}
		}
	})

	if (retorno) {
		if ($('#processo').val() != "0"
			&& $('#processo').val() != undefined
			&& $('#processo').val() != null
			&& $('#task').val() != ""
			&& $('#task').val() != undefined) {
			var user = [parent.WCMAPI.userCode];
			if (parent.ECM.workflowView.availableUsers.users[0] && parent.ECM.workflowView.availableUsers.users[0].colleagueId) {
				user = [parent.ECM.workflowView.availableUsers.users[0].colleagueId]
			}
			var state = parent.ECM.workflowView.availableStates[0].sequence,
				formData = parent.ECM_WKFView.getFormData();
			parent.ECM_WKFView.conditionsAutomatic.selectedDestinyAfterAutomatic = -1;
			parent.ECM_WKFView.conditionsAutomatic.conditionAfterAutomatic = -1;
			movimentActivity(false, formData, user, state, null, false, null, null, null, null, null, true)
		}

		var mydate = new Date();
		console.log(mydate);
		var year = mydate.getFullYear();
		console.log(year);
		var month = mydate.getMonth();
		var daym = mydate.getDate();

		if (daym < 10) {
			daym = "0" + daym;
		}

		var monthm = mydate.getMonth();
		if (monthm < 10) {
			monthm = "0" + monthm;
		}

		var dateNow = daym + "/" + monthm + "/" + year;
		var timeNow = mydate.getHours() + ":" + mydate.getMinutes();

		var montharray = new Array(" de Janeiro de ", " de Fevereiro de ", " de Março de ", "de Abril de ", "de Maio de ", "de Junho de", "de Julho de ", "de Agosto de ", "de Setembro de ", " de Outubro de ", " de Novembro de ", " de Dezembro de ");
		var hoje = daym + " " + montharray[month] + year;

		var html = " <!DOCTYPE html> " +
			" <html> " +
			" 	<head> " +
			" 		<style> " +
			"				table {" +
			"					border-collapse: collapse; " +
			"				}" +
			" 			th, td { " +
			" 				border: 1px solid black; " +
			" 				border-collapse: collapse; " +
			" 				padding: 5px; " +
			" 				font-size: 12px; " +
			" 			} " +
			"				.title { " +
			"					background-color: #ccc; " +
			"					text-align: center; " +
			"				} " +
			"				.center { " +
			"					text-align: center; " +
			"				} " +
			"				.right { " +
			"					text-align: right; " +
			"				} " +
			"				.noBorder { " +
			"					border: none; " +
			"				} " +
			" 		</style> " +
			" 	</head> " +
			" <body> ";

		// RELATÓRIO DE VIAGEM

		var cpf = $('#matricula_fluig').val();
		cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");


		// DIARIAS
		var date1 = new Date($('#data_saida').val().split('/').reverse().join('/'));
		var date2 = new Date($('#data_chegada').val().split('/').reverse().join('/'));
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

		if (diffDays < 1) {
			diffDays = 1;
		}

		html += " <table style='width: 100%;' font size = 1 > " +
			"		<tr> " +
			"			<td class='title' colspan='12'><b>RELATÓRIO DE VIAGEM - " + $('#carga').val() + "</b></td> " +
			"		</tr> " +
			"		<tr> " +
			"			<td colspan='6'>Motorista: <b>" + $('#cod_motorista').val() + " - " + $('#motorista').val() + "</b></td> " +
			"			<td colspan='6'>CPF: <b>" + cpf + "</b></td> " +
			"		</tr> " +
			"		<tr> " +
			"			<td colspan='6'>Destino: <b>" + $('#destino').val() + "</b></td> " +
			"			<td colspan='6'>Placa: <b>" + $('#placa').val() + "</b></td> " +
			"		</tr> " +
			"		<tr> " +
			"			<td colspan='3'>Saida: <b>" + $('#data_saida').val() + "</b></td> " +
			"			<td colspan='3'>Chegada: <b>" + $('#data_chegada').val() + "</b></td> " +
			"			<td colspan='3'>KM Saida: <b>" + $('#km_saida').val() + "</b></td> " +
			"			<td colspan='3'>KM Cheg.: <b>" + $('#km_chegada').val() + "</b></td> " +
			"		</tr> " +
			"		<tr>" +
			"			<td colspan='3'>KM Total: <b>" + $('#km_total').val() + "</b></td> " +
			"			<td colspan='3'>Tot de Litros: <b>" + $('#consumo').val() + "</b></td> ";

			if ($('#categoria').val() == 'TOCO') {
				console.log('entrou toco');
				if (media < media_minima && media > media_maxima) {
					html += "			<td colspan='3'>Media: <b>" + $('#media').val() + "</b></td> ";				
				} else {
					html += "			<td colspan='3'>Media: <b style='color: red'>" + $('#media').val() + "</b></td> ";
				}
			}

			if ($('#categoria').val() == 'TRUCK') {
				console.log('entrou truck', media, media_minima, media_maxima, media < media_minima, media > media_maxima);
				if (media < media_minima && media > media_maxima) {
					html += "			<td colspan='3'>Media: <b>" + $('#media').val() + "</b></td> ";
				} else {
					html += "			<td colspan='3'>Media: <b style='color: red'>" + $('#media').val() + "</b></td> ";
				}
			}

			if ($('#categoria').val() == 'CAVALO') {
				console.log('entrou cavalo');
				if (media < media_minima && media > media_maxima) {
					html += "			<td colspan='3'>Media: <b>" + $('#media').val() + "</b></td> ";
				} else {
					html += "			<td colspan='3'>Media: <b style='color: red'>" + $('#media').val() + "</b></td> ";
				}
			}
			
			html += "			<td colspan='3'>Preço Medio: <b>" + $('#media_val_diesel').val() + "</b></td> " +
			"		</tr>" +
			"		<tr> " +
			"			<td class='title' colspan='12'><b>TOTAIS</b></td> " +
			"		</tr> " +
			"		<tr>" +
			"			<td colspan='4'>Saldo Inicial: " + $('#adiantamento').val() + "</td> " +
			"			<td colspan='4'>Saldo Final: " + $('#saldo_final').val() + "</td> " +
			"			<td colspan='4'><b>Diferença: " + $('#diferenca').val() + "</b></td> " +
			"		</tr> ";
		// "		<tr> "+
		// "			<td colspan='4'><b>Saldo Ini.: </b>"+$('#adiantamento').val()+"</td> "+
		// "			<td colspan='4'><b>Recebido: </b>"+$('#recebido').val()+"</td> "+
		// "			<td colspan='4'><b>Ajuda Custo: </b>"+$('#ajuda_custo').val()+"</td> "+
		// "		</tr> "+
		// "		<tr> "+
		// "			<td colspan='4'><b>Despesa: </b>"+$('#despesa').val()+"</td>         "+
		// "			<td colspan='4'><b>Diesel Pg: </b>"+$('#combustivel_pago').val()+"</td> "+
		// "			<td colspan='4'><b>Diesel Fat: </b>"+$('#combustivel_faturado').val()+"</td> "+								
		// "		</tr> "+
		// "		<tr> "+
		// "			<td colspan='4'><b>Pedágio: </b>"+$('#pedagio').val()+"</td> "+
		// "			<td colspan='4'><b>Descarga: </b>"+$('#descarga').val()+"</td>         "+
		// "			<td colspan='4'><b>Diária: </b>"+$('#diaria').val()+"</td> "+
		// "		</tr>     "+
		// "		<tr> "+
		// "			<td colspan='4'><b>Saldo Fin: </b>"+$('#saldo_final').val()+"</td>         "+
		// "			<td colspan='4'><b>Res. Viagem: </b>"+$('#resultado_viagem').val()+"</td> "+				
		// "			<td colspan='4'><b>Diferenca: </b>"+$('#diferenca').val()+"</td> "+
		// "		</tr>     ";

		var despesas = new Array();

		$("input[name^=tipo_receita___]").each(function (index, value) {
			var linha = validafunctions.getPosicaoFilho($(this).attr("id"));

			if ($(this).attr("id")[0] != '_') {
				if ($('#tipo_receita___' + linha).val() != '') {
					if (index == 0) {
						html += "		<!-- RECEITAS --> " +
							"		<tr>" +
							"			<td class='noBorder'>" +
							"			</td>" +
							"		</tr>" +
							"		<tr> " +
							"			<td class='title' colspan='12'> " +
							"				<b>RECEITAS</b> " +
							"			</td> " +
							"		</tr> " +
							"		<tr> " +
							"			<td colspan='3'>Data: </td> " +
							"			<td colspan='7'>Tipo: </td> " +
							"			<td colspan='2'>Valor: </td> " +
							//"			<td colspan='2'>Ajuda Custo: </td> "+
							"		</tr> ";
					}
					html += "		<tr> " +
						"			<td colspan='3'>" + $('#data_receira___' + linha).val() + "</td> " +
						"			<td colspan='7'>" + $('#tipo_receita___' + linha).val() + "</td> " +
						"			<td class='right' colspan='2'>" + $('#valor_receita___' + linha).val() + "</td> " +
						// "			<td class='right' colspan='2'>"+$('#valor_ajuda_custo___' + linha).val()+"</td> "+
						"		</tr> ";

					var data = $('#data_receira___' + linha).val();
					var tipo = 'COMISSAO DE RETORNO';
					var obs = $('#tipo_receita___' + linha).val();
					var valor = isNull(validafunctions.getFloatValue("valor_ajuda_custo___" + linha), 0);

					if (valor > 0) {
						despesas.push({ 'data': new Date(data.split('/').reverse().join('/')), 'tipo': tipo, 'obs': obs, 'valor': valor });
					}

					if ($('#obs_receita___' + linha).val() != '') {
						html += "		<tr> " +
							"				<td colspan='12'><b>Obs: </b>" + $('#obs_receita___' + linha).val() + "</td> " +
							"		</tr> ";
					}
				}
			}

		});

		if ($('#receitas >tbody >tr').length > 1) {
			html += "		<tr> " +
				"			<td colspan='10'><b>TOTAL</b></td> " +
				"			<td class='right' colspan='2'><b>" + $('#recebido').val() + "</b></td> " +
				// "			<td class='right' colspan='2'><b>"+$('#ajuda_custo').val()+"</b></td> "+
				"		</tr> ";
		}


		$("input[name^=tipo_despesa___]").each(function (index, value) {
			var linha = validafunctions.getPosicaoFilho($(this).attr("id"));
			if ($(this).attr("id")[0] != '_') {
				if ($('#cod_tipo_despesa___' + linha).val() != 'DIA') {
					// if (index == 0) {

					var data = $('#data_despesa___' + linha).val();
					var tipo = $('#tipo_despesa___' + linha).val();
					var obs = $('#obs_despesa___' + linha).val();
					var valor = isNull(validafunctions.getFloatValue("valor_despesa___" + linha), 0);

					despesas.push({ 'data': new Date(data.split('/').reverse().join('/')), 'tipo': tipo, 'obs': obs, 'valor': valor });
				}
			}
		});

		// alert('ver console.log');

		$("input[name^=ajudante_descarga___]").each(function (index, value) {
			var linha = validafunctions.getPosicaoFilho($(this).attr("id"));
			if ($(this).attr("id")[0] != '_') {
				var data = $('#data_descarga___' + linha).val();

				var tipo = 'DESCARGA';

				if ($('#ajudante_descarga___' + linha).val() == 'CHAPA') {
					var obs = $('#qtd_descarga___' + linha).val() + ' - ' + $('#ajudante_descarga___' + linha).val();
				} else {
					var obs = $('#ajudante_descarga___' + linha).val();
				}
				var valor = isNull(validafunctions.getFloatValue("valor_descarga___" + linha), 0);

				despesas.push({ 'data': new Date(data.split('/').reverse().join('/')), 'tipo': tipo, 'obs': obs, 'valor': valor });
			}
		});



		despesas.sort(function (a, b) {
			return a.data < b.data ? -1 : a.data > b.data ? 1 : 0;
		});

		console.log(despesas);

		var despesa = 0;

		$.each(Object.keys(despesas), function (index, value) {

			if (index == 0) {
				html += "		<!-- DESPESAS --> " +
					"		<tr>" +
					"			<td class='noBorder'>" +
					"			</td>" +
					"		</tr>" +
					"		<tr> " +
					"			<td class='title' colspan='12'><b>DESPESAS</b></td> " +
					"		</tr> " +
					"		<tr> " +
					"			<td colspan='3'>Data:</td> " +
					"			<td colspan='3'>Tipo:</td> " +
					"			<td colspan='4'>Obs:</td> " +
					"			<td colspan='2'>Valor:</td> " +
					"		</tr> ";
			}
			html += "		<tr> " +
				"			<td colspan='3'>" + $.datepicker.formatDate('dd/mm/yy', despesas[index].data) + "</td> " +
				"			<td colspan='3'>" + despesas[index].tipo + "</td> " +
				"			<td colspan='4'>" + despesas[index].obs + "</td> " +
				"			<td class='right' colspan='2'>" + String((despesas[index].valor).toFixed(2)).replace('.', ',') + "</td> " +
				"		</tr> ";
				if (despesas[index].valor > 0) {
					despesa += despesas[index].valor;
				}				
		});
		// despesa += isNull(validafunctions.getFloatValue('despesa'), 0);
		// var descarga = isNull(validafunctions.getFloatValue('descarga'), 0);
		// var total_despesa = despesa + descarga;

		if (despesa > 0) {
			html += "		<tr> " +
				"			<td colspan='10'><b>TOTAL</b></td> " +
				"			<td class='right' colspan='2'><b>" + String((despesa).toFixed(2)).replace('.', ',') + "</b></td> " +
				"		</tr> ";
		}


		/*
		$("input[name^=ajudante_descarga___]").each(function(index, value){
			var linha = validafunctions.getPosicaoFilho($(this).attr("id"));
			if	($(this).attr("id")[0] != '_' ){
				if ($('#ajudante_descarga___' + linha).val() != '') {
					if (index == 0) {
					html +=	"		<!-- DESCARGA --> "+
									"		<tr> "+
									"			<td class='title' colspan='12'> "+
									"				<b>DESCARGA</b> "+
									"			</td> "+
									"		</tr> ";
					}
					html +=	"		<tr> "+
									"			<td colspan='4'><b>Data: </b>"+$('#data_descarga___' + linha).val()+"</td> "+
									"			<td colspan='4'><b>Ajudante: </b>"+$('#ajudante_descarga___' + linha).val()+"</td> "+
									"			<td colspan='4'><b>Valor: </b>"+$('#valor_descarga___' + linha).val()+"</td> "+
									"		</tr> ";

					if ($('#obs_descarga___' + linha).val() != '') {
					html +=	"		<tr> "+
									"				<td colspan='12'><b>Obs: </b>"+$('#obs_descarga___' + linha).val()+"</td> "+
									"		</tr> ";
					}
				}
			}
		});
		*/
		var vlr_tot_pago = isNull(validafunctions.getFloatValue('combustivel_pago'));
		var diesel_fatu = isNull(validafunctions.getFloatValue('combustivel_faturado'));

		var qtd_lts_pago = 0;
		var vlr_lts_pago = 0;
		var qtd_abs_pago = 0;
		

		var vlr_lts_tot = 0;
		var qtd_abs_tot = 0;
		var vlr_tot = vlr_tot_pago + diesel_fatu;

		$("input[name^=nome_posto___]").each(function (index, value) {
			var linha = validafunctions.getPosicaoFilho($(this).attr("id"));
			if ($(this).attr("id")[0] != '_') {
				// var s = $('#nome_posto___' + linha).val();
				if (index == 0) {
					html += "		<!-- ABASTECIMENTO --> " +
						"		<tr>" +
						"			<td class='noBorder'>" +
						"			</td>" +
						"		</tr>" +
						"		<tr> " +
						"			<td class='title' colspan='12'> " +
						"				<b>ABASTECIMENTO</b> " +
						"			</td> " +
						"		</tr> " +
						"		<tr> " +
						"			<td colspan='3'>Data: </td> " +
						"			<td colspan='3'>Posto: </td> " +
						"			<td colspan='2'>Qtd Litros: </td> " +
						"			<td colspan='2'>Valor Litro: </td> " +
						"			<td colspan='2'>Valor Total: </td> " +
						"		</tr> ";
				}
				console.log($('#nome_posto___' + linha).val().indexOf('PORMADE'))
				if ($('#nome_posto___' + linha).val().indexOf('PORMADE') !== -1) {
					html += "		<tr> " +
						"			<td colspan='3'>" + $('#data_abastecimento___' + linha).val() + "</td> " +
						"			<td colspan='3'>" + $('#nome_posto___' + linha).val() + "</td> " +
						"			<td class='right' colspan='2'>" + $('#qtd_litros_abastecimento___' + linha).val() + "</td> " +
						"			<td class='right' colspan='2'>" + $('#valor_litro_abastecimento___' + linha).val() + "</td> " +
						"			<td class='right' colspan='2'>" + $('#valor_abastecimento___' + linha).val() + "</td> " +
						"		</tr> ";
					if ($('#obs_abastecimento___' + linha).val() != '') {
						html += "		<tr> " +
							"			<td colspan='12'><b>Obs: </b>" + $('#obs_abastecimento___' + linha).val() + "</td> " +
							"		</tr> ";

					}

				}
			}
		});

		$("input[name^=nome_posto___]").each(function (index, value) {
			var linha = validafunctions.getPosicaoFilho($(this).attr("id"));
			if ($(this).attr("id")[0] != '_') {
				if ($('#nome_posto___' + linha).val() != '' && $('#nome_posto___' + linha).val().indexOf('PORMADE') == -1) {
					html += "		<tr> " +
						"			<td colspan='3'>" + $('#data_abastecimento___' + linha).val() + "</td> " +
						"			<td colspan='3'>" + $('#nome_posto___' + linha).val() + "</td> " +
						"			<td colspan='2'style='text-align: right;'>" + $('#qtd_litros_abastecimento___' + linha).val() + "</td> " +
						"			<td colspan='2'style='text-align: right;'>" + $('#valor_litro_abastecimento___' + linha).val() + "</td> " +
						"			<td colspan='2'style='text-align: right;'>" + $('#valor_abastecimento___' + linha).val() + "</td> " +
						"		</tr> ";
					if ($('#obs_abastecimento___' + linha).val() != '') {
						html += "		<tr> " +
							"			<td colspan='12'><b>Obs: </b>" + $('#obs_abastecimento___' + linha).val() + "</td> " +
							"		</tr> ";

					}
				}

				if ($('#cod_fatura___' + linha).val() == 'S') {
					qtd_lts_pago += isNull(validafunctions.getFloatValue('qtd_litros_abastecimento___' + linha));
					vlr_lts_pago += isNull(validafunctions.getFloatValue('valor_litro_abastecimento___' + linha));
					qtd_abs_pago += 1;
				}
				vlr_lts_tot += isNull(validafunctions.getFloatValue('valor_litro_abastecimento___' + linha));
				qtd_abs_tot += 1;
			}
		});

		if (qtd_lts_pago > 0) {
			html += "		<tr> " +
			"			<td colspan='6'>TOTAL PAGO</td> " +
			"			<td class='right' colspan='2'>" + String((qtd_lts_pago).toFixed(2)).replace('.', ',') + "</td> " +
			"			<td class='right' colspan='2'>" + String((vlr_lts_pago / qtd_abs_pago ).toFixed(2)).replace('.', ',') + "</td> " +
			"			<td class='right' colspan='2'>" + $('#combustivel_pago').val() + "</td> " +
			"		</tr> ";
		}
		
		html += "		<tr> " +
			"			<td colspan='6'><b>TOTAL GERAL</b></td> " +
			"			<td class='right' colspan='2'><b>" + $('#consumo').val() + "</b></td> " +
			"			<td class='right' colspan='2'><b>" + String((vlr_lts_tot / qtd_abs_tot).toFixed(2)).replace('.', ',') + "</b></td> " +
			"			<td class='right' colspan='2'><b>" + String((vlr_tot).toFixed(2)).replace('.', ',') + "</b></td> " +
			"		</tr> ";

		html += "		<tr> "+
			"			<td colspan='12' style='text-align: center;'>GERADO POR "+$('#user_fup').val().toUpperCase()+" EM "+ dateNow +" AS "+ timeNow +"</td> "+
			"		</tr> "+
			"	</table> " +
			" <div style='page-break-after:always'></div>";

		// RECIBO DIÀRIA
		var valDiaria = 0;

		valDiaria = $('#diaria').val();


		html += " <div style='height: 500px;'>" +
			"   <table style='width: 100%;' font size = 2 > " +
			"		  <tr> " +
			"			  <td class='title' colspan='12' > " +
			"				  <b>RECIBO DIÁRIA</b> " +
			"			  </td> " +
			"	 	  </tr> " +
			"		  <tr> " +
			"			  <td colspan='6' ><b>RECIBO:</b></td> " +
			"			  <td colspan='6' style='text-align: right;' >R$ " + valDiaria + "</b></td> " +
			"	 	  </tr> " +
			"		  <tr> " +
			"<td colspan='12' >" +
			"Recebi de TRANSPORTES RODOVIARIOS SBA LTDA, a importância de R$ " + valDiaria + " ( " + valDiaria.extenso(true) + " ) , referente pagamento de " +
			diffDays + " (" + String(diffDays).extenso() + ") diárias, estas indenizatória de despesas no período dos dias " + $('#data_saida').val() + " a " + $('#data_chegada').val() +
			"<br>" +
			"<br>" +
			"Por ser verdade firmo o presente recibo." +
			"<br>" +
			"</td> " +
			"	 	  </tr> " +
			"		  <tr style='text-align: right;'> " +
			"			  <td colspan='12' >" +
			"União da Vitória, " + hoje +
			"<br>" +
			"<br>" +
			"<b>________________________________________</b>" +
			"<br>" +
			$('#motorista').val() +
			"<br>" +
			cpf +
			"</td> " +
			"	 	  </tr> " +
			"   </table>" +
			" </div>";

		// VALE ADIANTAMENTO
		var valAdiantamento = isNull(validafunctions.getFloatValue("diferenca"), 0);

		if (valAdiantamento < 0) {
			valAdiantamento = String((valAdiantamento * (-1)).toFixed(2)).replace('.', ',')

			html += " <table style='width: 100%;' font size = 2 > " +
				"		<tr> " +
				"			<td class='title' colspan='12' > " +
				"				<b>VALE ADIANTAMENTO</b> " +
				"			</td> " +
				"		</tr> " +
				"		  <tr> " +
				"			  <td colspan='6' ><b>RECIBO:</b></td> " +
				"			  <td colspan='6' style='text-align: right;' >R$ " + valAdiantamento + "</b></td> " +
				"	 	  </tr> " +
				"		  <tr> " +
				"<td colspan='12' >" +
				"Recebi de TRANSPORTES RODOVIARIOS SBA LTDA, a importância de R$ " + valAdiantamento + " ( " + valAdiantamento.extenso(true) + " ), referente pagamento do adiantamento " +
				"de viagem, estas indenizatória de despesas no período dos dias " + $('#data_saida').val() + " a " + $('#data_chegada').val() +
				"<br>" +
				"<br>" +
				"Por ser verdade firmo o presente recibo." +
				"<br>" +
				"</td> " +
				"	 	  </tr> " +
				"		  <tr style='text-align: right;'> " +
				"			  <td colspan='12' >" +
				"União da Vitória, " + hoje +
				"<br>" +
				"<br>" +
				"<b>________________________________________</b>" +
				"<br>" +
				$('#motorista').val() +
				"<br>" +
				cpf +
				"</td> " +
				"	 	  </tr> " +
				" </table>";

			html += "	</body> " +
				"</html> ";

		}
		var WindowObject = window.open('', "PrintWindow", "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
		// WindowObject.document.writeln(DocumentContainer.innerHTML);
		WindowObject.document.writeln(html);
		// WindowObject.document.close();
		// WindowObject.focus();
		// WindowObject.print();
		// WindowObject.close();   


	} else {
		FLUIGC.toast({
			title: 'Alerta',
			message: 'Adicione ao menos um abastecimento',
			type: 'warning'
		});
	}
};


function pad(str, max) {
	str = str.toString();
	return str.length < max ? pad("0" + str, max) : str;
};

function sortChar(a, b) {
	return a - b;
};


function movimentActivity(completeTask, formData, selectedColleague, selectedState, showMessage, isAutomatic, onComplete, isReturn, passValue, subProcessId, subProcessSequence, hideModal, transferTaskAfterSelection) {

	var comments = "";
	var newObservations = [];
	if (parent.ECM_WKFView.wkfViewObservation) {
		comments = parent.ECM_WKFView.wkfViewObservation.getObservation();
		newObservations = parent.ECM_WKFView.wkfViewObservation.getUnsentObservations()
	}
	var _this = parent.ECM_WKFView,
		message = "",
		attachments = [];
	var pID = parent.ECM.workflowView.processDefinition.processInstanceId;
	this.newRequest = pID === 0;
	if (this.newRequest) {
		attachments = parent.WKFViewAttachment.getAllAttachments()
	}
	var senddata = {
		processInstanceId: pID,
		processId: parent.ECM.workflowView.processId,
		version: parent.ECM.workflowView.version,
		taskUserId: parent.ECM.workflowView.processDefinition.taskUserId,
		completeTask: completeTask,
		currentMovto: parent.ECM.workflowView.processDefinition.currentMovto,
		managerMode: parent.ECM.workflowView.processDefinition.managerMode ? true : false,
		selectedDestinyAfterAutomatic: _this.conditionsAutomatic.selectedDestinyAfterAutomatic,
		conditionAfterAutomatic: _this.conditionsAutomatic.conditionAfterAutomatic,
		selectedColleague: selectedColleague,
		comments: comments,
		newObservations: newObservations,
		appointments: parent.ECM.workflowView.appointments,
		attachments: attachments,
		pass: passValue,
		digitalSignature: parent.ECM.workflowView.digitalSignature,
		formData: formData,
		deleteUploadFiles: parent.ECM.workflowView.deleteUploadFiles,
		isDigitalSigned: parent.ECM.workflowView.isDigitalSigned,
		isLinkReturn: isReturn,
		versionDoc: parent.ECM.workflowView.processDefinition.versionDoc,
		selectedState: selectedState,
		internalFields: parent.ECM.workflowView.internalFields,
		subProcessId: subProcessId,
		subProcessSequence: subProcessSequence,
		transferTaskAfterSelection: transferTaskAfterSelection,
		currentState: parent.ECM.workflowView.sequence
	};
	parent.WCMAPI.Create({
		url: parent.ECM.restUrl + "workflowView/send",
		async: true,
		data: senddata,
		styleGuide: true,
		success: function (data) {

			parent.window.onbeforeunload = null;
			parent.location.reload(true);

		},
		error: function (err) {
			alert("error")
			//loading2.hide()
		},
		complete: function () {

		}
	})
}