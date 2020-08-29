import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let json = await fs.readFile('./arquivos/grades.json', 'utf8');
    json = JSON.parse(json);

    res.status(200).send(json);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  let grade = req.body;

  try {
    let json = await fs.readFile('./arquivos/grades.json', 'utf8');
    json = JSON.parse(json);

    grade = { id: json.nextId++, timestamp: new Date(), ...grade };

    json.grades.push(grade);

    fs.writeFile('./arquivos/grades.json', JSON.stringify(json));
    res.status(200).send(grade);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  let newGrade = req.body;
  let id = req.params.id;

  try {
    let json = await fs.readFile('./arquivos/grades.json', 'utf8');
    json = JSON.parse(json);

    let indice = json.grades.findIndex((grade) => {
      return grade.id == id;
    });

    if (indice == -1) throw new Error('ID não existente');

    if (newGrade.student) {
      json.grades[indice].student = newGrade.student;
    }
    if (newGrade.subject) {
      json.grades[indice].subject = newGrade.subject;
    }
    if (newGrade.type) {
      json.grades[indice].type = newGrade.type;
    }
    if (newGrade.value) {
      json.grades[indice].value = newGrade.value;
    }

    fs.writeFile('./arquivos/grades.json', JSON.stringify(json));
    res.status(200).send(newGrade);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  let id = req.params.id;

  try {
    let json = await fs.readFile('./arquivos/grades.json', 'utf8');
    json = JSON.parse(json);

    let indice = json.grades.findIndex((grade) => {
      return grade.id == id;
    });

    if (indice == -1) throw new Error('ID não existente');

    json.grades.splice(indice, 1);

    fs.writeFile('./arquivos/grades.json', JSON.stringify(json));
    res.status(200).send();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
