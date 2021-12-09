<#--  table para listar dados  -->
<div class="row">
    <div class="col-md-1">
        <select class="form-control" id="pagesize" name="pagesize">
            <option value='10' selected>10</option>
            <option value='30'>30</option>
            <option value='50'>50</option>
        </select>
    </div>
    <div class="col-md-12">
        <div id="idtable_${instanceId}"></div>					
    </div>
    <div class="col-md-6 col-md-offset-4">
        <div id="paginationTable"></div>
    </div> 
</div>