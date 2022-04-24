const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
const models = require('../models/index'); 
const admin = models.admin;
//import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeJSItuMenyengankan"
//end

//get data
//endpoint get data admin
app.get("/", (req,res) => {
    admin.findAll()
    .then(admin => {
        res.json({
            count: admin.length,
            admin: admin
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

app.get("/:admin_id", (req, res) =>{
    admin.findOne({where: {admin_id: req.params.admin_id}})
    .then(result => {
        res.json({
            admin: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})
//menyimpan data admin, method: POST, function: create

app.post("/", (req,res) => {
    let data = {
        name: req.body.name,
        username: req.body.username,
        password: md5(req.body.password)
    }
    admin.create(data)
        .then(result => {
            res.json({
                message: "data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.put("/:id", (req,res) => {
    let param = { admin_id: req.params.id}
    let data = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    }
    admin.update(data, {where: param})
        .then(result => {
            res.json({
                message: "data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    })

app.delete("/:id", (req,res) => {
    let param = {
        admin_id : req.params.id
    }
    admin.destroy({where: param})
        .then(result => {
            res.json({
                message: "data has been deleted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})
app.post("/auth", async (req,res) => {
    let params = {
        username: req.body.username,
        password: md5(req.body.password)
    }
 
    let result = await admin.findOne({where: params})
    if(result){
        let payload = JSON.stringify(result)
        // generate token
        let token = jwt.sign(payload, SECRET_KEY)
        res.json({
            logged: true,
            data: result,
            token: token
        })
    }else{
        res.json({
            logged: false,
            message: "Invalid username or password"
        })
    }
})

//endpoint menampilkan semua data admin, method: GET, function: findAll()
app.get("/", auth, (req,res) => {
    admin.findAll()
        .then(result => {
            res.json({
                admin : result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})


module.exports = app;