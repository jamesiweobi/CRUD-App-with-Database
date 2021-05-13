const express = require('express');
const app = express();
const mongoose = require('mongoose');
// Declearing the mongodb Client
// const MongoClient = require('mongodb').MongoClient;

// Declearing the Connection Path
const connectionPath =
  'mongodb+srv://jamesIweobi:killbill@cluster0.ysfmd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// New Mongo client instance

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
app.get('/', (req, res) => {
  res.send('sent!');
});
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
// app.get();
// // Route to fetch data from the database
// app.get('/contacts', (req, res) => {
//   // routing the get request through the client
//   client.connect((err, connectedClient) => {
//     if (err) return res.status(500).json({ message: err });
//     const database = connectedClient.db();
//     database
//       .collection('contacts')
//       .find({})
//       .toArray((err, result) => {
//         if (err) return res.status(500).json({ message: err });
//         return res.status(200).json({
//           clients: result,
//           message: 'List of Contacts',
//         });
//       });
//   });
// });

// // to create create a new contact entry

// app.post('/contacts', (req, res) => {
//   client.connect((err, connectedClient) => {
//     if (err) return res.status(500).json({ message: err });
//     const db = connectedClient.db();
//     db.collection('contacts').insertOne(
//       {
//         // fetching the new contact from the request body
//         name: req.body.name,
//         job: req.body.job,
//         years: req.body.years,
//       },
//       (err, result) => {
//         if (err) return res.status(500).json({ message: err });
//         return res
//           .status(200)
//           .json({ message: 'New contact added to the data-Base' });
//       }
//     );
//   });
// });

// app.get('/contacts', (req, res) => {
//   client.connect((err, connectedClient) => {
//     if (err) return res.status(500).json({ message: err });
//     const db = connectedClient.db();
//     db.collection('contacts').findOneAndUpdate(
//       {
//         name: req.body.name,
//       },
//       (err, result) => {
//         if (err) return res.status(500).json({ message: err });
//         return res.status(200).json({ client: result });
//       }
//     );
//   });
// });

// app.put('/contact', (req, res)=>{
//   client.connect((err, connectedClient)=>{
//     if(err)return res.status(500).json({message:err});
//     const db = connectedClient.db()
//     return res.status(200).json({client: result});
//   })
// })
// // .put can edit / update
// // .delete for delting
// // .get by id and update

app.listen(5200, () => {
  console.log('server running on PORT: 5200');
});
