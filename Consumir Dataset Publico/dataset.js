const publicDataset = {

    retornaToken: function(){
        var token = {
                'public': '',
                'secret': ''
        }; 
        return token;
    },
    retornaOauth: function() {
        var oauth = OAuth({
            consumer: {
                'public': '', 
                'secret': '' 
            },
            signature_method: 'HMAC-SHA1'
        });
        return oauth;
    },
    createConstraint: function(field, initialValue, finalValue, type, likeSearch) {
        return {
            "_field": field,
            "_initialValue": initialValue,
            "_finalValue": finalValue,
            "_type": type || 1,
            "_likeSearch" : likeSearch || false
        };
    },
    getDataset: function(datasetName, fields, constratins, order, cb) {
        console.log(datasetName, fields, constratins, order);
        var self = this;
        var url = WCMAPI.getServerURL();
        var d = $.Deferred();
        var token = this.retornaToken();
        var oauth = this.retornaOauth();
        var request_data = {
                url: url+'/api/public/ecm/dataset/datasets', 
                method: 'POST',
                ajaxData: JSON.stringify({ 
                    "name":datasetName,
                    "fields": fields || [],
                    "constraints":constratins || [],
                    "order": order || []
                }),
                data: {}
        };
        
        $.ajax({
            url: request_data.url,
            type: request_data.method,
            data: request_data.ajaxData,
            contentType: "application/json",
            headers: oauth.toHeader(oauth.authorize(request_data, token))
        }).pipe(function(p){
            return p.content;
        }).done(function(result){
            d.resolve(result);
            cb.success(result);
        }).fail(function(data){
            console.log(data)
            d.reject
            cb.error(data);
        });

        return d;
    },


}
