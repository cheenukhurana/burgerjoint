const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const http = require('http');
const router = express.Router();
const fs = require('fs');
const prices = require('./prices')

const app = express();
const server = http.createServer(app);

app.use(bodyparser.urlencoded({extended:true}));
app.use(cors());

app.post('/order',function(req,res){
    let orders = [];
    fs.readFile(process.cwd()+'/orders.json',function(error,data){
        if(error)
        {
            console.log(error);
            throw error;
        }
        if(data.toString())
        {
            orders = JSON.parse(data);
        }
        let orderData = req.body;
        orders.push(orderData);
        fs.writeFile('orders.json',JSON.stringify(orders,null,'\t'),function(error){
            if(error)
            {
                throw error;
            }
            res.end();
        });
    });
});

app.get('/allOrders',function(req,res){
    let orders = [];
    fs.readFile(process.cwd()+'/orders.json',function(error,data){
        if(error)
        {
            console.log(error);
            throw error;
        }
        if(data.toString())
        {
            orders = JSON.parse(data);
        }
        res.json(orders).end();
    })
})

app.get('/prices',function(req,res){
    res.json(prices).end();
});

server.listen(9000);