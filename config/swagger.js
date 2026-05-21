const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pokédex API",
      version: "1.0.0",
      description: "API para consultar Pokémon desde MySQL y MongoDB",
    },
    servers: [
      {
        url: process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`,
        description: "Servidor Principal",
      },
      {
        url: "http://localhost:3000",
        description: "Servidor Local (Fallback)",
      },
    ],
  },
  apis: ["./routes/*.js"], // Archivos que contienen las anotaciones
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
