const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
app.disable('x-powered-by');

//SETTINGS
const MB = 1000000;
const MAX_FILE_SIZE = MB * 500; //500mb
const ACCEPTED_FILE_MIME_TYPE = 'text/javascript';
const PORT = 3000;

app.use(fileUpload({
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    abortOnLimit: true,
    limitHandler: (req, res, next) => {
        res.status(413).send('File too large for upload');
        next(res);
        return;
    }
}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/upload', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let file = req.files.file;

    if (!file || file.mimetype != ACCEPTED_FILE_MIME_TYPE) {
        return res.status(400).send(`Invalid file type. ${ACCEPTED_FILE_MIME_TYPE} files only.`);
    }

    //DO STUFF WITH FILE
    //SEND RESPONSE WITH DEOBF FILE
    res.download('./example.txt', 'example.txt', (err) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
            return
        }
    })

})

app.use((req, res, next) => {
    res.redirect('/');
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
});