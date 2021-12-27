const { app, port } = require('./app');
// const express = require('express');
const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const session = require('express-session');
// const morgan = require('morgan');
// const MongoStore = require('connect-mongo');
// const Sentry = require('@sentry/node');
// const Tracing = require('@sentry/tracing');
// const connectDB = require('./config/database');
// require('dotenv').config();
// const { authCheck } = require('./middlewares/AuthMiddleware');
// const AuthRoute = require('./routes/AuthRouter');
// const {
//     clientErrorHandler,
//     ErrorHandler,
// } = require('./middlewares/errors/HandleErrors');

// const LogStream = fs.createWriteStream(path.join(__dirname, 'syncwallet.log'), {
//     flags: 'a',
// });

// // Create an instance of express
// const app = express();

// // Connect to database
// connectDB();

// const port = process.env.PORT || 4000;

// Sentry.init({
//     dsn: 'https://4f608a2114b440e9957713559edc96e5@o439434.ingest.sentry.io/5406225',
//     integrations: [
//         // enable HTTP calls tracing
//         new Sentry.Integrations.Http({ tracing: true }),
//         // enable Express.js middleware tracing
//         new Tracing.Integrations.Express({ app }),
//     ],
//     tracesSampleRate: 0.7,
// });

// Serve the express app over https
const server = http.createServer(app);

// // Register middlewares
// app.use(Sentry.Handlers.requestHandler());
// app.use(Sentry.Handlers.tracingHandler());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(morgan('common', { stream: LogStream }));
// app.use(express.json());
// app.use(
//     session({
//         secret: process.env.APP_KEY,
//         saveUninitialized: true,
//         cookie: { maxAge: 1000 * 60 * 60 * 24 },
//         resave: false,
//         store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
//     }),
// );
// if (app.get('env') === 'production') {
//     app.set('trust proxy', 1);
//     // session.cookie.secure = true;
// }
// app.use((req, res, next) => {
//     res.locals.authenticated = !!req.session.user;
//     res.locals.user = req.session.user ? req.session.user : null;
//     next();
// });
// app.use(
//     express.urlencoded({
//         extended: true,
//     }),
// );

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// if (process.env.NODE_ENV === 'development') {
//     app.enable('verbose errors');
// } else {
//     app.disable('verbose errors');
// }

// // application endpoints
// app.use('/auth', AuthRoute);
// app.get('/', (request, response) => {
//     response.render('index', {
//         message: 'Sync Wallet!',
//     });
// });

// app.get('/dashboard', authCheck, (request, response) => {
//     response.render('dashboard');
// });

// app.get('/error', () => {
//     throw new Error('Testing Error');
// });

// app.use(Sentry.Handlers.errorHandler());

// // Error handling middlewares
// app.use(clientErrorHandler);
// app.use(ErrorHandler);

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
