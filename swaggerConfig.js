// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const isProduction = process.env.NODE_ENV === 'production';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tree Nursery Management API',
      version: '1.0.0',
      description: 'API documentation for the Tree Nursery Management System',
    },
    servers: [
      {
        url: isProduction
          ? 'https://tree-management-api.onrender.com/api'
          : 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./routes/*.js'], // Adjust path to your route files
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
