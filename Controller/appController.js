var Task = require('../Model/appModel')

exports.list_all_tasks = (req,res)=>{
    Task.getAllClientes((err,task)=>{
        if(err)
            res.send(err);
        console.log('res',task)
        res.send(task);
    })
}
exports.read_a_client = (req,res)=>{
    Task.getClienteByCpf(req.params.CPF,req.params.Senha,(err,task)=>{
        if (err)
            res.send(err);
        res.json(task);
    })
}

exports.createCliente = (req,res) =>{
    var newCliente = new Task(req.body);
    if(!newCliente.idCliente){
        res.status(400).send({error:true,message:'Erro ao criar usuario.'})
    }else{
        Task.createCliente(newCliente,(err,task)=>{
            if(err)
            res.send(err);
        res.json(task)
        })
    }
}