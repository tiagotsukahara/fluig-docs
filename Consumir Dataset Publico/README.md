No arquivo dataset.js, substituir as chaves abaixo com o usuário de aplicativo criado no fluig e substituir a url
```javascript
token = {  
            'public': '',  
            'secret': ''  
        };  
consumer: {  
            'public': '',   
            'secret': ''   
        },
```

```
var url = 'SUA URL' // ou WCMAPI.getServerURL(); para widget fluig
```
            
No arquivo javascript.js, substituir as constraints e nome do dataset pelo fornecido.  

```javascript
const constraintDS = [  
    publicDataset.createConstraint("NOME_DO_CAMPO", 'VALOR', 'VALOR', ConstraintType.MUST),  
];  

publicDataset.getDataset("DATASET_FORNECIDO", null, constraintDS, null, {  
    success: data => {  
      if (data.hasOwnProperty("values") && data.values.length > 0) {  
        console.log(data.values);  
      }  
    }  
});
```
