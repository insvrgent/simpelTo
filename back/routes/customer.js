const express = require('express')
const app = express();
app.use(express.json())
const md5 = require("md5")
const multer = require('multer')
const path = require('path')
const fs = require('fs')

//import model
const models = require("../models/index")
const customer = models.customer
//import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeJSItuMenyengankan"

//config storage image
const storage = multer.diskStorage({
    destination:(req, file,cb)=> {
        cb(null,"./image/customer")
    },
    filename: (req,file,cb)=> {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({storage: storage})

//GET all customer, method: GET, function: findAll
app.get("/", (req, res) => {
    customer.findAll()
    .then(result => {
        res.json({
            count: result.length,
            customer: result 
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.get("/:customer_id", (req, res) =>{
    customer.findOne({where: {customer_id: req.params.customer_id}})
    .then(result => {
        res.json({
            customer: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})
app.post("/", upload.single("image"),(req,res)=>{
        let data = {
            name: req.body.name,
            status: req.body.status,
            wes: req.body.wes
        }
        customer.create(data)
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
app.put("/:id", upload.single("image"), (req, res) =>{
    let param = { customer_id: req.params.id}
    let data = {
        name: req.body.name,
        status: req.body.status,
        wes: req.body.wes
    }
 
    customer.update(data, {where: param})
        .then(result => {
            res.json({
                message: "data has been updated",
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})
app.delete("/:id", async (req, res) =>{
    try {
        let param = { customer_id: req.params.id}
        let result = await customer.findOne({where: param})
 
        // delete data
        customer.destroy({where: param})
        .then(result => {
           
            res.json({
                message: "data has been deleted",
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
 
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})
app.post("/auth", async (req,res) => {
    let data= {
        username: req.body.username,
        password: md5(req.body.password)
    }
 
    let result = await customer.findOne({where: data})
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

module.exports = app;