/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-Session');
router.get('/session',function(req, res){
    console.log(req.body);
    res.json({
        data: 10.5
    });
});
router.get('/userinfo',function(req, res){
    console.log(req.body);
    res.json({
        "data": {
            "name": "World",
            "firstLastName": "",
            "secondLastName": "",
            "dateOfBirth": -622598400000,
            "clientEmail": "john.doe@mapfre.com",
            "nif": "01234567-A",
            "applicationData": {
                "language": "en"
            }
        }
    });
});
module.exports = router;