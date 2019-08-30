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
router.route('/clientes')
    .get(task.list_all_tasks);

router.route('/cliente')
.get(task.read_a_client)
.post(task.createCliente);

// router.get('/clientes',(req,res)=>{
//     cmd.execSqlQuery('select * from Cliente',res);
// })


module.exports = router