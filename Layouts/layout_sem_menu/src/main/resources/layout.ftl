<#import "/wcm.ftl" as wcm/>

<#if pageRender.isEditMode()=true>
    <@wcm.header />
</#if>


<!-- WCM Wrapper content -->
<div class="wcm-wrapper-content">

    <!-- Wrapper -->
        <div id="wcm-content" class="clearfix">

            <!-- Onde deverá estar a barra de formatação -->
            <#if pageRender.isEditMode()=true>
                <div name="formatBar" id="formatBar"></div>
                <!-- Div geral -->
                <!-- Há CSS distinto para Edição/Visualização -->
            <div id="edicaoPagina" class="clearfix">
            <#else>
            <div id="visualizacaoPagina" class="clearfix">
            </#if>
                <!-- Slot 1 -->
                <div class="editable-slot slotfull layout-1-1" id="slotFull1">
                    <@wcm.renderSlot id="SlotA" editableSlot="true"/>
                </div>

                <!-- Slot 2 -->
                <div class="editable-slot slotfull layout-1-1" id="slotFull2">
                    <@wcm.renderSlot id="SlotB" editableSlot="true"/>

            </div>            

        </div>
	
</div>
