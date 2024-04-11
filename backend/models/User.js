const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        oEmail:  { type: String, match: /.+\@.+\..+/ },
        password: { type: String },
        role: {type: String, enum: ['admin','user'], required: true },
        designation: {type: String},
        image: {
            data: Buffer,
            contentType: String,
        },
        dob:{type: String},
        gender:{type:String},
        maritalStatus:{type:String},
        bloodGroup:{type:String},
        address: {type: String},
        contactNo : {type:String},
        aadharNo :{ type:String },
        joiningDate: { type:String },
        bond: { type:String },
        unique:{type:Number},
        registrationNo :{
            type: String ,
            default: function() {
                const max=20000;
                const min=99999;
                const n = Math.floor(Math.random()*(max-min+1)+min);
                return n;
              }
        },
        empId: {
            type:String ,
            default: function() {
                if(this.unique<1)
                {
                    return "2023"+"FB0"+this.unique;
                }else{
                    return "2023"+"FB"+this.unique;
                }
              }
        },
        email: { type:String},
        bankDetails:{
                accNo:{type:Number},
                ifscCode :{type:String},
                branch:{type:String},
                pinCode: {type:String}
        },
        taskCompleted:[ {task : {type:String}} ],
        salary:{
            ctc:{type:Number},
            basic:{type:Number},
            hra:{type:Number},
            travel:{type:Number},
            Basic:{type:Number},
            special:{type:Number},
            pf:{type:Number},
            gross:{type:Number},
            inHand:{type: Number}
        },
        pendingLeaves:{type:Number,default:0},
        approvedLeaves:{type:Number,default:0},
        docStatus:{type:String,default:'none'},
        experience:{type:String},
        notifications:[
            {
                type:{type:String},
                message:{type:String},
                date:{type:String},
                role:{type:String},
                status:{type:String},
                holidayDate:{type:String},
                id:{type:String},
                rejectionMessage:{type:String}
            }
        ],
        docLastModified:{type:Date},
        leaveLastModified:{type:Date},
        instaId:{type:String},
        twitterId:{type:String},
        linkedinId:{type:String},
        documents:{
            relievingLetter:{
                data: Buffer,
                contentType: String,
                status:{type:String},
                lastModified:{type:String},
                fileName:{type:String},
                rejectionMessage:{type:String}
            },
            aadharCard:{
                data: Buffer,
                contentType: String,
                status:{type:String},
                lastModified:{type:String},
                fileName:{type:String},
                rejectionMessage:{type:String}
            },
            panCard:{
                data: Buffer,
                contentType: String,
                status:{type:String},
                lastModified:{type:String},
                fileName:{type:String},
                rejectionMessage:{type:String}
            },
            graduate:{
                data: Buffer,
                contentType: String,
                status:{type:String},
                lastModified:{type:String},
                fileName:{type:String},
                rejectionMessage:{type:String}
            },
            tenth:{
                data: Buffer,
                contentType: String,
                status:{type:String},
                lastModified:{type:String},
                fileName:{type:String},
                rejectionMessage:{type:String}
            },
            twelth:{
                data: Buffer,
                contentType: String,
                status:{type:String},
                lastModified:{type:String},
                fileName:{type:String},
                rejectionMessage:{type:String}
            },
            resume:{
                data: Buffer,
                contentType: String,
                status:{type:String},
                lastModified:{type:String},
                fileName:{type:String},
                rejectionMessage:{type:String}
            }
        }
    }
)

userSchema.plugin(AutoIncrement, {inc_field: 'unique'});

module.exports = mongoose.model('User',userSchema) ;