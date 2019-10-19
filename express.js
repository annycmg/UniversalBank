const express = require('express')
const session = require('express-session')
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
const pessoa = require('./Controller/appController')
const task = require('./Controller/appController')

//Porta para conectar
port = process.env.PORT || 3000;

//
const {
    SESS_LIFETIME = 1000 * 60 * 60 * 1,
    NODE_ENV = 'development',
    SESS_NAME = 'sid',
    SESS_SECRET = 'UniversalBank'
} = process.env

const IN_PROD = NODE_ENV ==='home'

const redirectLogin = (req, res, next) => {
    
    if (!req.session.userId) {
        res.redirect('/')
    } else {
        next()
    }
}
const redirectHome = (req, res, next) => {
    console.log('userId: ' + req.session.userId)
    if (req.session.userId) {
        res.redirect('/home')
    } else {
        next()
    }
}


//Parte do site
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/views'));
app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,

    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}))


app.use((req,res,next)=>{
    const {userId} = req.session
    if(userId){
        res.locals.user = userId
    }
    next()
})


app.get('/', redirectHome, (req, res) => {
    console.log(req.session)
    const { userId } = req.session
    res.render('index.ejs')
})
app.post('/',(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            console.log(err)
            return res.redirect('/home')
        }
        res.clearCookie(SESS_NAME)
        res.redirect('/')
    })
})
app.get('/home', redirectLogin, (req, res) => {
    const {user} = res.locals
    console.log('user: '+user)
    res.render('myAccountScreen.ejs')
})

app.post('/home', (req, res) => {
    console.log(req.body)
    // req.session.userId = 

    cmd.connection.query("Select * from Cliente where cpfCliente = ? and senhaCliente = ?", [req.body.CPF, req.body.Senha], (err, result) => {
        if (err) {
            console.log("error: ", err);
        }
        else {
            if (result.length == 0) {
                res.render('login.ejs', { message: 'Login/Senha incorreto' });
            } else {
                req.session.userId = result[0].idCliente
                console.log(result[0].idCliente)
                res.render('myAccountScreen.ejs')
                console.log(req.session)
            }

        }
    })
})

app.get('/show', (req, res) => {
    res.send('Exibe os clientes;');
})

app.route('/cadastro').get((req, res) => {
    res.render('cadastro.ejs')
}).post(pessoa.createPessoa)

// app.get('/cadastro',(req,res)=>{
//    res.render('cadastro.ejs')
// })

app.get('/home/dashGastos',redirectLogin,(req, res) => {
    const {userId} = req.session
    if(userId){
    req.body = {idCliente:userId,render:'dashGastosScreen.ejs'}
    task.read_a_clientId(req,res)
    }
})

app.get('/home/dashCards',redirectLogin,(req, res) => {
    const {userId} = req.session
    if(userId){
    req.body = {idCliente:userId,render:'dashCardsScreen.ejs'}
    task.read_a_clientId(req,res)
    }

})

app.get('/home/dashTransf',redirectLogin,(req, res) => {
    const {userId} = req.session
    if(userId){
    req.body = {idCliente:userId,render:'dashTransfScreen.ejs'}
    task.read_a_clientId(req,res)
    }

})

app.route('/home').get((req, res) => {
    res.render('myAccountScreen.ejs')
})

app.get('/home/sustentabScreen',redirectLogin,(req, res) => {
    const {userId} = req.session
    if(userId){
    req.body = {idCliente:userId,render:'sustentabScreen.ejs'}
    task.read_a_clientId(req,res)
    }

})


app.route('/home/transfScreen').get((req, res) => {
    res.render('transfScreen.ejs')
})

app.get('/home/myCardScreen',redirectLogin,(req, res) => {
    const {userId} = req.session
    if(userId){
    req.body = {idCliente:userId,render:'myCardScreen.ejs'}
    task.read_a_clientId(req,res)
    }
})

app.get('/home/dashCotacao',redirectLogin,(req, res) => {
    const {userId} = req.session
    if(userId){
    req.body = {idCliente:userId,render:'dashCotacaoScreen.ejs'}
    task.read_a_clientId(req,res)
    }

})

app.route('/home/myExtrato').get((req, res) => {
    res.render('myExtratoScreen.ejs')
})

//Api
app.use('/api', router)
let data = new Date();
let dia = ("0" + data.getDate()).slice(-2);
let mes = ("0" + (data.getMonth() + 1)).slice(-2);
let ano = data.getFullYear();
let horas = data.getHours();
let minutos = data.getMinutes();
let seconds = data.getSeconds();

app.listen(port, () => console.log('Executando na porta: ' + port + ' Tempo: ' + dia + '/' + mes + '/' + ano + ' ' + horas + ':' + minutos + ':' + seconds)) 