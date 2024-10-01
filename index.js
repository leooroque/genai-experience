var application = require('./config/express')();

application.listen(3000, function(){
    console.log('Servidor rodando!');
})