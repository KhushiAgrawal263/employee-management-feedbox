const router = require('express').Router();
const Leave = require('../models/Leave');

// Apply for leave
router.post('/apply/:id',async (req,res)=>{
    console.log(req.body,"server");
    try {
        const result = await Leave.exists({id: req.params.id});
        if(result==null){
            const user = await Leave.create({...req.body,leaveLastModified:Date.now()});
                res.status(200).json("Leave Applied at first successsfully !!!");
        }else{
            const updatedUser=await Leave.findOneAndUpdate({id:req.params.id},{ $push:{ pending:req.body.pending},leaveLastModified:Date.now()},{new:true},
                function (err, docs) {
                    if (err){
                        console.log(err)
                    }
                    else{
                        res.status(200).json("Leave applied successfully !!!");
                    }
            })
        }
    } catch (error) {
        // res.status(401).json(error)
    }
})

// Get user for leave 
router.get('/:id',async(req,res)=>{
    try {
        const result = await Leave.find({id: req.params.id});
        res.status(200).json(result)
    } catch (error) {
        res.status(401).json(error);
    }
})

// Get all leaves 
router.get('/leaves/getallLeaves',async(req,res)=>{
    try {
        // const result = await Leave.aggregate([{$project : { "result":'$pending.dates.date' }}]);
        const result = await Leave.aggregate([{$project : { array: [ "$approved.date" ] }}]);
        res.status(200).json(result)
    } catch (error) {
        res.status(401).json(error);
    }
})

// Get users by date
router.get('/usersbydate/:date',async(req,res)=>{
    try {
        // const result = await Leave.find({'pending':{'dates':{"$elemMatch":{'date':req.params.date}}}});
        const result = await Leave.find({'pending.dates':{"$elemMatch":{'date':req.params.date}}});
        res.status(200).json(result)
    } catch (error) {
        res.status(401).json(error);
    }
})

// Get approved leaves users by date
router.get('/approved/usersbydate/:date',async(req,res)=>{
    try {
        const result = await Leave.find({'approved':{"$elemMatch":{'date':req.params.date}}});
        res.status(200).json(result)
    } catch (error) {s
        res.status(401).json(error);
    }
})

// Update leave
router.put('/approve/:id',async (req,res)=>{
    console.log(req.body.approved);
    try {
        const updatedUser=await Leave.findOneAndUpdate({id:req.params.id},{ $push:{ approved:req.body.approved} },{new:true},
            function (err, docs) {
                if (err){
                    console.log(err)
                }
                else{
                    res.status(200).json("Leave Approved successfully !!!");
                }
            })
    } catch (error) {
        // res.status(401).json(error)
    }
})

// delete pending leave 
router.put('/delete/:id/:date',async (req,res)=>{
    console.log(req.params.id);
    console.log(req.params.date);
    try {
        const user = await Leave.updateOne({id:req.params.id},{$pull:{"pending.$[].dates":{date:req.params.date}}},{new:true},
            function (err, docs) {
                if (err){
                    console.log(err)
                }
                else{
                    res.status(200).json("Leave deleted successfully !!!");
                }
            })
        console.log(user);
    } catch (error) {
        console.log(error);
        // res.status(401).json(error)
    }
})


module.exports = router;