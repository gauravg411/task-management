const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/taskmanagement')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes

app.get('/', (req, res) => {
  res.send('API is running');
})
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
