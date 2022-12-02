const express = require('express');
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const api = require('./api/index.js');
const middlewares = require('./middlewares');

const app = express();

app.use(express.static('static'))
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());



app.get('/', (req, res) => {
    res.json({ message: "Hello World" });
});

app.use('/api', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;