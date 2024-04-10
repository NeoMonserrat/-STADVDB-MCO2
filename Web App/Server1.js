const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

const db = mysql.createConnection({
    host: 'ccscloud.dlsu.edu.ph',
    port: 20013,
    user: 'root',
    password: 'VDxdc5yWSYNtjv8hXaJ27bP4',
    database: 'smd_luzon' 
  });

db.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + db.threadId);
});

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



// Fetching Data from Database
app.get('/', (req, res) => {
    let sql = "SELECT * FROM appointments";
    let query = db.query(sql, (err, rows) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(rows);
        res.render('index', {
            title: 'SeriousMD Database',
            appointments: rows
        });
    });
});

// Fetching Data from Database(view)
app.get('/view/:apptid', (req, res) => {
    const apptid = req.params.apptid;
    let sql = "SELECT * FROM appointments WHERE apptid = ?";
    let query = db.query(sql, [apptid], (err, rows) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (rows.length === 0) {
            console.log('No appointment found with apptid:', apptid);
            res.status(404).send('Appointment not found');
            return;
        }
        console.log('Found appointment:', rows[0]);
        res.render('record', {
            title: 'SeriousMD Database',
            appointments: rows
        });
    });
});


// Search data from Database(using apptid)
app.get('/search-apptid', (req, res) => {
    const query = req.query.query;
    const sql = 'SELECT * FROM appointments WHERE apptid = ?';

    db.query(sql, [query], (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.render('index', { appointments: results });
    });
});

// Delete data from Database
app.get('/delete/:apptid', (req, res) => {
    const apptid = req.params.apptid; 
    const sql = 'DELETE FROM appointments WHERE apptid = ?';

    db.query(sql, [apptid], (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return; 
        }

        console.log('Appointment deleted successfully');
        res.redirect('back'); 
    });
});



app.listen(20013, () => {
    console.log("Server is running on port 20013");
});

module.exports = db;
