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

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

