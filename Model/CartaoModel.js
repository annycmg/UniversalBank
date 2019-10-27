const sql = require('../connect')


var Cartao = function(cartao){
    this.idCliente = cartao.idCliente;
    this.nomeCartao = cartao.nomeCartao;
    this.codigoCartao = cartao.codigoCartao;
    this.dataEmissaoCartao = cartao.dataEmissaoCartao;
    this.dataVencimentoCartao = cartao.dataVencimentoCartao;
    this.senhaCartao = cartao.senhaCartao;
}

Cartao.createCartao = (newCartao,result)=>{
    sql.connection.query("insert into Cartao set ?",newCartao,(err,res)=>{
        if(err){
            console.log('Error: ',err)
            result(err,null)
        }else{
            if(res.message == ''){
                result(null,'Cartao inserido com sucesso!')
                console.log("Cartao criado com sucesso.");
            }else{
                result(null,'Houve algum problema' + res.message)
            }
        }
    })
}

module.exports = Cartao