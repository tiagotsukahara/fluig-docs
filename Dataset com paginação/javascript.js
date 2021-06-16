var dataTable = null;
var dadosDatatable = [];
var rContent = [];
var rHeader = [];

function loadDataTable(){
  // console.log('loadReceitas');
  rContent = ['nom_funcionario','cod_usuario','cod_usuario_rm','cod_usuario_fluig'];
                  
  rHeader = [ {'title': 'Nome','dataorder': 'nom_funcionario','width':'10%' },
              {'title': 'Logix','dataorder': 'cod_usuario','width':'10%' },
              {'title': 'RM','dataorder': 'cod_usuario_rm','width':'10%' },
              {'title': 'Fluig','dataorder': 'cod_usuario_fluig','width':'10%' },
            ];
  
  dataTable = FLUIGC.datatable('#idtable_' + $this.instanceId, {
  dataRequest: dadosDatatable,
  renderContent: rContent,
  limit:10,
  responsive: true,
  tableStyle:'table table-striped table-responsive table-bordered table-condensed',
  emptyMessage: '<div class="text-center">Nenhum dado encontrado!</div>',
  header: rHeader,			  	
    search: {
      enabled: false,
        onSearch: function(res) {
          console.log( res );
            var data = dadosDatatable;
            var search = data.filter(function(el) {
                return (el.data_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 || 
                        el.tipo_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 || 
                        el.valor_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 || 
                        el.valor_ajuda_custo.toUpperCase().indexOf(res.toUpperCase()) >= 0 ) 
            });
            dataTable.reload(search); 
        },
        onlyEnterkey: false,
        searchAreaStyle: 'col-md-3'
    },
  scroll: {
        target: '#idtable_'+$this.instanceId,
        enabled: false
      },
  navButtons: {
        enabled: false,
      },
  draggable: {
        enabled: false
      },

  }, function(err, data) {
    if (err) {
        FLUIGC.toast({
          message: err,
          type: 'danger'
        });
      }else{
        loadWindow.hide();
      }
  });

  loadDadosDataTable();

}

function loadDadosDataTable(){
  loadWindow.show();
  var SQL =   "select * "+
              "    from usuarios p "+
              "where (select count(*) from log_usu_bloq "+
              "       where usuario = p.cod_usuario "+
              "       and today between nvl(dat_ini_bloqueio,today) "+
              "       and nvl(dat_fim_bloqueio,today) ) = 0 ";

  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint("SQL", SQL ,SQL, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/LogixDS' ,null, ConstraintType.MUST));

  var callback = {
      success: function(dataSet) {
          console.log(dataSet.values);
          if( dataSet != null && dataSet != undefined ){

              $("#paginationTable").pagination({
                dataSource: dataSet.values,
                pageSize: 10,
                showGoInput: true,
                showGoButton: true,
                // autoHidePrevious: true,
                // autoHideNext: true,
                formatResult: function(data) {
                  var regs = new Array();
                  for (var i = 0, len = data.length; i < len; i++) {
                      var datatableRow = {  cod_usuario: data[i]['cod_usuario'],
                                            nom_funcionario: data[i]['nom_funcionario']
                      }
                      regs.push(datatableRow);                      
                  }
                  return regs;
                },
                callback: function(paginatedData, pagination){
                  console.log(paginatedData, pagination);
                    dataTable.reload(paginatedData);
                    loadWindow.hide();
                }
              });
          } else {
              toast('Nenhum dado encontrado', 'warning');
          }  
              
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR, textStatus, errorThrown);
      }
  };

  var dataSet = DatasetFactory.getDataset("select", null, constraints, null, callback);  
  
}