const Task = require('../Model/appModel')

exports.list_all_tasks = (req,res)=>{
    Task.getAllClientes((err,task)=>{
        console.log('Acessando Controller')
        if(err)
            res.send(err);
        console.log('res',task)
        res.send(task);
    })
}
exports.read_a_client = (req,res)=>{
    Task.getClienteByCpf(req.params.CPF,(err,task)=>{
        if (err)
            res.send(err);
        res.json(task);
    })
}