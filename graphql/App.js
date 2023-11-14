const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./modal/events");
const User = require("./modal/user");
const bcrypt = require("bcryptjs");
const app = express();
const events = [];
const users = [];
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
    type User {
      _id:ID,
      email:String!
      password:String
    }

    input EventInput {
      title:String!
      description:String!
      price:Float!
      date:String!
    }
    
    input InputUser {
      email:String!
      password:String!
      
    }
    
    type RootQuery {
      events:[Event!]!
    }

    type RootMutation {
      createEvent(inputEvent:EventInput) : Event
      createUser(inputUser:InputUser) : User
    }

    schema {
      query: RootQuery
      mutation: RootMutation

    }
          `),
    rootValue: {
      events: () => {
        return Event.find()
          .then((event) => {
            return event.map((event) => {
              return {
                ...event._doc,
              };
            });
          })
          .catch(() => {});
      },
      users: () => {
        return User.find()
          .then((user) => {
            return user.map((user) => {
              return {
                ...user._doc,
              };
            });
          })
          .catch(() => {});
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
            return { ...results._doc };
          })
          .catch((err) => {
            console.log(err);
          });
        events.push(event);
        return event;
      },
      createUser: (args) => {
        return User.findOne({ email: args.inputUser.email }).then((user) => {
          if (user) {
            throw new Error("Email already exist");
          }
          return bcrypt
            .hash(args.inputUser.password, 12)
            .then((hashedPassword) => {
              const user = new User({
                email: args.inputUser.email,
                password: hashedPassword,
              });
              return user.save();
            })
            .then((result) => {
              return { ...result._doc };
            })
            .catch((err) => {
              throw err;
            });
        });
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
