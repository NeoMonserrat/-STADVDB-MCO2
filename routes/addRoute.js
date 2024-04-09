const express = require('express');
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'seriousmd'
});

router.get('/', (req, res) => {
    res.render('add', {
        title: 'Add Appointment'
    });
});

router.post('/', (req, res) => {
    const { pxid, clinicid, doctorid, apptid, status, type, isVirtual } = req.body;
    const sql = 'INSERT INTO appointments (pxid, clinicid, doctorid, apptid, status, type, isVirtual) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [pxid, clinicid, doctorid, apptid, status, type, isVirtual];

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

module.exports = router;
