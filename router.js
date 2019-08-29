const express = require('express')

const router = express.Router()
const cmd = require('./connect')
const task = require('./Controller/appController')

router.use((req,res,next)=>{
    const init = Date.now()
    next()
    console.log('Tempo = '+(Date.now()-init)+' ms')
})

router.get('/cliente/:cpf',(req,res) =>{
    if(req.params.cpf){
        cmd.execSqlQuery('Select * from Cliente where cpfCliente = \'' + req.params.cpf+'\'',res)
    }
    //res.json({cpf: req.params.cpf})
})
router.route('/testes')
    .get(task.list_all_tasks)
    .post(task.createCliente);
router.route('/testes/:CPF/:Senha').get(task.read_a_client);

router.get('/clientes',(req,res)=>{
    cmd.execSqlQuery('select * from Cliente',res);
})


module.exports = router