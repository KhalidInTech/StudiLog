const express = require('express')
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const fs = require('fs');
const user = require('../models/user');

//image upload
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
})

var upload = multer({
    storage: storage,
}).single("image");

//home page
router.get('/', async (req, res) => {
    try {
        const users = await User.find().exec();
        res.render('index', {
            title: "Home Page",
            users: users,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

//add user page
router.get('/add', (req, res) => {
    res.render('add_user', {title: "Add Users"});
});

//edit user page
router.get('/edit/:id', async (req, res) => {
    try{
        let id = req.params.id;
        let user = await User.findById(id).exec();
        if (user) {
            res.render('edit_user', {
                title: "Edit User",
                user: user
            });
        } else {
            res.redirect("/");
        }
    } catch(err) {
        res.json({ message: err.message });
    }
});

// insert user into database route
router.post('/add', upload, async (req, res)=> {
    try{
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,   
        });

        await user.save();

        req.session.message = {
            type: 'success',
            message: "User Added Successfully!"
        };
        res.redirect('/');
    } catch (err) {
        res.json({message: err.message, type: 'danger'});
    }
});

//update user into database route
router.post('/update/:id', upload, async (req, res) => {
    try {
        const id = req.params.id;
        let new_img = '';

        if (req.file) {
            new_img = req.file.filename;
            try {
                fs.unlinkSync("./uploads/" + req.body.old_img);
            } catch (err) {
                console.log(err);
            }
        } else {
            new_img = req.body.old_img;
        }
        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_img,
        });

        req.session.message = {
            type: 'success',
            message: "User Updated Successfully!"
        }
        res.redirect('/');

    } catch (err) {
        console.log(err.message);
        res.json({ message: err.message, type: 'danger' });
    }
});

//delete user into database route
router.get('/delete/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id).exec();
        if (user.image != '') {
            try{
                fs.unlinkSync('./uploads/' + user.image);
            }
            catch(err){
                console.log(err);
            }
        } 

        req.session.message = {
            type: 'info',
            message: "User Deleted Successfully!"
        }
        res.redirect('/');
    } catch(err) {
        console.log(err.message);
        res.json({ message: err.message });
    }
});

module.exports = router;