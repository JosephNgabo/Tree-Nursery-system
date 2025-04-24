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
        url: 'http://localhost:3000/api/users/', // or your server IP
      },
    ],
  },
  apis: ['./routes/*.js'], // Adjust path to your route files
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
