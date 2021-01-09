const mongoose=require('mongoose');

const staffInIsolationSchema=new mongoose.Schema({
    chart:{
        type:String,
        default: 'staffInIsolation'
    },
    nurses:{
        type: Number,
        required:true,
        min:0,
    },
    doctors:{
        type: Number,
        required:true,
        min:0,
    },
    other:{
        type: Number,
        required:true,
        min:0,
    },
    
});


const staffInIsolationInfo = new mongoose.model('staff in isolation',staffInIsolationSchema);

module.exports = staffInIsolationInfo;