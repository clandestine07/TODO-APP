const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(bodyParser.json());

function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === (id)) return i;
  }
  return -1;
}

function removeAtIndex(arr, index) {
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArray.push(arr[i]);
  }
  return newArray;
}

app.get('/todo', (req, res) => {
  fs.readFile("todo.json", "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});


app.post('/todo', (req, res) => {
  const newTodo = {
    id: Math.floor(Math.random() * 1000000), // unique random id
    description: req.body.description
  };
  fs.readFile("todo.json", "utf8", (err, data) => {
    if (err) throw err;
    const todo = JSON.parse(data);
    todo.push(newTodo);
    fs.writeFile("todo.json", JSON.stringify(todo), (err) => {
      if (err) throw err;
      res.status(201).json(newTodo);
    });
  });
});

app.delete('/todo/:id', (req, res) => {

  fs.readFile("todo.json", "utf8", (err, data) => {
    if (err) throw err;
    let todo = JSON.parse(data);
    let todoIndex = findIndex(todo, parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      todo = removeAtIndex(todo, todoIndex);
      fs.writeFile("todo.json", JSON.stringify(todo), (err) => {
        if (err) throw err;
        res.status(200).send();
      });
    }
  });
});

app.get("/" , (req , res) => {
  res.sendFile(path.join(__dirname ,"todo.html"));
})
// for all other routes, return 404
// app.use((req, res, next) => {
//   res.status(404).send();
// });
app.put('/update/:id'  , (req,res) => {
  fs.readFile("todo.json" , "utf8" , (err , data) => {
    if(err) throw err;
    let todo = JSON.parse(data); 
    let todoIndex = findIndex(todo , parseInt(req.params.id));
    if(todoIndex === -1){
      res.status(404).send("error");
    }else{
      let newTodoDescription = req.body.description; 
      todo[todoIndex].description = newTodoDescription;
      fs.writeFile("todo.json" , JSON.stringify(todo) , (err) => {
        if(err) throw err;
        res.status(200).send("updated");
      });
    };
  });
});
app.listen(2002);
