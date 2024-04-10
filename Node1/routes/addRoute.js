const express = require('express');
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'smd_appointments'
});

router.get('/', (req, res) => {
    res.render('add', {
        title: 'Add Appointment'
    });
});

router.post('/', (req, res) => {
    const { apptid, patient, clinic, doctor, time, status, type } = req.body;
    const sql = 'INSERT INTO appointments (apptid, patient, clinic, doctor, time, status, type) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [apptid, patient, clinic, doctor, time, status, type];

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
