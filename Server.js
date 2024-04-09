const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
//const addRouter = require("./routes/addRoute");
//const editRouter = require("./routes/editRoute");

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

//app.use('/add', addRouter);
//app.use('/edit', editRouter);

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

// Adding data to Database
app.get('/add', (req, res) => {
    res.render('add', {
        title: 'Add Appointment'
    });
});

// Handle form submission
app.post('/add', (req, res) => {
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

// Edit data from Database
app.get('/edit/:apptid', (req, res) => {
    const apptId = req.params.apptid;
    res.render('edit', {
        title: 'Edit Appointment',
        apptId: apptId
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

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
