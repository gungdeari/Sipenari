const express = require("express");
const route = require("./routers/routers");
const session = require("express-session");
const flash = require('connect-flash');

const app = express();
const port = 3000;

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.set('view engine', 'ejs');
app.use(("/"), express.static('public'));
app.use(route);

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
