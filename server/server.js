const express = require('express')
var path = require('path');
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
var app = express()
const mongoose = require('mongoose')
const user = require('./router/UserRouter')
const rawstore = require('./router/RawStoreRouter')
const admin = require('./router/AdminRouter')
const production = require('./router/ProductionRouter')
const quality = require('./router/QualityRouter')
const stock = require('./router/StockRouter')
dotenv.config({ path: './.env' })
var port = process.env.PORT
app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

const mongoURI = process.env.MONGO
mongoose.connect(
   mongoURI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))
app.use((req, res, next) => {
res.header('Access-control-Allow-Origin', 'http://localhost:3000');
res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
);
res.header('Access-Control-Allow-Credentials', true);
if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
}
next();
});
app.use('/auth', user)
app.use('/rawstore', rawstore)
app.use('/admin', admin)
app.use('/production', production)
app.use('/quality', quality)
app.use('/stock', stock)
app.listen(port, function () {
  console.log('Server is running on port: ' + port)
})