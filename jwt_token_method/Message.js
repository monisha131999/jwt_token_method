const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserData',
    },
    message: String,
  });
  module.exports = mongoose.model('Message', messageSchema);
