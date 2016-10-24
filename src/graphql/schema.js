import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import users from './queries/users';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: { users },
  }),
});

export default schema;
