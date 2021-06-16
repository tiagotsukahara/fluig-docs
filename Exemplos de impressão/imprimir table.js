// bind
'load-imprimir': ['click_imprimir'],

imprimir: function(el, ev){		
    //Declarar variáveis globais rContent e rHeader e dataTable da table
    var selected = tbl_Oms.getRow(tbl_Oms.selectedRows()[0]);
    var rContent = rcOms;
    var rHeader = rhOms;
    var data = tbl_Oms.getData();

    var html = " <!DOCTYPE html> "+
                " <html> "+
                " 	<head> "+
                " 		<style> "+
                " 			table, th, td { "+
                " 				border: 1px solid black; "+
                " 				border-collapse: collapse; "+
                " 			} "+
                " 			th, td { "+
                " 				padding: 5px; "+
                " 			} "+
                " 		</style> "+
                " 	</head> "+
                " <body> ";            

    var htmlColumn = "";    
    
    for( var j = 0; j < rContent.length; j++ ){
        console.log('header......', rContent[j], rHeader[j]['title'], rHeader[j]['width'] );
        if( rHeader[j]['width'] != '0'
            && rHeader[j]['width'] != '0%'
            && rHeader[j]['width'] != undefined ){
            htmlColumn += " <td style='width:  "+ rHeader[j]['width'] +";' style='font-size: 8px;' > "+ rHeader[j]['title'] +" </td> "
        }
    }    
    
    html += "<table style='width:  100%;' >" +
            "	<tr>" +
            "		<td align='center' >" +
            "			<b> Resumo Viagem: "+ selected.viagem +"</b>" +
            "		</td>" +
            "	</tr>" +
            "</table>" +
            "</br>" +
            "<table style='width:  100%;' border='1' >" +
            "	<tr>" +
            " 		"+ htmlColumn +
            "	</tr> ";
    
    for(var i = 0; i < data.length; i++ ){
        // console.log('entrou...... print ');
        
        html += "<tr  style='font-size: 8px;' >";

        for( var j = 0; j < rContent.length; j++ ){
                if( rHeader[j]['width'] != '0'
                    && rHeader[j]['width'] != '0%'
                    && rHeader[j]['width'] != undefined ){
                    if( rContent[j] != 'matricula' && rContent[j] != 'usuario' ){
                        html += " <td> "+ data[i][rContent[j]] +" </td> ";
                    }
                }
        }
        html += "</tr> ";
    }
    
    html += "</table>"+
            "</body> "+
            "</html> "; 	

    // console.log('html.....',html);
    
    var WindowObject = window.open('', "PrintWindow", "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
    //WindowObject.document.writeln(DocumentContainer.innerHTML);
    WindowObject.document.writeln(html);
    WindowObject.document.close();
    WindowObject.focus();
    WindowObject.print();
    WindowObject.close();
    // modalOM.remove();

},