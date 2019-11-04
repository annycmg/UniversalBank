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


var WebSocketServer = require('ws').Server;

const uuidv1 = require('uuid/v1');

var clientes = {};

//
const {
    SESS_LIFETIME = 1000 * 60 * 60 * 1,
    NODE_ENV = 'development',
    SESS_NAME = 'sid',
    SESS_SECRET = 'UniversalBank'
} = process.env

const IN_PROD = NODE_ENV === 'home'

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
app.use('/home', express.static(__dirname + '/views'));

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


app.use((req, res, next) => {
    const { userId } = req.session
    if (userId) {
        res.locals.user = userId
    }
    next()
})


app.get('/', redirectHome, (req, res) => {
    console.log(req.session)
    const { userId } = req.session
    res.render('index.ejs')
})
app.post('/', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err)
            return res.redirect('/home')
        }
        res.clearCookie(SESS_NAME)
        res.redirect('/')
    })
})
app.get('/home', redirectLogin, (req, res) => {

    const { user } = res.locals
    console.log('user: ' + user)
    var info = { userId: user };
    res.render('myAccountScreen.ejs', { info: info })

})


app.post('/home', (req, res) => {
    console.log(req.body)
    // req.session.userId = 
    var { userId } = req.body;
    const { user } = res.locals
    if (userId) {
        req.session.userId = userId;
        var info = { userId: user };
        res.render('myAccountScreen.ejs', { info: info })
        console.log(req.session)
    } else {
        cmd.connection.query("SELECT * FROM `UniversalBank`.`Cliente` t1 inner join `UniversalBank`.`Pessoa` t2 on t1.idPessoa = t2.idPessoa where t2.cpfPessoa = ? and t2.senhaPessoa = ?", [req.body.CPF, req.body.Senha], (err, result) => {
            if (err) {
                console.log("error: ", err);
            }
            else {
                if (result.length == 0) {
                    res.render('login.ejs', { message: 'Login/Senha incorreto' });
                } else {
                    req.session.userId = result[0].idCliente
                    console.log(result[0].idCliente)
                    var info = { userId: result[0].idCliente };
                    res.render('myAccountScreen.ejs', { info: info });
                    console.log(req.session)
                }

            }
        })
    }
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

app.get('/home/dashGastos', redirectLogin, (req, res) => {
    const { userId } = req.session
    if (userId) {
        req.body = { idCliente: userId, render: 'dashGastosScreen.ejs' }
        task.read_a_clientId(req, res)
    }
})

app.get('/home/dashCards', redirectLogin, (req, res) => {
    const { userId } = req.session
    if (userId) {
        req.body = { idCliente: userId, render: 'dashCardsScreen.ejs' }
        task.read_a_clientId(req, res)
    }

})

app.get('/home/dashTransf', redirectLogin, (req, res) => {
    const { userId } = req.session
    if (userId) {
        req.body = { idCliente: userId, render: 'dashTransfScreen.ejs' }
        task.read_a_clientId(req, res)
    }

})

app.get('/home/premiumScreen', redirectLogin, (req, res) => {
    const { userId } = req.session
    if (userId) {
        req.body = { idCliente: userId, render: 'premiumScreen.ejs' }
        task.read_a_clientId(req, res)
    }

})

app.route('/home').get((req, res) => {
    res.render('myAccountScreen.ejs')
})

app.get('/home/sustentabScreen', redirectLogin, (req, res) => {
    const { userId } = req.session
    if (userId) {
        req.body = { idCliente: userId, render: 'sustentabScreen.ejs' }
        task.read_a_clientId(req, res)
    }

})


app.get('/home/transfScreen', redirectLogin, (req, res) => {
    var info = { status: 0 }
    res.render('transfScreen.ejs', { info: info })
}).post('/home/transfScreen', (req, res) => {
    const { userId } = req.session
    if (userId) {
        task.RealizaTransferencia(req, res, userId, 'transfScreen.ejs');
    }
})

app.get('/home/myCardScreen', redirectLogin, (req, res) => {
    const { userId } = req.session
    if (userId) {
        req.body = { idCliente: userId, render: 'myCardScreen.ejs' }
        task.read_a_clientId(req, res)
    }
})

app.get('/home/dashCotacao', redirectLogin, (req, res) => {
    const { userId } = req.session
    if (userId) {
        req.body = { idCliente: userId, render: 'dashCotacaoScreen.ejs' }
        task.read_a_clientId(req, res)
    }

})

app.route('/home/myExtrato').get((req, res) => {
    res.render('myExtratoScreen.ejs')
})

//Api-
app.use('/api', router)
let data = new Date();
let dia = ("0" + data.getDate()).slice(-2);
let mes = ("0" + (data.getMonth() + 1)).slice(-2);
let ano = data.getFullYear();
let horas = data.getHours();
let minutos = data.getMinutes();
let seconds = data.getSeconds();

var server = app.listen(port, () => console.log('Executando na porta: ' + port + ' Tempo: ' + dia + '/' + mes + '/' + ano + ' ' + horas + ':' + minutos + ':' + seconds))

var wss = new WebSocketServer({ server: server });
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('recebeu: %s', message);
        var data = JSON.parse(message);
        if (data.message == 'Conectando') {
            var token = uuidv1();
            console.log('token: ' + token)
            clientes[token] = ws;
            var data = { token: token, message: 'Home' }
            ws.send(JSON.stringify(data), { mask: false })
        }
        else if (data.message == 'Entrando') {
            if (typeof data.userId !== "undefined") {
                console.log('userId: ' + data.userId);

            }
        }
        else if (data.message == 'Qrcode') {
            if (typeof data.userId !== "undefined")
                console.log('userId: ' + data.userId);
            else {
                console.log('WebSocket não recebeu o id')
            }
            var content = { message: 'QrCode', QrCode: data.data, userID: data.userId };
            for(element in clientes){
                clientes[element].send(JSON.stringify(content), { mask: false })
            }
            //ws.send(JSON.stringify(content), { mask: false })
            console.log('Enviei ws id: '+data.userId+', qrcode: '+data.data);
        }
    });
});


