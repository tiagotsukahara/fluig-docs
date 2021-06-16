// bind
'load-excel': ['click_loadExcel'],

loadExcel: function(el, ev){

    var idTable = "";
    $("table[id^=fluig-table-]", '#idtable' + '_' + $this.instanceId).each(function(index){
        idTable = $(this).attr("id");
    });
    
    //Nome arquivo
    var fileName = 'geraInventario_'+WCMAPI.getUserLogin()+'_'+$.now(); 
    
    $("#"+idTable).btechco_excelexport({
                containerid: idTable,
                datatype: $datatype.Table,
                returnUri: true,
                filename: fileName
    });		 

},    