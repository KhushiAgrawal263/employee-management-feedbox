const mongoose = require('mongoose');


const wfhschema = new mongoose.Schema({
    id: {type:String},
    name:{type:String},
    empId:{type:String},
    date :{type:String},
    fullDay:[
        {
            first :{type:String},
            second :{type:String},
            third :{type:String},
            fourth :{type:String},
        }
    ],
    halfDay:[
        {
            first :{type:String},
            second :{type:String},
            third :{type:String}
        }
    ]
});

module.exports = mongoose.model('Wfh',wfhschema) 