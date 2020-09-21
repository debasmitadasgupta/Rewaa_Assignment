const express = require('express');
const bodyParser = require('body-parser');
// create express app
const app = express();
// Setup server port
const port = process.env.PORT || 5000;
//habdle CORS
var cors = require('cors')
//use mysql database
const mysql = require('mysql');
//to verify JWT
let verifyToken = require('./public/verifytoken');

// parse requests of content-type - application/x-www-form-urlencode
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

app.use(cors())

let jwt = require('jsonwebtoken');
const { json } = require('body-parser');
global.config = require('./constants/config');


//Create connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'assign_db',
    insecureAuth : true
});

//connect to database
conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});


//route for list-products
app.get('/products/:id', verifyToken, (req, res) => {
    let sql = "SELECT * FROM assign_db.product WHERE product_id=" + req.params.id;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send({
            result: results,
            status:200
        });
    });
});

//route for list-users
app.get('/products/', verifyToken, (req, res) => {
    let sql = "SELECT * FROM assign_db.product";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send({
            result: results,
            status:200
        });
    });
});

//route for insert data
app.post('/products/', (req, res) => {
    let data = { product_name: req.body.product_name, product_price: req.body.product_price, product_quantity: req.body.product_quantity };
    let sql = "INSERT INTO assign_db.product SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.send({
            message: "Product added successfully",
            status: 200
        })
    });
});


//route for update data
app.put('/products/:id', (req, res) => {
    let sql = "UPDATE product SET product_name='" + req.body.product_name + "', product_price='" + req.body.product_price + "', product_quantity='" + req.body.product_quantity + "' WHERE product_id=" + req.params.id;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send({
            message: "Product updated successfully",
            status: 200
        })
    });
});

//route for delete data
app.delete('/products/:id', (req, res) => {
    let sql = "DELETE FROM product WHERE product_id=" + req.params.id;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send({
            message: "Product deleted successfully",
            status: 200
        })
    });
});


app.post('/token/generate-token', (req, res) => {
    
    //Go to server for user verification
    let sql = "SELECT * FROM assign_db.user WHERE username='" + req.body.username +"'";
    let userdata = {
        username: req.body.username,
        password: req.body.password
    };

    let query = conn.query(sql, (err, results) => {
        console.log("results:", results)
    if (err) throw err;
    if (results.length > 0) {
        let token = jwt.sign(userdata, global.config.secretKey, {
            algorithm: global.config.algorithm,
            expiresIn: '60m'
        });

        res.send({
            message: 'Login Successful',
            result: {
                token: token
            },
            status: 200
        });
    }
    else {
        res.send({
            message: 'Login Failed',
            status:401
        });
    }
})
})

// listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});