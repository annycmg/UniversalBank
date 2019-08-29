const sql = require('../connect')

//o modelo de banco para ser pesquisado.
var Task = (task)=>{
    this.task =task.task;
    this.status = task.status;
    this.criada_em = new Date();
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
Task.getClienteByCpf = (clientId,result)=>{
    sql.connection.query("Select * from Cliente where cpfCliente = ?", clientId,(err,res)=>{
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);

        }
    })
}

module.exports = Task;