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

//
const pessoa =require('./Controller/appController')

//Porta para conectar
 port = process.env.PORT || 3000;

//Parte do site
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/views'));
app.get('/',(req,res) =>{
    res.render('index.ejs')
})

app.post('/home',(req,res)=>{
    console.log(req.body)
    cmd.connection.query("Select * from Cliente where cpfCliente = ? and senhaCliente = ?", [req.body.CPF, req.body.Senha], (err, result) => {
        if (err) {
            console.log("error: ", err);     
        }
        else {
            if (result.length == 0)
            {
                res.render('login.ejs',{message:'Login/Senha incorreto' });
            }else{
                res.render('myAccountScreen.ejs')
                //res.send('<h1>CPF: ' + req.body.CPF + '</h1></p><h1>Senha: ' + req.body.Senha + '</h1>')
            }

        }
    })
    //cmd.ExecSqlQueryCliente('select * from Cliente where cpfCliente = \''+req.body.CPF+'\'',res,'show.ejs')
    //res.send('<h1>CPF: '+req.body.CPF+'</h1></p><h1>Senha: '+req.body.Senha+'</h1>')
})

app.get('/show',(req,res)=>{
    res.send('Exibe os clientes;');
})

app.route('/cadastro').get((req,res)=>{
    res.render('cadastro.ejs')
}).post(pessoa.createPessoa)

// app.get('/cadastro',(req,res)=>{
//    res.render('cadastro.ejs')
// })

app.route('/home/dashGastos').get((req,res)=>{
    res.render('dashGastosScreen.ejs')
})

app.route('/home/dashCards').get((req,res)=>{
    res.render('dashCardsScreen.ejs')
})

app.route('/home/dashTransf').get((req,res)=>{
    res.render('dashTransfScreen.ejs')
})

app.route('/home').get((req,res)=>{
    res.render('myAccountScreen.ejs')
})

app.route('/home/sustentabScreen').get((req,res)=>{
    res.render('sustentabScreen.ejs')
})

app.route('/home/transfScreen').get((req,res)=>{
    res.render('transfScreen.ejs')
})

app.route('/home/myCardScreen').get((req,res)=>{
    res.render('myCardScreen.ejs')
})
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