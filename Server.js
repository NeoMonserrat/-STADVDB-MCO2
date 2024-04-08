const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'seriousmd'
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
app.get('/',(req, res) => {
    let sql = "SELECT * FROM appointments";
    let query = db.query(sql, (err,rows) => {
        console.log(rows);
        if(err) throw err;
        res.render('index', {
            title: 'SeriousMD Database',
            appointments : rows
        });
    });
});

// Adding data to Database
app.get('/add', (req, res) => {
    res.render('add', {
        title: 'Add Appointment'
    });
});

// Edit data from Database
app.get('/edit/:apptid', (req, res) => {
    const apptId = req.params.apptid;
    res.render('edit', {
        title: 'Edit Appointment',
        apptId: apptId
    });
});

// Search data from Database(using apptid)
/*
app.get('/search-apptid', (req, res) => {
    const query = req.query.query;
    const sql = 'SELECT * FROM appointments WHERE apptid = ?';

    connection.query(sql, [query], (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Pass the results to the view
        res.render('index', { appointments: results });
    });
});
*/



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

