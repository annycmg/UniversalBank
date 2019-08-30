const sql = require('../connect')

//o modelo de banco para ser pesquisado.
var Task = function(task){
    this.idCliente =task.idCliente;
    this.nomeCliente = task.nomeCliente;
    this.senhaCliente = task.senhaCliente;
    this.cpfCliente = task.cpfCliente;
    this.dataNascimentoCliente = task.dataNascimentoCliente;
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

Task.createCliente = (newCliente,result)=>{
    sql.connection.query("insert into Cliente set ?",newCliente,(err,res)=>{
        if(err){
            console.log('Error: ',err)
            result(err,null)
        }else{
            if(res.insertId == 0){
                result(null,'cliente inserido com sucesso!')
            }else{
                result(null,'Houve algum problema')
            }
            result(null,res.idCliente)
        }
    })
}

module.exports = Task;