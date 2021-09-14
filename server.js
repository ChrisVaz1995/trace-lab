const express = require('express');
const path = require('path');
const Rollbar = require('rollbar');

let rollbar = new Rollbar({
accessToken: '35970ab1b315410ca5fa18153a20bd2a',
captureUncaught: true,
captureUnhandledRejections: true
});

const students = [];
const app = express();

app.get('/api/spongebob', (req, res) => {
    try {
        students();
    } catch (error) {
        rollbar.error('error');
    }
})

app.use(express.json());
app.use('/style', express.static('./public/styles.css'));

app.get('/', (req,res)=> {
    res.sendFile(path.join(__dirname, '/public/index.html'));
    rollbar.info('HTML file served successfully');
})

app.post('/api/student', (req, res)=>{
    let {name} = req.body
    name = name.trim()

    const index = students.findIndex(studentName=> studentName === name)

    if(index === -1 && name !== ''){
        students.push(name)
        rollbar.log('Student added successfully', {author: 'Chris', type: 'manual entry'})
        res.status(200).send(students)
    } else if (name === ''){
        rollbar.error('No name given')
        res.status(400).send('must provide a name.')
    } else {
        rollbar.error('student already exists')
        res.status(400).send('that student already exists')
    }

})

const port = process.env.PORT || 4545;

app.use(rollbar.errorHandler());

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});