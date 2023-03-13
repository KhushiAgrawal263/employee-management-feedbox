const router = require('express').Router();
const mongoose = require('mongoose')
const User = require('../models/User');
const upload = require('../upload');
const uploadFile = require('../uploadFile');
const fs = require('fs');

// upload image
router.post('/upload/:id', upload.single('image'), async (req, res) => {
    const objectId = mongoose.Types.ObjectId(req.params.id)
    console.log(req.file);
    const image = {
        data: fs.readFileSync("uploads/" + req.file.filename),
        contentType: "image/png"
    }
    const user = await User.findByIdAndUpdate(objectId, { image: image })
    res.status(200).json(user);
})

// get all users
router.get('/', async (req, res) => {
    const user = await User.aggregate([{ $match: { role: "user" } }, { $project: { documents: 0 } }]);
    const count = await User.count({ "role": "user" });
    res.status(200).json({ count, user });
})

// get a user
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const user = await User.aggregate([{ $match: { _id: mongoose.Types.ObjectId(id) } }, { $project: { documents: 0, notifications: 0 } }]);
    res.status(200).json(user[0]);
})

// update user
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true
        })
        if (user) {
            res.status(200).json("User updated Successfully");
        } else {
            res.status(401).json("No user found with this id!!!")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

// get salary of a user
router.get('/salary/:id', async (req, res) => {
    try {
        // const user = await User.findById({_id : req.params.id});
        const user = await User.aggregate([{ $match: { role: "user" } }, { $project: { documents: 0 } }]);

        if (user) {
            res.status(200).json(user.salary);
        } else {
            res.status(401).json("No user found with this id!!!")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

// add task 
router.put('/updatetask/:id', async (req, res) => {
    console.log(req.body);
    try {
        const user = await User.findById({ _id: req.params.id });
        if (user) {
            User.updateOne(
                { _id: req.params.id },
                { $push: { taskCompleted: req.body } },
                function (err, result) {
                    if (err) {
                        res.status(401).send(err);
                    } else {
                        res.status(200).send({ message: "Task added Successfully!!!" });
                    }
                }
            );
        } else {
            res.status(401).json("No user found with this id!!!")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

// register user
router.post('/register', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})

// login
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.aggregate([{ $match: { oEmail: email } }, { $project: { documents: 0, notifications: 0 } }]);
        !user && res.status(401).json("wrong password or username");
        if (user[0].password != password) {
            res.status(401).json("wrong password or username")
        }

        if (user[0].role != req.body.role) {
            res.status(401).json("Not a valid user!!!");
        }
        const userDetails = {
            id: user[0]._id,
            email: user[0].email,
            name: user[0].name,
            role: user[0].role,
            empId: user[0].empId,
            designation: user[0].designation,
            image: user[0].image
        }
        res.status(200).json(userDetails)
    } catch (err) {
        // res.status(401).json(err);
    }
})

// find users with pending or approved leaves
router.get('/get/user', async (req, res) => {
    try {
        const result = await User.aggregate([{ $match: { $or: [{ pendingLeaves: { $gte: 1 } }, { approvedLeaves: { $gte: 1 } }] } }, { $project: { documents: 0, image: 0, notifications: 0 } }, { $sort: { leaveLastModified: -1 } }]);
        console.log(result);
        res.status(200).json(result)
    } catch (error) {
        res.status(401).json(error);
    }
})

// find birtday dates of all users
router.get('/get/birthdaydates/users', async (req, res) => {
    try {
        const result = await User.aggregate([{ $match: { role: "user" } }, { $project: { array: "$dob", name: "$name", empId: "$empId" } }]);
        res.status(200).json(result)
    } catch (error) {
        res.status(401).json(error);
    }
})

///////////////// Notifications /////////////////////////////

// Add notification to a specific user
router.post('/user/user/addnotifi/:id', async (req, res) => {
    const val = req.body.val;
    try {
        const user = await User.findOneAndUpdate({ _id: req.params.id }, { $push: { notifications: req.body } }, { new: true },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.status(200).json(docs);
                }
            })
    } catch (error) {
        // res.status(500).json(error);
    }
})

//Get all notifications of a user
router.get('/user/get/user/all/notifi/:id', async (req, res) => {
    try {
        const result = await User.aggregate([{ $match: { _id: mongoose.Types.ObjectId(req.params.id) } }, { $project: { notifications: 1 } }]);
        res.status(200).json(result)
    } catch (error) {
        res.status(401).json(error);
    }
})


// Get all unseen notifications of a user
router.get('/user/get/user/notifi/:id', async (req, res) => {
    try {
        const result = await User.findOne({ _id: req.params.id });
        const val = {
            notifications: result.notifications
        }
        res.status(200).json(val)
    } catch (error) {
        res.status(401).json(error);
    }
})

// Get all seen notifications of a user
router.get('/user/get/user/seen/notifi/:id', async (req, res) => {
    try {
        const result = await User.aggregate([{ $match: { _id: mongoose.Types.ObjectId(req.params.id) } }, { $project: { notifications: 1 } }]);
        res.status(200).json(result)
    } catch (error) {
        res.status(401).json(error);
    }
})

//Add notifications to all the users
router.post('/user/user/addnotifi/', async (req, res) => {
    try {
        const user = await User.updateMany({ role: "user" }, { $push: { notifications: req.body } }, { new: true },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.status(200).json(true);
                }
            })
    } catch (error) {
        // res.status(500).json(error);
    }
})

// Add notifications to all the users expect one 
router.post('/user/oneuser/addnotifi/:id', async (req, res) => {
    try {
        const user = await User.updateMany({ _id: { $ne: req.params.id }, role: { $ne: 'admin' } }, { $push: { notifications: req.body } }, { new: true },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.status(200).json(true);
                }
            })
    } catch (error) {
        // res.status(500).json(error);
    }
})

//Add notification to the admin
router.post('/admin/user/addnotifi/', async (req, res) => {
    try {
        const user = await User.updateMany({ role: "admin" }, { $push: { notifications: req.body } }, { new: true },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.status(200).json(docs);
                }
            })
    } catch (error) {
        // res.status(500).json(error);
    }
})

// change the status of notification from unseen to seen 
router.put('/user/user/updatestatus/:id/:notifiId', async (req, res) => {
    try {
        const user = await User.updateOne({ _id: req.params.id, "notifications._id": req.params.notifiId }, {
            $set: {
                "notifications.$.status": "seen",
            }
        }, { new: true },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.status(200).json(docs);
                }
            })
    } catch (error) {
        // res.status(500).json(error);
    }
})

// check if birthday notification exists
router.get('/birthday/notification/:id', async (req, res) => {
    try {
        const result = await User.find({ role: 'admin', notifications: { $elemMatch: { type: "Birthday", id: req.params.id } } })
        res.status(200).json(result)

        // if(result && result.length>0){
        //     res.status(200).json({result:true})
        // }else{
        //     res.status(200).json({result:false})
        // }
    } catch (error) {
        res.status(401).json(error);
    }
})

//delete notifications of admin
router.put('/birthday/notification/', async (req, res) => {
    try {
        const result = await User.updateMany({ role: 'admin' }, { "$pull": { "notifications": {} } })
        res.status(200).json(result)
    } catch (error) {
        res.status(401).json(error);
    }
})

// delete notification of a user
router.put('/delete/notification/user/:id', async (req, res) => {
    try {
        const result = await User.updateMany({ _id: req.params.id }, { "$pull": { "notifications": {} } })
        res.status(200).json(result)
    } catch (error) {
        res.status(401).json(error);
    }
})

// Add Birthday notification to the admin
router.post('/admin/user/addnotifi/:id', async (req, res) => {
    try {
        const result = await User.find({ role: 'admin', notifications: { $elemMatch: { type: "Birthday", id: req.params.id } } })
        if (!result || result.length == 0) {
            const user = await User.updateMany({ role: "admin" }, { $push: { notifications: req.body } }, { new: true },
                function (err, docs) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        res.status(200).json(docs);
                    }
                })
        } else {
            res.status(500).json("Notification already exists...")
        }
    } catch (error) {
        // res.status(500).json(error);
    }
})

// Get notification of a user of a particular date
router.get('/get/all/notifi/', async (req, res) => {

})


/////////////// documents ///////////////////////////

// upload file
router.post('/uploadFile/:id/:name/:date', uploadFile.single('file'), async (req, res) => {
    const objectId = mongoose.Types.ObjectId(req.params.id)
    const image = {
        data: fs.readFileSync("uploadFile/" + req.file.filename),
        contentType: req.file.mimetype,
        status: 'uploaded',
        lastModified: req.params.date,
        fileName: req.file.originalname.split(".")[0]
    }
    // console.log(image);
    if (req.params.name == 'relievingLetter') {
        const user = await User.findByIdAndUpdate(objectId, { $set: { 'documents.relievingLetter': image }, docStatus: 'pending', docLastModified: Date.now() })
        res.status(200).json(user);
    } else if (req.params.name == 'aadharCard') {
        const user = await User.findByIdAndUpdate(objectId, { $set: { 'documents.aadharCard': image }, docStatus: 'pending', docLastModified: Date.now() })
        res.status(200).json(user);
    } else if (req.params.name == 'panCard') {
        const user = await User.findByIdAndUpdate(objectId, { $set: { 'documents.panCard': image }, docStatus: 'pending', docLastModified: Date.now() })
        res.status(200).json(user);
    } else if (req.params.name == 'graduate') {
        const user = await User.findByIdAndUpdate(objectId, { $set: { 'documents.graduate': image }, docStatus: 'pending', docLastModified: Date.now() })
        res.status(200).json(user);
    } else if (req.params.name == 'tenth') {
        const user = await User.findByIdAndUpdate(objectId, { $set: { 'documents.tenth': image }, docStatus: 'pending', docLastModified: Date.now() })
        res.status(200).json(user);
    } else if (req.params.name == 'twelth') {
        const user = await User.findByIdAndUpdate(objectId, { $set: { 'documents.twelth': image }, docStatus: 'pending', docLastModified: Date.now() })
        res.status(200).json(user);
    } else if (req.params.name == 'resume') {
        const user = await User.findByIdAndUpdate(objectId, { $set: { 'documents.resume': image }, docStatus: 'pending', docLastModified: Date.now() })
        res.status(200).json(user);
    }
})

// find users with documents
router.get('/get/document/users', async (req, res) => {
    try {
        const data = await User.aggregate([{ $match: { $or: [{ docStatus: "pending" }, { docStatus: "approved" }] } }, { $project: { documents: 0, image: 0, notifications: 0 } }, {
            $sort: { docLastModified: -1 }
        }]);
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
})

// update approved status of documents
router.put('/approveorreject/document/:id/:name/:type', async (req, res) => {
    const field = `documents.${req.params.name}.status`;
    console.log(req.params.name, req.params.id, req.params.type, req.body.rejectionMessage);
    try {
        if (req.params.name == 'relievingLetter') {
            const user = await User.updateMany({ _id: req.params.id }, { "$set": { "documents.relievingLetter.status": req.params.type, "documents.relievingLetter.rejectionMessage": req.body.rejectionMessage } })
            res.status(200).json(user);
        } else if (req.params.name == 'aadharCard') {
            const user = await User.findByIdAndUpdate({ _id: req.params.id }, { $set: { 'documents.aadharCard.status': req.params.type , "documents.aadharCard.rejectionMessage": req.body.rejectionMessage } })
            res.status(200).json(user);
        } else if (req.params.name == 'panCard') {
            const user = await User.findByIdAndUpdate({ _id: req.params.id }, { $set: { 'documents.panCard.status': req.params.type ,"documents.panCard.rejectionMessage": req.body.rejectionMessage } })
            res.status(200).json(user);
        } else if (req.params.name == 'graduate') {
            const user = await User.findByIdAndUpdate({ _id: req.params.id }, { $set: { 'documents.graduate.status': req.params.type, "documents.graduate.rejectionMessage": req.body.rejectionMessage  } })
            res.status(200).json(user);
        } else if (req.params.name == 'tenth') {
            const user = await User.findByIdAndUpdate({ _id: req.params.id }, { $set: { 'documents.tenth.status': req.params.type, "documents.tenth.rejectionMessage": req.body.rejectionMessage  } })
            res.status(200).json(user);
        } else if (req.params.name == 'twelth') {
            const user = await User.findByIdAndUpdate({ _id: req.params.id }, { $set: { 'documents.twelth.status': req.params.type, "documents.twelth.rejectionMessage": req.body.rejectionMessage  } })
            res.status(200).json(user);
        } else if (req.params.name == 'resume') {
            const user = await User.findByIdAndUpdate({ _id: req.params.id }, { $set: { 'documents.resume.status': req.params.type,"documents.resume.rejectionMessage": req.body.rejectionMessage  } })
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(401).json(error);
    }
})

// get a particular document of a user
router.get('/documents/:id/:name', async (req, res) => {
    const user = await User.aggregate([{ $match: { _id: mongoose.Types.ObjectId(req.params.id) } }, { $project: { documents: `$documents.${req.params.name}` } }]);
    res.status(200).json(user);
})

// get status and lastModified of documents of a user
router.get('/documents/:id', async (req, res) => {
    const user = await User.aggregate([{ $match: { _id: mongoose.Types.ObjectId(req.params.id) } }, {
        $project: {
            documents: {
                relievingLetter: "$documents.relievingLetter.status",
                aadharCard: "$documents.aadharCard.status",
                panCard: "$documents.panCard.status",
                graduate: "$documents.graduate.status",
                twelth: "$documents.twelth.status",
                tenth: "$documents.tenth.status",
                resume: "$documents.resume.status"
            }, lastModified: {
                relievingLetter: "$documents.relievingLetter.lastModified",
                aadharCard: "$documents.aadharCard.lastModified",
                panCard: "$documents.panCard.lastModified",
                graduate: "$documents.graduate.lastModified",
                twelth: "$documents.twelth.lastModified",
                tenth: "$documents.tenth.lastModified",
                resume: "$documents.resume.lastModified"
            }, experience: 1, docStatus: 1
        }
    }]);
    res.status(200).json(user);
})

// get the status of a particular document of a user
router.get('/documents/:id/:name', async (req, res) => {
    const user = await User.aggregate([{ $match: { _id: mongoose.Types.ObjectId(req.params.id) } }, {
        $project: {
            documents: {
                relievingLetter: "$documents.relievingLetter.status",
                aadharCard: "$documents.aadharCard.status",
                panCard: "$documents.panCard.status",
                graduate: "$documents.graduate.status",
                twelth: "$documents.twelth.status",
                tenth: "$documents.tenth.status",
                resume: "$documents.resume.status"
            }
        }
    }]);
    res.status(200).json(user);
})

// delete document of a user
router.put('/delete/document/:id', async (req, res) => {
    try {
        const result = await User.updateMany({ _id: req.params.id }, { "$unset": { "documents.relievingLetter": "" } })
        res.status(200).json(result)
    } catch (error) {
        res.status(401).json(error);
    }
})



module.exports = router;
