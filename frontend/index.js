const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'www')))

app.get('/', (req, res) => {
    res.sendFile('profile/index.html');
});

app.listen(3000, () => {
    console.log('Application listening on port 3000!');
});