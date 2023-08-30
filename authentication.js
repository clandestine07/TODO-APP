/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let users = [];

//post request for sign up
app.post('/create' , (req ,res) => {
    const newUser = {  // take input of user using body object
      email : req.body.email,
      password : req.body.password,
      id : Math.floor(Math.random() * 10000)
    } 
    let userExist = false;
    for(let i=0 ; i<users.length ; i++){
        if(users[i].email === newUser.email && users[i].password === newUser.password){  // check if the user already exist in the database
            userExist = true;   
            break;
        }
    }
    if(userExist){
      res.status(404);
    }else{
      users.push(newUser);
      res.status(201).send("SIGN UP SUCCESSFUL");
    }
});

//get the details of the users
app.get('/get'  , (req,res) => {
    var email = req.headers.email;
    var password = req.headers.password;
    console.log("Received Email:", email);
    console.log("Received Password:", password);

    var userDetails = false;

    for(let i=0 ; i<users.length ; i++){
      if(users[i].email === email && users[i].password === password){
        userDetails = true;
        break;
      }
    }
    if(userDetails){
      let newArray = [];
      for(let i=0 ; i<users.length ; i++){
        newArray.push({
          email : users[i].email,
          id : users[i].id,
          firstName : users[i].firstName,
          lastName : users[i].lastName,
          password : users[i].password
        })
      }
      res.json({
        users : newArray
      })
    }
    else{
      res.status(404).send("INCORRECT DETAILS");
    }

});

//post request for login up
// app.post('/login' , (req , res) => {
//     var userDetail = req.body;
// })

app.listen(1001);