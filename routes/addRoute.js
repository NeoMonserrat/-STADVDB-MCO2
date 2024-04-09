const express = require("express");
const bodyParser = require("body-parser");

const addRouter = express.Router();

addRouter.use(bodyParser.urlencoded({ extended: true }));

// Render the add form
addRouter.get('/', (req, res) => {
    res.render('add', {
        title: 'Add Appointment'
    });
});

// Handle form submission
addRouter.post('/', (req, res) => {
    const { pxid, clinicid, doctorid, apptid, status, type, Virtual } = req.body;
    const sql = 'INSERT INTO appointments (pxid, clinicid, doctorid, apptid, status, type, Virtual) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [pxid, clinicid, doctorid, apptid, status, type, Virtual];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }

        console.log('Appointment added successfully');
        res.redirect('/');
    });
});

module.exports = addRouter;
