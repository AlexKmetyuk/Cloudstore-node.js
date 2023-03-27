const { model, Schema } = require("mongoose");

const CountersSchema = new Schema({
  counterName: { type: String, required: true },
  count: { type: Number, required: true },
});

const Counters = model("Counters", CountersSchema);

module.exports = { Counters };
