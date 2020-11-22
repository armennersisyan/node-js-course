const mongoose = require('mongoose');

class Mongo {
  connect = (key) => {
    mongoose.connect(key, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }
}

module.exports = new Mongo();
