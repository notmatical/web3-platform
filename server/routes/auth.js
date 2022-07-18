const router = require('express').Router();
const passport = require('passport');

router.get('/:publicKey', (req, res, next) => {
    passport.authenticate('discord', {
        state: req.params.publicKey
    }, () => next())(req, res, next);
});

router.get('/redirect', passport.authenticate('discord', {
    failureRedirect: 'http://localhost:3000/discord/link',
    successRedirect: 'http://localhost:3000/discord/link'
}));

router.get('/discord', (req, res) => {
    console.log('/discord endpoint');
    console.log(req.user);
    if (req.user) {
        res.send(req.user);
    } else {
        res.redirect('http://localhost:3000/discord/link');
    }
});

router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:3000');
});

module.exports = router;