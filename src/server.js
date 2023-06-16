import express from 'express';
import path from 'path';
import { routes } from './routes/index.js';
import { initializeDbConnection } from '../src/db.js';
import fs from 'fs';
import bodyParser from 'body-parser';
import multer from 'multer';


import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
//console.log(__filename);

const __dirname = path.dirname(__filename);
//console.log(__dirname);

const PORT = process.env.PORT || 9000;

const app = express();
const upload = multer(); // config
app.use(bodyParser.json()); // to support JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// This allows us to access the body of POST/PUT
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../build')))
app.use(upload.any());

app.get(/^(?!\/api).+/, (req, res) => {

    res.sendFile(path.join(__dirname, '../build/index.html'))
    // res.status(200).json({ message: "Project under development" });

})

// Add all the routes to our Express server
// exported from routes/index.js
routes.forEach(route => {
    app[route.method](route.path, route.handler);
});

// Connect to the database, then start the server.
// This prevents us from having to create a new DB
// connection for every request.
initializeDbConnection()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    });