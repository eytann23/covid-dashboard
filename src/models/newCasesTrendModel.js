const mongoose=require('mongoose');

const newCasesTrendSchema=new mongoose.Schema({
    chart:{
        type:String,
        default: 'newCasesTrend'
    },
    date:{
        type:Date
    },
    percentage:{
        type: Number
    }
});

const newCasesTrendInfo = new mongoose.model('new cases trend',newCasesTrendSchema);

module.exports = newCasesTrendInfo;