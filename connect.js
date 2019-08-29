const mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'universalbank.cqsadmltcxu6.us-west-1.rds.amazonaws.com',
    user: 'admin',
    password: 'admin123',
    port: '3306',
    database: 'UniversalBank'

});

connection.connect((err)=>{
    if(err) throw err;
})

function execSqlQuery(sql,res){
    connection.query(sql,(error,result,fields)=>{
        if(error)
        res.json(error);
        else
            res.json(result);
        
        console.log('Realizou consulta no banco.');
    });
    //connection.end();
}

function ExecSqlQueryCliente(sql,res,site) {
    connection.query(sql, (error, result, fields) => {
        if (error)
            res.json(error);
        else{
            console.log(result.length)
            if (result.length > 0){
                res.render(site, { data: result });
            }else{
                res.send('não existe nenhum cpf cadastro com esse n�mero')}
            
            
        }
            
        //connection.end();
        console.log('Realizou consulta no banco.');
    });
}
module.exports = { execSqlQuery, ExecSqlQueryCliente, connection}
