const express = require('express')
//servidor
const app = express()
// server para pegar as variaveis de requisi��o
const bodyParser = require('body-parser')
//cria rotas 
const router = require('./router')
app.set('view engine', 'ejs')
//Chamada do Db
const cmd = require('./connect')

//Porta para conectar
 port = process.env.PORT || 3000;

//Parte do site
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/views'));
app.get('/',(req,res) =>{
    res.render('index.ejs')
})


app.post('/show',(req,res)=>{
    console.log(req.body)
    cmd.ExecSqlQueryCliente('select * from Cliente where cpfCliente = \''+req.body.CPF+'\'',res,'show.ejs')
    //res.send('<h1>CPF: '+req.body.CPF+'</h1></p><h1>Senha: '+req.body.Senha+'</h1>')
})

app.get('/show',(req,res)=>{
    res.send('Exibe os clientes;');
})

app.get('/cadastro',(req,res)=>{
    res.render('cadastro.ejs')
})
//

//Api
app.use('/api', router)
let data =  new Date();
let dia = ("0"+data.getDate()).slice(-2);
let mes = ("0" + (data.getMonth() + 1)).slice(-2);
let ano = data.getFullYear();
let horas = data.getHours();
let minutos = data.getMinutes();
let seconds = data.getSeconds();

app.listen(port, () => console.log('Executando na porta: '+port+' Tempo: '+dia+'/'+mes+'/'+ano+' '+horas+':'+minutos+':'+seconds)) 