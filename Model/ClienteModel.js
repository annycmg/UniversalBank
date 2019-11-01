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
            if(result.length == 0){
                result(null,'Consulta não retornou resultados.')
            }else{
                result(null,res[0].idCliente)
            }
        }
    })
}

Cliente.getTotalTransf = (idCliente, result)=>{
    sql.connection.query('select MONTH( `dataTransacao` ) as mes,sum(`valorTransacao`) AS total from UniversalBank.Transacao where idCliente = ? group by YEAR( `dataTransacao` ), MONTH( `dataTransacao` );',idCliente,(err,res)=>{
        if(err){
            console.log("error: ",err);
        }else{
            if(res.length > 0){
                result(null,res);
            }else{
                result('Não tem valores.',null);
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

Cliente.getLogin= (login,rest)=>{
    sql.connection.query("SELECT * FROM `UniversalBank`.`Cliente` t1 inner join `UniversalBank`.`Pessoa` t2 on t1.idPessoa = t2.idPessoa inner join `UniversalBank`.`Cartao` t3 on t1.idCliente = t3.idCliente where t2.cpfPessoa = ? and t2.senhaPessoa = ?", [login.cpf, login.senha], (err, result) => {
        if (err) {
            console.log("error: ", err);
            rest(err,null);
        }
        else {
            if (result.length == 0) {
                rest('CPF/Senha incorreto.',null)
            } else {
                var dados = {saldo:result[0].saldoCliente,numCartao:result[0].codigoCartao,nome:result[0].nomePessoa}
                console.log(result[0])
                rest(null,dados)
            }

        }
    })
}
module.exports = Cliente