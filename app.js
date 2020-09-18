var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var formidable = require('formidable');
var path = require('path');
var http = require('http');
var socket = require('socket.io');
var bodyParser = require('body-parser');

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var redis = require('redis');
var client = redis.createClient();

var app = express();
var http = http.Server(app);
var io = socket(http);

io.on('connection', function (socket) {
	console.log('novo usuário');
});

var indexRouter = require('./routes/index')(io);
var adminRouter = require('./routes/admin')(io);

app.use(
	session({
		store: new RedisStore({
			host: 'localhost',
			logErrors: true,
			port: 6379,
			client: client,
		}),
		secret: 'p@assw0ord',
		resave: true,
		saveUninitialized: true,
	})
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

app.use(function (req, res, next) {
	req.body = {};
	let contentType = req.headers['content-type'];

	if (
		req.method === 'POST' &&
		contentType.indexOf('multipart/form-data;') > -1
	) {
		var form = formidable.IncomingForm({
			uploadDir: path.join(__dirname, '/public/images'),
			keepExtensions: true,
		});

		form.parse(req, function (err, fields, files) {
			req.fields = fields;
			req.files = files;

			next();
		});
	} else {
		next();
	}
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

http.listen(3000, function () {
	console.log('Servidor em execução.');
});
