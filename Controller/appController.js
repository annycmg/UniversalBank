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
    var getclient = new Task(req.body)
    if(getclient.cpfCliente && getclient.senhaCliente)
    Task.getClienteByCpf(getclient,(err,task)=>{
        if (err)
            res.send(err);
        
        if(task.length == 0){
        console.log('Login incorreto.')
        res.status(400).send('Login incorreto.')
        }else{
            res.status(200).json(task)
        }
    })
    else{
        res.status(400).send('Chamada incorreta')
    }
}

exports.createCliente = (req,res) =>{
    var newCliente = new Task(req.body);
    if(!newCliente.cpfCliente){
        res.status(400).send({error:true,message:'Erro ao criar usuario.'})
    }else{
        Task.createCliente(newCliente,(err,task)=>{
            if(err)
            res.status(400).send(err);
        res.json(task)
        })
    }
}