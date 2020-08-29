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

export default router;
