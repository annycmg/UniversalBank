const sql = require('../connect')

var Transf = function (transf) {
    this.idTransacao = transf.idTransacao;
    this.valorTransacao = transf.valorTransacao.replace(/[.,\s]/g, '');
    this.dataTransacao = transf.dataTransacao;
    this.descricaoTransacao = transf.descricaoTransacao;
    this.idCliente = transf.idCliente;
    this.tipoTransacao = transf.tipoTransacao;
    this.idRecebedorTransacao = transf.idRecebedorTransacao;
    this.agenciaTransacao = transf.agenciaTransacao;
    this.contaTransacao = transf.contaTransacao;
}


Transf.ChecaExisteRecebedor = (cpf, nome, result) => {
    sql.connection.query("select * from Pessoa where cpfPessoa = ? and nomePessoa = ?", [cpf.replace(/[^\d]+/g, ''), nome], (err, res) => {
        if (err) {
            console.log('Error: ', err)
            result(err, null)
        } else {
            if (res.length == 0) {
                result(null, 'Cliente recebedor não cadastro ou não existe.');
            } else {
                result(null, res[0].idPessoa)
            }
        }
    })
}

Transf.List15Dias = (dados,rest)=>{

    sql.connection.query("SELECT t4.* FROM `UniversalBank`.`Cliente` t1 inner join `UniversalBank`.`Pessoa` t2 on t1.idPessoa = t2.idPessoa inner join `UniversalBank`.`Cartao` t3 on t1.idCliente = t3.idCliente inner join `UniversalBank`.`Transacao` t4 on t3.idCliente = t4.idCliente where t4.dataTransacao between DATE_SUB(?, INTERVAL 15 DAY) and ? and t2.cpfPessoa = ?",[dados.data,dados.data,dados.cpf],(err,result)=>{
        if (err) {
            console.log("error: ", err);
            rest(err,null);
        }
        else {
            if (result.length == 0) {
                rest('dado incorreto.',null)
            } else {
                console.log(result[0])
                rest(null,result)
            }

        }
    })
}


Transf.FazTransfencia = (newTransf, result) => {

    //Verifica se o usuário tem dinheiro disponivel para essa transação.
    sql.connection.query("select saldoCliente from Cliente where idCliente = ?", newTransf.idCliente, (err, res) => {
        if (err) {
            console.log('Error: ', err)
            result(err, null)
        } else {
            if (res.length == 1) {
                if (!(res[0].saldoCliente >= newTransf.valorTransacao)) {
                    result(null, 'Saldo insuficiente.')
                } else {
                    // Realiza a transação
                    sql.connection.query("insert into Transacao set ?", newTransf, (err, res) => {
                        if (err) {
                            console.log('Error: ', err)
                            result(err, null)
                        } else {
                            if (res.message == '') {
                                console.log('Inserido transação no banco')
                                // result(null,'Transacão feita com sucesso!')
                                //Retira o valor da conta original
                                sql.connection.query("update Cliente set saldoCliente = saldoCliente - '" + newTransf.valorTransacao + "' where idCliente = ?", newTransf.idCliente, (err, res) => {
                                    if (err) {
                                        console.log('Error: ', err)
                                        result(err, null)
                                    } else {
                                        if (res.message != "(Rows matched: 1  Changed: 1  Warnings: 0") {
                                            result('Houve algum problema' + res.message, null)
                                        }
                                        else {
                                            console.log('Retirado o valor da conta')
                                            //Adiciona a valor na conta recebedora
                                            sql.connection.query("update Cliente set saldoCliente = saldoCliente + '" + newTransf.valorTransacao + "' where idCliente = ?", newTransf.idRecebedorTransacao, (err, res) => {
                                                if (err) {
                                                    console.log('Error: ', err)
                                                    result(err, null)
                                                } else {
                                                    if (res.message != "(Rows matched: 1  Changed: 1  Warnings: 0") {
                                                        result('Houve algum problema' + res.message, null)
                                                    } else {
                                                        console.log('Acrescentado valor na conta')
                                                        result(null, 'Processado com sucesso!');
                                                    }

                                                }

                                            })
                                        }

                                    }
                                })

                            } else {
                                result('Houve algum problema' + res.message, null)
                            }
                        }
                    })
                }
            }
        }
    })






}

module.exports = Transf