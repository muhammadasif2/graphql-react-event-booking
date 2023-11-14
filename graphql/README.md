**Graphql**

Graphql is a query language that is an alternative to API that is used to get and post data with a single endpoint like POST/graphql. It runs on the server takes user request, and send them on to the server so the server decides its kind of request and filter data and pass it. So it used operation type, endpoint, and request fields

**React Project on Event booking**

This is react based event booking project where users login or register, and perform events for booking like crud functions for booking and canceling events. its will use filter like events like "created by a particular user" or "booked by users". We will get list of events, single record of events.

**Whats being used**

- `express`
- `graphql`
- `express-graphql`
- `npm install mongoose --save`
- `nodemon` refresh server when changes occur

**How to create event modal**

`const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const eventSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  date: {
    type: Date,
    require: true,
  },
});
module.exports = mongoose.model("Event", eventSchema);
`
**How to connect DB with mongoose**
`mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.y2lwxgj.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log("errors", error);
  });`
**Type Mutation**
` type RootMutation {
      createEvent(inputEvent:EventInput) : Event
      createUser(inputUser:InputUser) : User
    }`

` createEvent: (args) => {
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
      },`

**Schema**
` schema {
query: RootQuery
mutation: RootMutation

    }`
