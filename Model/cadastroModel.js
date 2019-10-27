const sql = require('../connect')


var Pessoa = function(pessoa){
    this.nomePessoa = pessoa.nomePessoa;
    this.emailPessoa =pessoa.emailPessoa;
    this.cpfPessoa = pessoa.cpfPessoa.replace(/[^\d]+/g,'');
    this.rgPessoa = pessoa.rgPessoa.replace(/[^\d]+/g,'');
    this.telefonePessoa = pessoa.telefonePessoa;
    this.celularPessoa =pessoa.celularPessoa;
    this.generoPessoa = pessoa.generoPessoa;
    this.salarioPessoa = pessoa.salarioPessoa.replace(/[.,\s]/g,'');
    this.enderecoPessoa = pessoa.enderecoPessoa;
    this.cepPessoa = pessoa.cepPessoa.replace(/[^\d]+/g,'');
    this.dataNascimentoPessoa = pessoa.dataNascimentoPessoa.substr(0, 10).split('/').reverse().join('-');
    this.senhaPessoa = pessoa.senhaPessoa;
    this.idPessoa = pessoa.idPessoa;
}


Pessoa.getAllPessoas =(result)=>{
    sql.connection.query('select * from Pessoa',(err,res)=>{
        if(err){
            console.log('error: ',err)
            result(null,err);
        }else{
            console.log('Pessoas :',res)
            result(null,res);
        }
    })
}

Pessoa.getIdPessoa = (cpf,result)=>{
    sql.connection.query('select idPessoa from Pessoa where cpfPessoa = ?',[cpf],(err,res)=>{
        if(err){
            console.log("error ao pegar id",err);
        }else{
            if(result.lenght == 0){
                result(null,'Consulta não retornou resultados.')
            }else{
                result(null,res[0].idPessoa)
            }
        }
    })
}
Pessoa.createPessoa = (newPessoa,result)=>{
    sql.connection.query("insert into Pessoa set ?",newPessoa,(err,res)=>{
        if(err){
            console.log('Error: ',err)
            result(err,null)
        }else{
            if(res.message == ''){
                result(null,'Pessoa inserida com sucesso!')
            }else{
                result(null,'Houve algum problema' + res.message)
            }
        }
    })
}


module.exports = Pessoa