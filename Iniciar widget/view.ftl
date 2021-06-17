<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>

<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
    <form class="form-horizontal">
		<#--  Título  -->
        <div class="row page-header">
            <div class="col-md-10 fs-no-padding">
                <h1 id="page_title"></h1>
            </div>
            <div class="col-md-2 fs-no-padding fs-cursor-pointer">
				<div class="pull-right">
                	<h1 class="fluigicon fluigicon-info-sign icon-md bs-docs-popover-hover"></h1>
				</div>
            </div>
        </div>

        <#--  Painel  -->
        <div class="panel panel-default">
            <#--  Header  -->
			<div class="panel-heading">
				<h4 class="panel-title">
					<a class="collapse-icon up" data-toggle="collapse" data-parent="#accordion" href="#collapseGeral" aria-expanded="true">Filtros</a>
				</h4>
			</div>
            <#--  Body  -->
            <div id="collapseGeral" class="panel-collapse collapse in" aria-expanded="true">
				<div class="panel-body">
					<div class="row">

						<div class="col-md-1">
							<label class="control-label" for="num_chamado_${instanceId}">Chamado</label>
							<input type="text" class="form-control integer-0" name="num_chamado_${instanceId}" id="num_chamado_${instanceId}" />
						</div>

						<div class="col-md-2">
							<label class="control-label" for="situacao_${instanceId}">Situação</label>
							<select class="form-control" name="situacao_${instanceId}" id="situacao_${instanceId}">
								<option value='A' selected>Aberto</option>
								<option value='F' >Fechado</option>
								<option value='C' >Cancelado</option>
							</select>
						</div>

                        <div class="col-sm-4">
							<label class="control-label" for="txtNome">Título</label>
							<div class="input-group">
								<input name="motorista_${instanceId}" id="motorista_${instanceId}" type="text" class="form-control">
							</div>
						</div>

						<div class="col-md-2">
							<label class="control-label">&nbsp;</label>
							<div class="input-group">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default" data-load-filtrar >Filtro</button>
                                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                        <span class="caret"></span>
                                        <span class="sr-only">Toggle Dropdown</span>
                                    </button>
                                    <ul class="dropdown-menu" role="menu">
                                        <#--  <li data-gera-pagamento-bloco id="btGeraPagamento" ><a href="#">Gerar Pagamento</a></li>  -->
                                        <#--  <li class="divider"></li>  -->
                                        <li data-load-imprimir id="btImprimir" ><a href="#">Imprimir</a></li>
                                        <li data-load-excel id="loadExcel" ><a href="#">Exportar Excel</a></li>
                                    </ul>
                                </div>
							</div>
						</div>
					</div>
                
				</div>
			</div>
        </div>

		<#--  table para listar dados  -->
		<div class="row">
			<div class="col-md-12">
				<div id="idtable_${instanceId}"></div>					
			</div>
		</div>
    </form>
</div>