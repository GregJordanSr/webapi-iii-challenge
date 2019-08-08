const express = require('express');
const router = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

const server = express();

server.use(express.json());
server.use(logger);
server.use('/users', router);
server.use('/posts', postRouter);




server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

server.get('/', (req, res) => {
  res.status(200).json({working: "process.env.WORK", })
})
//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('Origin'
    )}`
  )
  next();
};



module.exports = server;
