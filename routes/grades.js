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

router.get('/:id', async (req, res) => {
  let id = req.params.id;

  try {
    let json = await fs.readFile('./arquivos/grades.json', 'utf8');
    json = JSON.parse(json);

    let grade = json.grades.filter((grade) => {
      return grade.id == id;
    });

    if (grade.length === 0) throw new Error('ID não existente');

    res.status(200).send(grade);
  } catch (err) {
    console.log(err);
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

router.post('/totalPorEstudanteMateria', async (req, res) => {
  try {
    const params = req.body;

    let json = await fs.readFile('./arquivos/grades.json', 'utf8');
    json = JSON.parse(json);

    const grades = json.grades.filter((grade) => {
      return grade.student == params.student && grade.subject == params.subject;
    });

    const total = grades.reduce((prev, curr) => {
      return prev + curr.value;
    }, 0);

    res.status(200).send({ total: total });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/average/:subject/:type', async (req, res) => {
  try {
    let subject = req.params.subject;
    let type = req.params.type;

    let json = await fs.readFile('./arquivos/grades.json', 'utf8');
    json = JSON.parse(json);

    const grades = json.grades.filter((grade) => {
      return grade.subject == subject && grade.type == type;
    });

    if (grades.length == 0)
      throw new Error(
        'Não foram encontrados registros para os parâmetros informados'
      );

    const total = grades.reduce((prev, curr) => {
      return prev + curr.value;
    }, 0);

    const media = total / grades.length;

    res.status(200).send({ media });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
