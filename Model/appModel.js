const sql = require('../connect')

//o modelo de banco para ser pesquisado.
var Task = function(task){
    this.idCliente =task.idCliente;
    this.totalCliente = task.totalCliente;
    this.creditoCliente = task.creditoCliente;
    this.tipoContaCliente = task.tipoContaCliente;
    this.agenciaCliente = task.agenciaCliente;
    this.contaCliente = task.contaCliente;
    this.idPessoa = task.idPessoa;
}

Task.getAllClientes = (result)=>{
    sql.connection.query('Select * from Cliente',(err,res)=>{
        if(err){
            console.log('error: ',err)
            result(null,err);
        }else{
            console.log('tasks :',res)

            result(null,res);
        }
    })
}
Task.getClienteByCpf = (client,result)=>{
    sql.connection.query("Select * from Cliente where cpfCliente = ? and senhaCliente = ?",[client.cpfCliente,client.senhaCliente],(err,res)=>{
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);

        }
    })
}
Task.getClienteById = (client,result)=>{
    sql.connection.query("SELECT * FROM `UniversalBank`.`Cliente` t1 inner join `UniversalBank`.`Pessoa` t2 on t1.idPessoa = t2.idPessoa where idCliente = ?",[client.idCliente],(err,res)=>{
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);

        }
    })
}

Task.createCliente = (newCliente,result)=>{
    sql.connection.query("insert into Cliente set ?",newCliente,(err,res)=>{
        if(err){
            console.log('Error: ',err)
            result(err,null)
        }else{
            if(res.message == ''){
                result(null,'cliente inserido com sucesso!')
            }else{
                result(null,'Houve algum problema' + res.message)
            }
            result(null,res.cpfCliente)
        }
    })
}

module.exports = Task;