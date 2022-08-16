import { ApolloServer } from 'apollo-server-micro';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import Cors from 'micro-cors';
import http from 'http';
import axios from 'axios';
import express from 'express';
const mongoose = require('mongoose');
const { send } = require('micro');

require('dotenv').config();

import typeDefs from './graphql/schemas/schemas';
import resolvers from './graphql/resolvers/resolvers';

// Data Sources
import MagicEdenAPI from './graphql/datasources/magiceden';
import DropsAPI from './graphql/datasources/drops';

const port = process.env.PORT || 8080;

const app = express();
app.use(express.json());

const httpServer = http.createServer(app);

export const config = {
    api: {
        bodyParser: false
    }
};

const cors = Cors({
    allowCredentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    origin: '*'
});

app.use(cors);

// proxy route
app.get('/floor/:symbol', (req, res, next) => {
    const { symbol } = req.params;
    if (symbol) {
        axios
            .get(`https://api-mainnet.magiceden.dev/v2/collections/${symbol}/stats`)
            .then(resp => {
                const data = resp.data;
                res.status(200).send(data);
            })
            .catch(err => {
                res.json({ err });
            });
    } else {
        res.send('no symbol included');
    }
});

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            magicEdenAPI: new MagicEdenAPI(),
            dropsAPI: new DropsAPI()
        }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

export default apolloServer.start().then(() => {
    const handler = cors(apolloServer.createHandler({ path: '/api/graphql' }));

    mongoose.connect('mongodb+srv://vaporize:yzVaFifJjiofVmiy@cluster0.nbj3ep4.mongodb.net/vaporize_fi', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    mongoose.connection.once('open', () => {
        app.listen({ port }, () => {
            console.log(`Server running on port ${port}`);
        });
    });

    return cors((req, res) => req.method === 'OPTIONS' ? send(res, 200, 'ok') : handler(req, res));
});