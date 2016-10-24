import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './graphql/schema'
import socket from './socket/server'

var app = express();

socket();
app.use('/graphql', graphqlHTTP(req => ({
  schema,
  rootValue: { request: req },
  pretty: true,
  graphiql: app.get('env') !== 'production',
})));

console.log('Running a GraphQL API server at localhost:4000/graphql');
app.listen(4000);
