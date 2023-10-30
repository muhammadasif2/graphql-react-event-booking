const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./modal/events");
const app = express();
const events = [];
app.use(bodyParser.json());
app.get("/", (req, res, next) => {
  res.send("Graphql backend server started");
});
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
        const event = new Event({
          title: args.inputEvent.title,
          price: +args.inputEvent.price,
          description: args.inputEvent.description,
          date: new Date(args.inputEvent.date),
        });

        event
          .save()
          .then((results) => {
            console.log(results);
          })
          .catch((err) => {
            console.log(err);
          });
        return event;
      },
    },
    graphiql: true,
  })
);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.y2lwxgj.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log("errors", error);
  });
