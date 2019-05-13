const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const {check, validationResult} = require('express-validator/check');

//load User model
const User = require('../../models/User');

//@route POST api/users/register
//@desc register User
//@access Public
router.post('/register',[
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})

],
    async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {name, email, password} = req.body;

    try {
        //See if user exists
        let user  = await User.findOne({email});

        if(user) {
            res.status(400).json({errors: [{msg: 'User already exists'}]})
        }

        const avatar = gravatar.url(email, {
            s: '200', //Size
            r: 'pg', //Rating,
            d: 'mm', //Default
        });

        const newUser = new User({
            name: name,
            email: email,
            avatar: avatar,
            password: password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newUser.password, salt);
        await user.save();

        res.send('User route');

    } catch(err) {
        console.log(err.message);
        res.status(400).send('Server error');
    }


});

//@route POST api/users/login
//@desc Login User /Returning JWR Token
//@access Public

router.post('/login', (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    //find user by email
    User.findOne({email})
        .then(user=>{
            //Check for user
            if(!user) {
                return res.status(400).json({email: 'User not found'});
            }

            //Check password
            bcrypt.compare(password, user.password)
                .then(isMatch=>{
                    if(isMatch){
                        res.json({msg: 'Success'})
                    } else {
                        return res.status(400).json({password: 'Password incorrect'});
                    }
                })
        })
});

module.exports = router;
