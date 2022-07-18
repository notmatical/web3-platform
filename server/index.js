require('./strategies/discord');

import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { ApolloServer, makeExecutableSchema, mergeSchemas } from 'apollo-server-express';
import passport from 'passport';
require('dotenv').config();

import loggerConfig from './config/loggerConfig';

import cors from 'cors';

// Axios
import axios from 'axios';

import typeDefs from './graphql/schemas/schemas';
import resolvers from './graphql/resolvers/resolvers';
import schemaDirectives from './graphql/directives/directives';

import MagicEdenAPI from './graphql/datasources/magiceden';
import DropsAPI from './graphql/datasources/drops';

const { NODE_ENV, SESSION_NAME, SESSION_SECRET, SESSION_MAX_AGE, MONGO_DB_URI, PORT } = process.env;

const app = express();
const port = process.env.PORT || 8080;
const routes = require('./routes');

mongoose.set('useCreateIndex', true);

// Secure Headers with Helmet
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());

// Use cors to allow all requests
// app.use(cors({
//     origin: '*'
// }));

// serve react application TODO

const MongoStore = connectMongo(session);
app.use(
    session({
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        name: SESSION_NAME,
        secret: SESSION_SECRET,
        resave: true,
        rolling: true,
        saveUninitialized: false,
        cookie: {
            maxAge: parseInt(SESSION_MAX_AGE, 10),
            sameSite: true,
            httpOnly: true,
            secure: !NODE_ENV.trim() === 'development'
        }
    })
);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            magicEdenAPI: new MagicEdenAPI(),
            dropsAPI: new DropsAPI()
        }
    },
    schemaDirectives,
    playground: true,
    context: ({ req, res }) => ({ req, res })
});

// Start passport service
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api/v1', routes);

// Express Proxy Route
app.get('/drops', (req, res, next) => {
    axios
        .get('https://api.howrare.is/v0.1/drops')
        .then(resp => {
            const data = resp.data.result.data;
            res.json({ data });
        })
        .catch(err => {
            res.json({ err });
        });
});

// logging with morgan
if (NODE_ENV === 'development') {
    loggerConfig(app);
}

server.applyMiddleware({
    app,
    cors: {
        credentials: true,
        origin: ['http://localhost:3000', 'http://localhost:8080']
    }
});

mongoose.connect('mongodb://localhost:27017/minxlabs-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
    app.listen({ port }, () => {
        console.log(`Server running on port ${port}`);
    });
});
mongoose.connection.on('error', error => console.error(error));