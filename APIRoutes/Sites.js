const express = require('express');
const router = express.Router();

const Site = require('../APIModels/Sites.model.js');

router.delete('/delete/:url', (req, res) => {
    Site.findOneAndRemove({url: req.params.url}, (err, site) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: "Site successfully deleted",
            id: site._id,
            url: site.url
        };
        return res.status(200).send(response);
    });
});

router.post('/add', (req, res) => {
    const site = new Site({
        url: req.body.url,
    })

    site.save()
        .then(() => res.status(200).json(`Site ${req.body.url} added!`))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.get('/getAll', (req, res) => {
    Site.find()
        .then(sites => res.status(200).json(sites))
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;