// entry js file

const express = require('express');
const app = express();
const mongoose = require('mongoose');

// mongoose set up and database connection
const connectionPath =
  'mongodb+srv://jamesIweobi:killbill@cluster0.ysfmd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

app.use(express.json());
mongoose.connect(
  connectionPath,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) {
      console.log('Database connection succesful');
    }
  }
);

// database Schema files
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connectio error!'));
const Schema = mongoose.Schema;
const agentModel = new Schema({
  name: String,
  email: String,
  country: String,
  rank: String,
  status: Boolean,
});

var Agent = mongoose.model('Agent', agentModel);

// application routes || request and response functions
app.post('/agents', (req, res) => {
  const reqBody = req.body;
  Agent.create(
    {
      name: reqBody.name,
      email: reqBody.email,
      country: reqBody.country,
      rank: reqBody.rank,
      status: reqBody.status,
    },
    (err, newAgent) => {
      if (err) {
        return res.status(500).json({ message: err });
      } else {
        return res
          .status(200)
          .json({ message: 'New Agent created!!!', newAgent });
      }
    }
  );
});
app.get('/agents', (req, res) => {
  Agent.find({}, (err, allAgents) => {
    if (err) {
      return res.status(500).json({ message: err });
    } else if (allAgents.length === 0) {
      return res.status(404).json({ message: 'No Agent Found!!!' });
    } else {
      return res.status(200).json({ message: 'Agents Found!!!', allAgents });
    }
  });
});

app.put('/agents/:id', (req, res) => {
  Agent.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      country: req.body.country,
      rank: req.body.rank,
      status: req.body.status,
    },
    (err, agent) => {
      if (err) {
        return res.status(500).json({ message: err });
      } else if (!agent) {
        return res.status(404).json({ message: 'No Agent Found!!!' });
      } else {
        agent.save((err, agent) => {
          if (err) return res.status(400).json({ message: err });
          return res.status(404).json({ message: 'No Agent Found!!!' });
        });
        return res.status(200).json({ message: 'Updated Agent Record' });
      }
    }
  );
});

// Node server
app.listen(5200, () => {
  console.log('server running on PORT: 5200');
});
