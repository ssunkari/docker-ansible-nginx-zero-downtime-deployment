var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var Promise = require('bluebird');

var LocalStrategy = require('passport-local').Strategy;
var shaGen = require('./middleware/shaGen');

var config = require('./config');

var globalHelperFunctions = require('./globalHelperFunctions');

var couchDbFactory = require('./dataSources/db/couchbaseDb');

var docStoreInstance = Promise.promisifyAll(require('./dataSources/db/docStore')(couchDbFactory, config.get('couchbase')));
var db = require('./middleware/auth')(docStoreInstance);

require('./extensions');
// require('./cronJob');

var routes = require('./routes/index');
var app = express();

var busboy = require('connect-busboy');
//...

//passport setup

passport.use(new LocalStrategy(
    function (username, password, cb) {
        db.users.findByUsername(username, password).then(function (userObj) {
            if (!userObj) {
                return cb(null, false);
            }
            if (userObj.password === shaGen(password.trim())) {
                return cb(null, userObj);
            } else {
                return cb(null, false);
            }
        });
    }));

passport.serializeUser(function (user, cb) {
    cb(null, {
        username: user.username
    });
});

passport.deserializeUser(function (user, cb) {
    cb(null, user);

});

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(busboy());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../', '/public')));

//routes
app.use('/', routes);

// var sgEmailClient = require('./sendGridEmailApi');

var sgEmailClient = function () {
    return Promise.resolve(true);
};

// smsClient = require('twilio')(config.get('twilio:accountSid'), config.get('twilio:authToken'));

app.use('/signup', require('./routes/signup')(docStoreInstance, sgEmailClient));
app.use('/', require('./routes/passwordRecovery')(docStoreInstance, sgEmailClient));
app.use('/houseshares', require('./routes/houseshares')(docStoreInstance, sgEmailClient));
app.use('/profile', require('./routes/profile')(docStoreInstance, sgEmailClient));

// app.use('/bills', require('./routes/bills')(redisClient, sgEmailClient, smsClient));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
var debug = require('debug')('myapp:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
var io = require('socket.io').listen(server);
require('../src/middleware/eventListeners')(io);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
    default:
        throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = app;