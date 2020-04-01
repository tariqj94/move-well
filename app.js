// requiring applications
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    session = require("express-session"),
    MongoStore = require("connect-mongo")(session),
    cookieParser = require("cookie-parser"),
    ejs = require("ejs"),
    _ = require("lodash"),
    dotenv = require("dotenv");

// configure environment variables
dotenv.config();

// requiring routes
var indexRoutes = require("./routes/index")

// connecting mongoDB
mongoose.connect(
    process.env.MONGO_CONNECTION_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true },
);

app.use(express.static(__dirname + "/public"));
app.use("/bower_components", express.static(__dirname + "/bower_components"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// configuring global variables
app.locals.moment = require("moment");
app.use(
    session({
        secret: "thisismovewell",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
);
app.use(flash());

if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
        if (req.header("x-forwarded-proto") !== "https") res.redirect(`https://${req.header("host")}${req.url}`);
        else next();
    });
}

// passing universal variables to all templates
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.transactionFeeDefault = Number(process.env.TRANSACTION_FEE);
    res.locals.environment = process.env.SOFTWARE_ENV === "prod" ? "prod" : "local";
    res.locals.locations = req.locations;
    res.locals.workout = req.workout;
    res.locals.status = req.status;
    res.locals.loginRoute = req.loginRoute;
    res.locals.loginErr = req.loginErr;
    res.locals.firstLoginRoute = req.firstLoginRoute;
    res.locals.firstLoginEmail = req.firstLoginEmail;
    res.locals.becomeACoach = req.becomeACoach;
    res.locals.becomeAnAthlete = req.becomeAnAthlete;
    res.locals.registerRoute = req.registerRoute;
    res.locals.info = req.info;
    res.locals.participants = req.participants;
    res.locals.styles = req.styles;
    res.locals.messages = req.messages;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.session = req.session;
    res.locals.errorMessage = req.errorMessage;
    res.locals.bootstrapTime = function(time) {
        var month = time.split(" ")[1];
        var day = time.split(" ")[2];
        var year = time.split(" ")[3];
        const month_map = {
            Jan: 1,
            Feb: 2,
            Mar: 3,
            Apr: 4,
            May: 5,
            Jun: 6,
            Jul: 7,
            Aug: 8,
            Sep: 9,
            Oct: 10,
            Nov: 11,
            Dec: 12
        };
        const m = month_map[month];
        var str = String(m) + "/" + day + "/" + year + " ";
        var t = time.split(" ")[4];
        var hour = Number(t.split(":")[0].slice(-2));
        let part;
        if (hour >= 12) part = "PM";
        else part = "AM";
        if (hour > 12) hour = hour - 12;
        if (hour === 0) hour = 12;
        str = str + hour.toString() + ":" + time.split(":")[1] + " " + part;
        return str;
    };
    res.locals.getDate = function(time) {
        var dayOfWeek = String(time).split(" ")[0];
        var date = moment(time).format("YYYY-MM-DD");
        return dayOfWeek + ", " + date;
    };
    res.locals.getToday = function(n) {
        function addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }
        var today = new Date();
        var date = addDays(today, n);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.toString().split(" ")[3];
        return `${month}/${day}/${year}`;
    };
    next();
});

// initializing routes
app.use("/", indexRoutes);
app.get("*", function(req, res) {
    req.flash("error", "Sorry, the page you requested does not exist");
    req.session.save(function() {
        res.redirect("/");
    });
});
app.enable("trust proxy");

// connecting to the server
const expressServer = app.listen(
    process.env.PORT || 3000,
    process.env.IP,
    function() {
        console.log("The movewell server has started!!");
        console.log(process.env.MONGO_CONNECTION_STRING);
        console.log(process.env.PORT);
        console.log(process.env.IP);
    }
);