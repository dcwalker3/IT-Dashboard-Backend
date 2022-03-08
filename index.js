const express = require('express');
const cors = require('cors');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
}))

require('dotenv').config();

const port = process.env.EXPRESS_APP_PORT || 8080

app.get('/', (req, res) => {
    res.send("Hello World");
})

const User = require('./Routes/Users');

app.use('/user', User);

app.listen(port, () => {
    console.log(`App Listening on port ${port}`);
});