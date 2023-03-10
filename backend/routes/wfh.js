const router = require('express').Router();
const Wfh = require('../models/Wfh');

// create work from home 63ca538f1cf979b9520e9a9a
router.post('/:id',async (req,res)=>{
    const val = req.body.val;
    console.log(req.body);
    try {
        const result = await Wfh.exists({id: req.params.id,date:req.body.date});
        console.log(result);
        if(result==null){
            const user = await Wfh.create(req.body);
            res.status(200).json("half day work from home !!!");
        }else{
            if(val=="halfDay"){
                const wfhuser = await Wfh.findOneAndUpdate({id:req.params.id,date:req.body.date},{$push:{halfDay:req.body.halfDay}},{new:true},
                    function (err, docs) {
                        if (err){
                            console.log(err)
                        }
                        else{
                            res.status(200).json("half day work from home !!!");
                        }
                })
            }else if(val=="fullDay"){
                const wfhuser = await Wfh.findOneAndUpdate({id:req.params.id,date:req.body.date},{$push:{fullDay:req.body.fullDay}},{new:true},
                    function (err, docs) {
                        if (err){
                            console.log(err)
                        }
                        else{
                            res.status(200).json("full day work from home !!!");
                        }
                })
            }
        }
    } catch (error) {
        // res.status(500).json(error)
    }
})

// Get task of a user
router.get('/:id/:date',async (req,res)=>{
    try {
        const result = await Wfh.exists({id: req.params.id,date:req.params.date});
        if(result==null){
            res.status(401).json(null);
        }else{
            const task = await Wfh.find({id: req.params.id,date:req.params.date}) 
            res.status(200).json(task)
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

// Get wfh users of a date
router.get('/:date',async (req,res)=>{
    try {
        const task = await Wfh.find({date:req.params.date}) 
        res.status(200).json(task)
    } catch (error) {
        res.status(500).json(error);
    }
})

// get all dates of wfh users
router.get('/wfh/getdates/users',async (req,res)=>{
    try {
        const users = await Wfh.aggregate([{$project : { date:1 }}]);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;

// Get all work from home users
router.get('/wfh/users/allwfhusers',async (req,res)=>{
    try {
        const users = await Wfh.find({}); 
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error);
    }
})