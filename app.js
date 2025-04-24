const express = require('express');
const cors = require('cors');
const treeRoutes = require('./routes/treeRoutes');
const userRoutes = require('./routes/userRoutes');
const treeNurseryRoutes = require('./routes/treeNurseryRoutes');
const treeFieldRoutes = require('./routes/treeFieldRoutes');
const { swaggerUi, swaggerSpec } = require('./swaggerConfig');
// Remove monitoring routes for now
// const monitoringRoutes = require('./routes/monitoringRoutes');

const app = express();

// Swagger docz
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/trees', treeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tree-nursery', treeNurseryRoutes);
app.use('/api/tree-field', treeFieldRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
// Listen on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on this ports ${PORT}`);
}); 