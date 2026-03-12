const mongoose = require("mongoose");

const bitrixSchema = new mongoose.Schema(
{
  domain: {
    type: String,
    required: true
  },

  member_id: {
    type: String,
    required: true,
    unique: true
  },

  access_token: {
    type: String,
    required: true
  },

  refresh_token: {
    type: String,
    required: true
  },

  endpoint: {
    type: String
  },

  auth_expires: {
    type: Number
  },

  placement: {
    type: String
  },

  status: {
    type: String
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("BitrixInstall", bitrixSchema);