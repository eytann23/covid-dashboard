const mongoose=require('mongoose');

const criticalCasesSchema=new mongoose.Schema({
    chart:{
        type:String,
        default: 'criticalCases'
    },
    date:{
        type:Date
    },
    amount:{
        type: Number
    }
});

const criticalCasesInfo = new mongoose.model('critical cases',criticalCasesSchema);

module.exports = criticalCasesInfo;