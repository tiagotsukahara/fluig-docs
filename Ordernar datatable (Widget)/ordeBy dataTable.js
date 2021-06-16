orderBy: function(htmlElement, event){
    var order = htmlElement.getAttribute('data-order-by');
    
    dados = dataTable.getData();
    
    if( htmlElement.children[1].classList.contains("dropup") ){
        this.orderAscDesc = "ASC";
    }else{
        this.orderAscDesc = "DESC";
    }
    
    if( htmlElement.children[1].classList.contains("dropup") ){
        //this.orderAscDesc = "ASC";
        dados.sort(function(a, b){
            var a1= a[order].toLowerCase(), b1= b[order].toLowerCase();
            if(a1== b1) return 0;
            return a1 > b1? 1: -1;
        });
    }else{
        //this.orderAscDesc = "DESC";
        dados.sort(function(a, b){
            var a1= a[order].toLowerCase(), b1= b[order].toLowerCase();
            if(a1== b1) return 0;
            return a1 < b1? 1: -1;
        });
    }

    dataTable.reload(dados);
},