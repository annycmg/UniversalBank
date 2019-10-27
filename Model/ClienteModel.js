const sql = require('../connect')

var Cliente = function(cliente){
    this.saldoCliente = cliente.saldoCliente;
    this.creditoCliente = cliente.creditoCliente;
    this.tipoContaCliente = cliente.tipoContaCliente;
    this.agenciaCliente = cliente.agenciaCliente;
    this.contaCliente = cliente.contaCliente;
    this.idPessoa = cliente.idPessoa;
}

Cliente.getIdClient = (idPessoa,result)=>{
    sql.connection.query('select idCliente from Cliente where idPessoa = ?',[idPessoa],(err,res)=>{
        if(err){
            console.log("error ao pegar id",err);
        }else{
            if(result.lenght == 0){
                result(null,'Consulta não retornou resultados.')
            }else{
                result(null,res[0].idCliente)
            }
        }
    })
}

Cliente.createCliente = (newCliente,result)=>{
    sql.connection.query("insert into Cliente set ?",newCliente,(err,res)=>{
        if(err){
            console.log('Error: ',err)
            result(err,null)
        }else{
            if(res.message == ''){
                result(null,'Cliente inserida com sucesso!')
                console.log("Cliente criado com sucesso.");
            }else{
                result(null,'Houve algum problema' + res.message)
                console.log(res.message);
            }
        }
    })
}

module.exports = Cliente