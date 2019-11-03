var Task = require('../Model/appModel')
var Pessoa = require('../Model/cadastroModel')
var Cliente = require('../Model/ClienteModel')
var Cartao = require('../Model/CartaoModel')
var Transf = require('../Model/transferencia')

exports.list_all_tasks = (req, res) => {
    Task.getAllClientes((err, task) => {
        if (err)
            res.send(err);
        console.log('res', task)
        res.send(task);
    })
}
exports.DoLogin = (req,res)=>{
    var login = {cpf:req.body.cpf,senha:req.body.senha};
    if(!login){
        res.status(400).send({message:'Campos estão incorretos.'})
    }else{
        Cliente.getLogin(login,(err,message)=>{
            if(err){
                res.status(400).send(err);
            }else{
                res.json(message);
            }

        })
    }
}
exports.Pega15DiasTransacao = (req,res)=>{
    var login = {cpf:req.body.cpf,data:req.body.data};
    if(!login){
        res.status(400).send({message:'Campos estão incorretos.'})
    }else{
        Transf.List15Dias(login,(err,message)=>{
            if(err){
                res.status(400).send(err);
            }else{
                res.json(message);
            }
        })
    }
}

exports.read_a_client = (req, res) => {
    var getclient = new Task(req.body)
    if (getclient.cpfCliente && getclient.senhaCliente)
        Task.getClienteByCpf(getclient, (err, task) => {
            if (err)
                res.send(err);

            if (task.length == 0) {
                console.log('Login incorreto.')
                res.status(400).send('Login incorreto.')
            } else {
                res.status(200).json(task)
            }
        })
    else {
        res.status(400).send('Chamada incorreta')
    }
}
exports.read_a_clientId = (req, res) => {
    var getclient = new Task(req.body)
    if (getclient.idCliente)
        Task.getClienteById(getclient, (err, task) => {
            if (err)
                res.send(err);
            if (task.length == 0) {
                console.log('Id incorreto.')
                res.status(400).send('Id incorreto.')
            } else {
                var cliente = task[0];
                if(req.body.render === 'sustentabScreen.ejs' || req.body.render === 'dashTransfScreen.ejs'){
                    var datas = [];
                    var valores = [];
                    Cliente.getTotalTransf(getclient.idCliente,(err,result)=>{
                        if(err){
                            console.log("error: ",err);
                            res.status(400).send(err)

                        }else{
                            result.forEach(function(valor){
                                datas.push(months[valor.mes]);
                                valores.push(valor.total);
                            })
                            var info = {nomeP: cliente.nomePessoa, datas: datas, valores: valores

                            };
                            res.render(req.body.render, { info: info })
                        }
                    })
                }else{
                    var info = {
                        id: cliente.idCliente, saldo: formataDinheiro(cliente.saldoCliente), credito: formataDinheiro(cliente.creditoCliente), codcartao: cliente.codigoCartao.replace(/(\d{4}(?!\s))/g, "$1 "), nome: cliente.nomeCartao, dataven: cliente.dataVencimentoCartao.getMonth() + "/" + cliente.dataVencimentoCartao.getFullYear(),
                        nomeP: cliente.nomePessoa
                    };
                    res.render(req.body.render, { info: info })
                }
            }
        })
    else {
        res.status(400).send('Chamada incorreta')
    }
}

exports.createCliente = (req, res) => {
    var newCliente = new Task(req.body);
    if (!newCliente.cpfCliente) {
        res.status(400).send({ error: true, message: 'Erro ao criar usuario.' })
    } else {
        Task.createCliente(newCliente, (err, task) => {
            if (err)
                res.status(400).send(err);
            res.json(task)
        })
    }
}

//Pessoa Tasks;

exports.createPessoa = (req, res) => {
    console.log(req.body)
    var newPessoa = new Pessoa(req.body);
    console.log(newPessoa)
    if (!newPessoa.cpfPessoa) {
        res.status(400).send({ error: true, message: 'Erro ao criar pessoa.' })
    } else {
        Pessoa.createPessoa(newPessoa, (err, pessoa) => {
            if (err)
                res.status(400).send(err);
            else {
                Pessoa.getIdPessoa(newPessoa.cpfPessoa, (erro, resposta) => {
                    if (erro) {
                        res.status(400).send(erro);
                    } else {
                        if (resposta !== undefined) {
                            var newCliente = new Cliente({ saldoCliente: newPessoa.salarioPessoa, creditoCliente: newPessoa.salarioPessoa * 2, tipoContaCliente: 1, agenciaCliente: 1000, contaCliente: 1000, idPessoa: resposta })
                            Cliente.createCliente(newCliente, (err, cliente) => {
                                if (err) {
                                    res.status(400).send(err);
                                } else {
                                    Cliente.getIdClient(resposta, (err, idCliente) => {
                                        if (err) {
                                            res.status(400).send(err);
                                        } else {
                                            if (idCliente !== undefined) {
                                                let d = new Date();
                                                let year = d.getFullYear();
                                                let month = d.getMonth();
                                                let day = d.getDate();
                                                var newCartao = new Cartao({ idCliente: idCliente, nomeCartao: newPessoa.nomePessoa.split(" ")[0], codigoCartao: Math.floor(Math.random() * 10000000000000000), dataEmissaoCartao: d, dataVencimentoCartao: new Date(year + 8, month, day), senhaCartao: Math.floor(Math.random() * 1000) })
                                                Cartao.createCartao(newCartao, (err, cartao) => {
                                                    if (err) {
                                                        res.status(400).send(err);
                                                    } else {
                                                        res.render('cadastroFeito');
                                                    }
                                                })
                                            } else {
                                                console.log("idCliente voltou nulo.")
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    }
}

exports.list_all_pessoas = (req, res) => {
    Pessoa.getAllPessoas((err, pessoa) => {
        if (err)
            res.send(err);
        console.log('res', pessoa)
        res.send(pessoa);
    })
}

exports.RealizaTransferencia = (req,res,idUser,view)=>{
    console.log(req.body)
    Transf.ChecaExisteRecebedor(req.body.cpfPessoa,req.body.nomePessoa,(err,idPessoa)=>{
        if(err){
            res.status(400).send(err);
        }
        if(idPessoa !== undefined){
            if(!isInt(idPessoa)){
                var info = {status: 2,message:'Pessoa informada não existe.'}
                res.render(view,{info:info});
            }else{
                Cliente.getIdClient(idPessoa, (err, idCliente) => {
                    if(err){
                        res.status(400).send(err);
                    }else{
                        if (idCliente !== undefined) {
                            var newTransf = new Transf({valorTransacao:req.body.transfValor ,dataTransacao:new Date(), descricaoTransacao:"Transferencia", idCliente:idUser, tipoTransacao:1, idRecebedorTransacao:idCliente, agenciaTransacao:1000, contaTransacao: 100000})
                            Transf.FazTransfencia(newTransf,(err,result)=>{
                                if(err){
                                    res.send(err);
                                    console.log(err);
                                }else{
                                    if(result==="Processado com sucesso!"){
                                        var info = {status: 1}
                                        res.render(view,{info:info});
                                    }else if(result==="Saldo insuficiente."){
                                        var info = {status: 2,message:'Você não tem saldo suficiente para essa Transferência.'}
                                        res.render(view,{info:info});
                                    }
                                    else{
                                        console.log(result+"\n"+err)
                                        res.status(400).send(result);
                                    }
                                }
                                
                            })
                        }
                    }
                })
            }
            
        }
    })
}
var months =['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out','Nov','Dez']

function formataDinheiro(int) {
    //return n.toFixed(0).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
    var tmp = int+'';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if( tmp.length > 6 )
                tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

        return tmp;
}
function isInt(value) {
    var x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
  }