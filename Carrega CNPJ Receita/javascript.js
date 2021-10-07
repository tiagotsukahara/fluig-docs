function carrega_cnpj(cnpj){
    var wcnpj = cnpj.replace(/\D/g, '');
    // console.log(cnpj);
    if (wcnpj != "") {
        var validacnpj = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/g;
        if(validacnpj.test(wcnpj)) {
            
            var url = "https://www.receitaws.com.br/v1/cnpj/"+ wcnpj
            console.log("teste "+url);
            $.ajax({
                type: "GET",
                dataType: "jsonp",
                url: url,
                crossDomain: true,
                data: "",
                timeout: 3000,
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    FLUIGC.toast({ title: '',message: 'CNPJ pesquisado não foi encontrado na receita' , type: 'warning' });
                },
                success: function (data, status, xhr) {
                    console.log(data);
                    $("#nome").val(data.nome);
                    $('#atividade').val(data.atividade_principal[0]['text']);
                    $("#cep").val(data.cep.replace(".",""));
                    $("#numero").val(data.numero);
                    $("#bairro").val(data.bairro);
                    $("#site").val(data.complemento);
                    $("#endereco").val(data.logradouro);
                }
            });
        }else{
            //cnpj é inválido.
            // limpa_formulario_cnpj();
            console.log("teste "+validacnpj)
            FLUIGC.toast({ title: '',message: 'Formato de CNPJ inválido.' , type: 'warning' });
        }
    } else {
        // limpa_formulario_cnpj();
    }
}