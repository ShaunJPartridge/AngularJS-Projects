const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router('./data/db.json')
const userdb = JSON.parse(fs.readFileSync('./data/users.json', 'UTF-8'))

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

const SECRET_KEY = '123456789'

const expiresIn = '1h'

// Create a token from a payload 
function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token 
function verifyToken(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

// Check if the user exists in database
function isAuthenticated({email, password}){
  return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
}

// Register New User
server.post('/auth/register', (req, res) => {
  console.log("register endpoint called; request body:");
  // update req.body to also contain fname and lname
  const {email, password, firstname, lastname} = req.body;
  console.log(req.body);

  if(isAuthenticated({email, password}) === true) {
    const status = 401;
    const message = 'Email and Password already exist';
    res.status(status).json({status, message});   
    return
  }

    fs.readFile("./data/users.json", (err, data) => {  
        if (err) {
        const status = 401
        const message = err
        res.status(status).json({status, message})
        return
        };

        // Get current users data
        var data = JSON.parse(data.toString());

        // Get the id of last user
        var last_item_id = data.users[data.users.length-1].id;
        //const id = last_item_id + 1
        //Add new user
        data.users.push({id: last_item_id + 1, email: email, password: password}); //add some data
        
        fs.writeFile("./data/users.json", JSON.stringify(data), (err, result) => {  // WRITE // used to have var writeData = rest of code
            if (err) {
            const status = 401
            const message = err
            res.status(status).json({status, message})
            return
            }
        });
    });

    fs.readFile("./data/db.json", (err, data) => {  
      if (err) {
      const status = 401
      const message = err
      res.status(status).json({status, message})
      return
      };

      // Get current users data
      var data = JSON.parse(data.toString());

      // Get the id of last user
      var last_item_id = data.users[data.users.length-1].id;

      // Create routine object
      const routine = {type:"",workouts:[]}
      
      //Add new user
      data.users.push({id: last_item_id + 1, email: email, password: password, firstname: firstname,
         lastname: lastname, routine: routine}); //add some data
      console.log(data)

      fs.writeFile("./data/db.json", JSON.stringify(data), (err, result) => {
        if (err) {
          const status = 401;
          const message = err;
          res.status(status).json({status,message})
          return
        }
      });

    // Create token for new user
    //const access_token = createToken({email, password})
    console.log("Access Token:" + createToken({email,password}));
    res.status(200).json(createToken({email,password}))
    })
})

// Login to one of the users from ./users.json
server.post('/auth/login', (req, res) => {
  console.log("login endpoint called; request body:");
  console.log(req.body);
  const {email, password} = req.body;
  if (isAuthenticated({email, password}) === false) {
    const status = 401
    const message = 'Incorrect email or password'
    res.status(status).json({status, message})
    return
  }
  //const access_token = createToken({email, password})
  console.log("Access Token:" + createToken({email, password}));
  res.status(200).json(createToken({email,password}))
})

server.use(/^(?!\/auth).*$/,  (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({status, message})
    return
  }
  try {
    let verifyTokenResult;
     verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

     if (verifyTokenResult instanceof Error) {
       const status = 401
       const message = 'Access token not provided'
       res.status(status).json({status, message})
       return
     }
     next()
  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({status, message})
  }
})

server.use(router)

server.listen(8000, () => {
  console.log('Run Auth API Server')
})