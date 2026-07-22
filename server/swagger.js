const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: process.env.API_URL,
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
        },
      },
    },
  },

  apis: [
    "./docs/*.swagger.js",
  ],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;