var Task = require('../Model/appModel')
var Pessoa = require('../Model/cadastroModel')

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
exports.read_a_clientId = (req,res)=>{
    var getclient = new Task(req.body)
    if(getclient.idCliente)
    Task.getClienteById(getclient,(err,task)=>{
        if (err)
            res.send(err);
        if(task.length == 0){
        console.log('Id incorreto.')
        res.status(400).send('Id incorreto.')
        }else{
            res.render(req.body.render,{ message: task[0].nomeCliente })
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

//Pessoa Tasks;

exports.createPessoa = (req,res)=>{
    console.log(req.body)
    var newPessoa = new Pessoa(req.body);
    console.log(newPessoa)
        if(!newPessoa.cpfPessoa){
            res.status(400).send({error:true,message:'Erro ao criar pessoa.'})
        }else{
            Pessoa.createPessoa(newPessoa,(err,pessoa)=>{
                if(err)
                res.status(400).send(err);
                else{
            res.json(pessoa)}
            })
        }
}

exports.list_all_pessoas = (req,res)=>{
    Pessoa.getAllPessoas((err,pessoa)=>{
        if(err)
            res.send(err);
        console.log('res',pessoa)
        res.send(pessoa);
    })
}