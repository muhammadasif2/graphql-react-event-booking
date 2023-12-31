const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const eventSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  createdEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});
module.exports = mongoose.model("User", eventSchema);
