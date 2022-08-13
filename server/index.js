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

// Axios
import axios from 'axios';

import typeDefs from './graphql/schemas/schemas';
import resolvers from './graphql/resolvers/resolvers';

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
    playground: true,
    context: ({ req, res }) => ({ req, res })
});

// Start passport service
app.use(passport.initialize());
app.use(passport.session());

app.get('/getMETransactionInstructionsForSnipe', async (req, res) => {
    if (
        !req.query ||
        req.query.buyer == '' ||
        req.query.seller == '' ||
        req.query.auctionHouse == '' ||
        req.query.tokenMint == '' ||
        req.query.tokenAddress == '' ||
        req.query.price == '' ||
        req.query.expiry == '' ||
        req.query.pdaAddress == '' ||
        req.query.sellerReferral == ''
    ) {
        return res.status(400).send({
            message: ''
        });
    } else {
        // gets the transaction instructions from ME
        const transaction = await axios
            .get('https://api-mainnet.magiceden.dev/v2/instructions/buy_now', {
                params: {
                    buyer: req.query.buyer,
                    seller: req.query.seller,
                    auctionHouseAddress: req.query.auctionHouse.length > 0 ?
                        req.query.auctionHouse :
                        'E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe',
                    tokenMint: req.query.tokenMint,
                    tokenATA: req.query.tokenAddress,
                    price: req.query.price,
                    buyerReferral: process.env.SOLANA_FEE_ACCOUNT,
                    sellerReferral: req.query.sellerReferral == '' ? '' : req.query.sellerReferral,
                    buyerExpiry: '0',
                    sellerExpiry: req.query.expiry,
                },
                headers: {
                    Authorization: process.env.ME_AUTHORIZATION_TOKEN,
                },
            })
            .then((response2) => {
                res.send(response2.data);
                buyInstructionCount += 1;
                if (String(req.query.buyer) in buyWalletMintPair) {
                    buyWalletMintPair[String(req.query.buyer)].push(
                        String(req.query.tokenMint)
                    );
                } else {
                    buyWalletMintPair[String(req.query.buyer)] = [
                        String(req.query.tokenMint),
                    ];
                }

                return response2.data;
            })
            .catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    return res.status(502).send({
                        message: 'Failed to get instruction from Magic Eden. Error from Magic Eden: ' +
                            error.response.status,
                        data: error.response.data,
                        config: error.config,
                    });
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                    return res.status(502).send({
                        message: 'Got no response regarding buy instruction from Magic Eden. Error from Magic Eden: ' +
                            error.response.status,
                        data: error.response.data,
                        request: error.request,
                        config: error.config,
                    });
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    return res.status(502).send({
                        message: 'Something wrong with the setup regarding buy instruction from Magic Eden. Error from Magic Eden: ' +
                            error.response.status,
                        error: error.message,
                        config: error.config,
                    });
                }
            });
        return transaction;
    }
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