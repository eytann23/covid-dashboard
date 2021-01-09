const mongoose=require('mongoose');

const curveDataSchema=new mongoose.Schema({
    chart:{
        type:String,
        default: 'curveData'
    },
    date:{
        type:Date
    },
    totalCases:{
        type: Number,
    },
    newCases:{
        type:Number,
    },
    recoverdCases:{
        type:Number,
    }

});


const curveDataInfo = new mongoose.model('curve data',curveDataSchema);

module.exports = curveDataInfo;