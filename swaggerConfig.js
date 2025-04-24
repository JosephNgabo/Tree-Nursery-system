// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
        url: 'https://tree-management-api.onrender.com',
      },
    ],
  },
  apis: ['./routes/*.js'], // Adjust path to your route files
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
