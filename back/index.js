const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());

const admin = require('./routes/admin');
app.use('/store/admin', admin);

const customer = require('./routes/customer');
app.use('/store/customer', customer);

const product = require('./routes/product');
app.use('/store/product', product);
const transaksi = require('./routes/transaksi');
app.use('/store/transaksi', transaksi);

app.use(express.static(__dirname));

app.listen(8080, () => {
    console.log('server run on port 8080');
})