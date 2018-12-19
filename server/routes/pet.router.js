const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const {rejectUnauthenticated} = require('../modules/authentication-middleware')

// This route *should* return the logged in users pets
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {  //uses If statement fence instead of Dane's rejectUnauthenticated middleware
        console.log('/pet GET route');
        console.log('is authenticated?', req.isAuthenticated());
        console.log('user', req.user);
        let queryText = `SELECT * FROM "pet" WHERE "pet"."person_id" = $1`;
        pool.query(queryText, [req.user.id]).then((result) => {
            res.send(result.rows);
        }).catch((error) => {
            console.log(error);
            res.sendStatus(500);
        });
    }//end IF
    else{
        res.sendStatus(403);
    }

});

// This route *should* add a pet for the logged in user
router.post('/', rejectUnauthenticated, (req, res) => {  //uses Dane's middleware, no need for a fence here
    console.log('/pet POST route');
    console.log(req.body);
    console.log('is authenticated?', req.isAuthenticated());
    console.log('user', req.user);
    const query = `INSERT INTO "pet" ("firstname", "person_id") 
    VALUES ($1, $2);`
    const queryValues = [req.body.firstname, req.user.id];
    pool.query(query, queryValues).then( (response) =>{
        console.log('POST response', response);
        res.sendStatus(201)
    }).catch( (error) => {
        console.log('error', error);
        res.sendStatus(500)
    })
    res.sendStatus(200);

});

module.exports = router;
