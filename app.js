const express = require('express');
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('./swaggerConfig');

// const treeRoutes = require('./routes/treeRoutes');
const userRoutes = require('./routes/userRoutes');
const treeNurseryRoutes = require('./routes/treeNurseryRoutes');
const treeFieldRoutes = require('./routes/treeFieldRoutes');
const treeGrowingMethodsRoutes = require('./routes/treeGrowingMethodsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
// app.use('/api/trees', treeRoutes);
app.use('/api', userRoutes);
app.use('/api/tree-nursery', treeNurseryRoutes);
app.use('/api/trees-field', treeFieldRoutes);
app.use('/api/tree-growing-methods', treeGrowingMethodsRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
