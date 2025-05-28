// 1. Use require instead of import
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

// Cargar preguntas desde JSON. En esta variable dispones siempre de todasl as preguntas de la "base de datos"
const questions = JSON.parse(fs.readFileSync("./questions.json", "utf-8"));

// Endpoint para obtener una pregunta aleatoria (con filtro por categoría)
app.get("/api/question", (req, res) => {
  const categoryQuestion = req.query.category;
  if (categoryQuestion) {
    const responseCategory = questions.filter(
      (element) => element.category === categoryQuestion
    );
    if (responseCategory.length > 0) {
      const index = Math.floor(Math.random() * (responseCategory.length + 1));
      res.send(responseCategory[index]);
    } else {
      res
        .status(404)
        .send(`No hay preguntas para la categoría ${categoryQuestion}`);
    }
  } else {
    const responseCategory = [...questions];
    const index = Math.floor(Math.random() * (responseCategory.length + 1));
    res.send(responseCategory[index]);
  }
});

// Endpoint para obtener categorías únicas
app.get("/api/categories", (req, res) => {
  const category = new Set(questions.map((element) => element.category));
  res.send([...category]);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Trivia escuchando en http://localhost:${PORT}`);
});
