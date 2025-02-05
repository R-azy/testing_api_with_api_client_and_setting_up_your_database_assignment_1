const express = require('express');
const { resolve } = require('path');
const fs = require('fs');

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/students/above-threshold', (req, res) => {
  const { threshold } = req.body;
  
  // Validate input
  if (typeof threshold !== 'number') {
    return res.status(400).json({ error: 'Threshold must be a number' });
  }

  // Check if data file exists
  if (!fs.existsSync('./data.json')) {
    return res.status(500).json({ error: 'Student data file not found' });
  }

  try {
    const studentsData = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

    // Ensure it's an array
    if (!Array.isArray(studentsData)) {
      return res.status(500).json({ error: 'Invalid student data format' });
    }

    // Filter students above threshold
    const qualifyingStudents = studentsData.filter(student => student.total > threshold);

    res.json({  
      count: qualifyingStudents.length,
      students: qualifyingStudents
    });
  } catch (error) {
    res.status(500).json({ error: 'Error reading or parsing student data' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
