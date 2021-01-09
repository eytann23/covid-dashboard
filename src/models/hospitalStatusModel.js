const mongoose=require('mongoose');

const hospitalStatusSchema=new mongoose.Schema({
    chart:{
        type:String,
        default: 'hospitalStatus'
    },
    hospital:{
        type: String,
        required:true,
    },
    occupiedSpace:{
        type: Number,
    },
    staffInIsolation:{
        type: Number,      
    },
    
});


const hospitalStatusInfo = new mongoose.model('hospitals status',hospitalStatusSchema);

module.exports = hospitalStatusInfo;