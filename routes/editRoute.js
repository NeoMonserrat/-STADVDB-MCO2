const express = require('express');
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'seriousmd'
});

router.get('/:apptid', (req, res) => {
    const apptId = req.params.apptid;
    const sql = 'SELECT * FROM appointments WHERE apptid = ?';

    db.query(sql, [apptId], (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Appointment not found');
            return;
        }

        const appointment = result[0];
        res.render('edit', {
            title: 'Edit Appointment',
            appointment: appointment
        });
    });
});

router.post('/:apptid', (req, res) => {
    const apptId = req.params.apptid;
    const { pxid, clinicid, doctorid, status, type, isVirtual } = req.body;
    const sql = 'UPDATE appointments SET pxid = ?, clinicid = ?, doctorid = ?, status = ?, type = ?, isVirtual = ? WHERE apptid = ?';
    const values = [pxid, clinicid, doctorid, status, type, isVirtual, apptId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }

        console.log('Appointment updated successfully');
        res.redirect('/');
    });
});

module.exports = router;
