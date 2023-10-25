const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(bodyParser.json());
app.get("/", (req, res, next) => {
  res.send("Graphql backend server started");
});
const events = [];
app.use(
  "/graphql",

  graphqlHTTP({
    schema: buildSchema(`
    type Event {
      _id:ID!
      title:String!
      description:String!
      price:Float!
      date:String!
    }
    input EventInput {
      title:String!
      description:String!
      price:Float!
      date:String!
    }
    type RootQuery {
      events:[Event!]!
    }

    type RootMutation {
      createEvent(inputEvent:EventInput) : Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation

    }
          `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.inputEvent.title,
          price: +args.inputEvent.price,
          description: args.inputEvent.description,
          date: args.inputEvent.date,
        };
        events.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);
app.listen(3000);
