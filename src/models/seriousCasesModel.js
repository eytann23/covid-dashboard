const mongoose=require('mongoose');

const seriousCasesSchema=new mongoose.Schema({
    chart:{
        type:String,
        default: 'seriousCases'
    },
    date:{
        type:Date
    },
    critical:{
        type: Number,
    },
    respirators:{
        type:Number,
    },
    deaths:{
        type:Number,
    }

});


const seriousCasesInfo = new mongoose.model('serious cases',seriousCasesSchema);

module.exports = seriousCasesInfo;