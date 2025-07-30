const express = require('express');
const app = express();
const cors = require('cors');
const toyRoutes = require('./routes/toys');
const foodRoutes = require('./routes/food');
const groomingRoutes = require('./routes/grooming');

app.use(cors());
app.use(express.json());

app.use('/api/toys', toyRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/grooming', groomingRoutes);

app.get('/', (req, res) => res.send('Pet Store API Running'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Furpawtique backend running on http://localhost:${PORT}`);
});


module.exports = app;
