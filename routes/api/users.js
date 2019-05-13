const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const {check, validationResult} = require('express-validator/check');

//load User model
const User = require('../../models/User');

//@route POST api/users/register
//@desc Tests users route
//@access Public
router.post('/register',[
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})

], (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: 'errors'})
    }
    User.findOne({email: req.body.email})
        .then(user=>{
            if(user){
                return res.status(400).json({email: 'Email already exists'})
            }
            else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', //Size
                    r: 'pg', //Rating,
                    d: 'mm', //Default
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user=>res.json(user))
                            .catch(err=>console.log(err))
                    })
                })
            }
        });
});

module.exports = router;
