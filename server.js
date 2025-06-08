const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const { ObjectId } = require('mongodb');
const { MongoClient, GridFSBucket } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Use environment port for Render

// Create uploads folder if not exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(uploadsDir));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // ✅ Set views path

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public'))); // ✅ Serve frontend files

// MongoDB URI and connection
const mongoURI = 'mongodb+srv://User-devwithme:user-devwithme@api-checkup.it4iz.mongodb.net/official_website_db?retryWrites=true&w=majority';
mongoose.connect(mongoURI);

let gridFSBucket;

mongoose.connection.once('open', async () => {
  console.log('✅ Connected to Mongoose');

  const client = new MongoClient(mongoURI);
  await client.connect();
  const db = client.db('official_website_db');
  gridFSBucket = new GridFSBucket(db, { bucketName: 'fs' });

  console.log('✅ GridFSBucket initialized');
});

// Mongoose model
const VoterSchema = new mongoose.Schema({
  name: String,
  voter_id: String,
  date_of_birth: String,
  gender: String,
  constituency: String,
  photo: ObjectId
}, { collection: 'voter_data_collection' });

const Voter = mongoose.model('Voter', VoterSchema);

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/voter_card_download', async (req, res) => {
  try {
    res.render('voter_card_download');
    console.log("GET /voter_card_download rendered");
  } catch (error) {
    console.error("Rendering error:", error);
    res.status(500).send("View render failed.");
  }
});

// Handle form submission
app.post('/submit-form', (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log('Form Submission:', req.body);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dipayansardar477@gmail.com',
      pass: 'issq ubqn uipo zfrf' // App Password only
    }
  });

  const mailOptions = {
    from: 'dipayansardar477@gmail.com',
    to: email,
    subject: 'Thank you for contacting us',
    text: `Hi ${name},\n\nThank you for reaching out to us. We have received your message:\n\n"${message}"\n\nWe will get back to you soon.\n\nBest regards,\nNEW GENERATION VOTING SYSTEM.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      return res.redirect('/');
    }
  });
});

// Route: Get voter details and base64 image from GridFS
app.post('/get-voter-details', async (req, res) => {
  const { voter_id, date_of_birth, gender } = req.body;

  try {
    const voter = await Voter.findOne({ voter_id, date_of_birth, gender });
    console.log(voter);

    if (!voter) {
      return res.status(404).json({ success: false, message: 'No voter found' });
    }

    if (voter.photo) {
      const photoId = new ObjectId(voter.photo);
      const downloadStream = gridFSBucket.openDownloadStream(photoId);
      const buffer = [];

      downloadStream.on('data', (chunk) => buffer.push(chunk));
      downloadStream.on('end', () => {
        const imageBuffer = Buffer.concat(buffer);
        const base64Image = imageBuffer.toString('base64');
        const photo_base64 = `data:image/jpeg;base64,${base64Image}`;

        res.json({
          success: true,
          data: {
            name: voter.name,
            voter_id: voter.voter_id,
            date_of_birth: voter.date_of_birth,
            gender: voter.gender,
            constituency: voter.constituency,
            photo_base64
          }
        });
      });

      downloadStream.on('error', (err) => {
        console.error('GridFS Stream error:', err);
        res.status(500).json({ success: false, message: 'Image download failed' });
      });
    } else {
      res.json({
        success: true,
        data: {
          name: voter.name,
          voter_id: voter.voter_id,
          date_of_birth: voter.date_of_birth,
          gender: voter.gender,
          constituency: voter.constituency,
          photo_base64: null
        }
      });
    }
  } catch (error) {
    console.error('Error fetching voter:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
