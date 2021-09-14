const express = require('express');
const path = require('path');
const Rollbar = require('rollbar');

let rollbar = new Rollbar({
accessToken: '35970ab1b315410ca5fa18153a20bd2a',
captureUncaught: true,
captureUnhandledRejections: true
});

const app = express();

app.use(express.json());
app.use('/style', express.static('./public/styles.css'));

app.get('/', (req,res)=> {
    res.sendFile(path.join(__dirname, '/public/index.html'));
    rollbarinfo('HTML file served successfully');
})

const port = process.env.PORT || 4545;

app.use(rollbar.errorHandler());

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});