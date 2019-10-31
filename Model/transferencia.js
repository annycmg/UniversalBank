const sql = require('../connect')

var Transf = function(transf){
    this.idTransacao = transf.idTransacao;
    this.valorTransacao = transf.valorTransacao.replace(/[.,\s]/g,'');
    this.dataTransacao = transf.dataTransacao;
    this.descricaoTransacao = transf.descricaoTransacao;
    this.idCliente = transf.idCliente;
    this.tipoTransacao = transf.tipoTransacao;
    this.idRecebedorTransacao = transf.idRecebedorTransacao;
    this.agenciaTransacao = transf.agenciaTransacao;
    this.contaTransacao = transf.contaTransacao;
}


Transf.ChecaExisteRecebedor = (cpf,nome,result)=>{
    sql.connection.query("select * from Pessoa where cpfPessoa = ? and nomePessoa = ?",[cpf,nome],(err,res)=>{
        if(err){
            console.log('Error: ',err)
            result(err,null)
        }else{
            if(result.lenght == 0){
                result(null,'Cliente recebedor não cadastro ou não existe.');
            }else{
                result(null,res[0].idPessoa)
            }
        }
    })
}


Transf.FazTransfencia = (newTransf,result)=>{
    //Verifica se o usuário tem dinheiro disponivel para essa transação.
    sql.connection.query("select saldoCliente from Cliente where idCliente = ?",newTransf.idCliente,(err,res)=>{
        if(err){
            console.log('Error: ',err)
            result(err,null)
        }else{
            if(res.message == ''){
                if(!(res[0].saldoCliente >= newTransf.valorTransacao)){
                    result(null,'Saldo insuficiente.')
                }
            }
        }
    })
    // Realiza a transação
    sql.connection.query("insert into Transacao set ?",newTransf,(err,res)=>{
        if(err){
            console.log('Error: ',err)
            result(err,null)
        }else{
            if(res.message == ''){
                console.log('Inserido transação no banco')
               // result(null,'Transacão feita com sucesso!')
            }else{
                result('Houve algum problema' + res.message,null)
            }
        }
    })
    //Retira o valor da conta original
    sql.connection.query("update Cliente set saldoCliente = saldoCliente - '"+newTransf.valorTransacao+"' where idCliente = ?",newTransf.idCliente,(err,res)=>{
        if(err){
            console.log('Error: ',err)
            result(err,null)
        }else{
            if(res.message != "(Rows matched: 1  Changed: 1  Warnings: 0"){
                result('Houve algum problema' + res.message,null)
            }
            else{
                console.log('Retirado o valor da conta')
            }

        }
    })

    //Adiciona a valor na conta recebedora
    sql.connection.query("update Cliente set saldoCliente = saldoCliente + '"+newTransf.valorTransacao+"' where idCliente = ?",newTransf.idRecebedorTransacao,(err,res)=>{
        if(err){
            console.log('Error: ',err)
            result(err,null)
        }else{
            if(res.message != "(Rows matched: 1  Changed: 1  Warnings: 0"){
                result('Houve algum problema' + res.message,null)
            }else{
                console.log('Acrescentado valor na conta')
                result(null,'Processado com sucesso!');
            }
            
        }
    
    })
    
}

module.exports = Transf