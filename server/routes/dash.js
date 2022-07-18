const router = require('express').Router();
const fetch = require('node-fetch');

router.get('/discord', (req, res) => {
    console.log('/discord endpoint');
    console.log(req.user);
    if (req.user) {
        res.send(req.user);
    } else {
        res.redirect('http://localhost:3000/discord/link');
    }
});

router.get('/drops', (req, res) => {
    console.log('request made to /drops')
    fetch('https://api.howrare.is/v0.1/drops')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch(err => console.error(err))
});

module.exports = router;