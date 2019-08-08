const express = require('express');
const userdb = require('./userDb');
const postDb = require('../posts/postDb')
const router = express.Router();



router.post('/', validateUser, (req, res) => {
    userdb.insert(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            res.status(500).json({ message: "User not created."  })
        })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
     req.body.user_id = req.params.id;
    postDb.insert(req.body)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(error => {
            res.status(500).json({ message: "Could not create post." })
        })

});

router.get('/', (req, res) => {
    userdb.get()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(error => {
            res.status(500).json({ message: "Could not find users" });
        })
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {

    userdb.getUserPosts(req.params.id)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            res.status(500).json({ message: " error getting post" })
        })
});

router.delete('/:id', validateUserId, (req, res) => {
    userdb.remove(req.params.id)
        .then(user => {
            res.status(200).json({ message: "User deleted successful. " });
        })
        .catch(error => {
            res.status(500).json({ message: "User not deleted." })
        })
});

router.put('/:id', validateUser, validateUserId, (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    userdb.update(id, changes)
        .then(update => {
            res.status(200).json(update)
        })
        .catch(error => {
            res.status(500).json({ message: "Did not update." } )
        })
});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;
    
    userdb.getById(id) 
        .then(user => {
            if (user) {
                console.log(user);
                req.user = user;
                next();
            } else {
                res.status(404).json({ message: "invalid user id" })
            }
        })
        .catch(error => {
            res.status(500).json({ message: " User not found" })
        })
};

function validateUser(req, res, next) {
    const body = req.body;
    const name = req.body.name;

    if (!body) {
        res.status(400).json({ message: 'missing user data' })
    } else if (!name) {
        res.status(400).json({ message: "missing required name field" })
    } else {
        next();
    }
};

function validatePost(req, res, next) {
    console.log(req.body)
    const body = req.body;
    const text = req.body.text;

    if (!body) {
        res.status(400).json({ message: 'missing post data' })
    } else if (!text) {
        res.status(400).json({ message: "missing required text field" })
    } else {
        next();
    }
};

module.exports = router;
