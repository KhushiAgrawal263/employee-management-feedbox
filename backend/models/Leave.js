const mongoose = require('mongoose');

const leaveSchema = mongoose.Schema({
    id: {type:String},
    name:{type:String},
    empId:{type:String},
    // totalLeaves: {type:Number},
    pending:[{
        
            leaveType:{type:String},
            dates:[
                {
                        date:{type:String}
                }
            ],
            reason:{type:String},
            doc:{ data: Buffer, contentType: String },
            status:{type:String}
    }],
    approved:[{
            leaveType:{type:String},
            date:{type:String},
            reason:{type:String},
            doc:{ data: Buffer, contentType: String },
            status:{type:String}
    }]
})

module.exports = mongoose.model('Leave',leaveSchema) 