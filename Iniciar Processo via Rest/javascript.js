function startProcess() {
    var token = {
        'public': '',
        'secret': ''
    }; 
    var oauth = OAuth({
        consumer: {
            'public': '', 
            'secret': '' 
        },
        signature_method: 'HMAC-SHA1'
    });
    
    var request_data = {
            url: 'https://sua_url.com.br:8080/process-management/api/v2/processes/comunicacao_clientes/start',
            method: 'POST',
            ajaxData: JSON.stringify({
                'targetState': '102',
                'comment': "",
                'formFields': {
                   "empresa" : "01", //Opções = '01' (TANAC S.A.),'06' (TANAC S.A. RIO GRANDE);
                   "cnpj_cliente": "xx.xxx.xxx/xxxx-xx",
                   "nom_cliente": "Nome Cliente",
                   "cidade": "cidade",
                   "cod_cidade": "cod_cidade",
                   "den_cidade": "den_cidade",
                   "uf": "uf",
                   "pais": "pais",
                   "cod_pais": "cod_pais",
                   "cod_mercado": "cod_mercado",
                   "contato": "contato",
                   "telefone": "telefone",
                   "email": "email",
                   "cod_tipo": "cod_tipo", //Opções = '001' (Informações Sobre Produto),'002' (Consultas / Solicitações),'003' (Reclamações),'004' (Sugestões);
                   "resumo": "resumo",
                   "descricao": "descricao",
                }
            }),
            data: {}
    };
    
    $.ajax({
        url: request_data.url,
        type: request_data.method,
        data: request_data.ajaxData,
        contentType: "application/json",
        headers: oauth.toHeader(oauth.authorize(request_data, token)),
        success: function(data) {
            console.log(data);
            console.log(data.processInstanceId);  //processo Fluig
        },
        error: function(xhr, status, error) {
            console.log(xhr, status, error);
        }
    });
};
