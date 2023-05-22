const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryObject = repositories.find((repository) => {
    if(repository.id === id){
      repository.title = title;
      repository.url = url;
      repository.techs = techs;

      return repository;
    }
  });

  if (!repositoryObject) {
    return response.status(404).json({ error: "Repository not found" });
  }

  return response.json(repositoryObject);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryObject = repositories.find((repository) => {
    if(repository.id === id) {
      repository.likes = repository.likes + 1;
      return repository;
    }
  });

  if (!repositoryObject) {
    return response.status(404).json({ error: "Repository not found" });
  }

  return response.json(repositoryObject);
});

module.exports = app;
