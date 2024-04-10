const express = require('express');
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'smd_appointments'
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
    const apptIdToUpdate = req.params.apptid; 
    const { apptid, patient, clinic, doctor, status, type, time } = req.body; 
    const sql = 'UPDATE appointments SET patient = ?, clinic = ?, doctor = ?, status = ?, type = ?, time = ? WHERE apptid = ?';
    const values = [patient, clinic, doctor, status, type, time, apptIdToUpdate]; 

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
