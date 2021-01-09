const mongoose=require('mongoose');

const newCasesSchema=new mongoose.Schema({
    chart:{
        type:String,
        default: 'newCases'
    },
    date:{
        type:Date
    },
    amount:{
        type: Number
    }
});

const newCasesInfo = new mongoose.model('new cases',newCasesSchema);

module.exports = newCasesInfo;