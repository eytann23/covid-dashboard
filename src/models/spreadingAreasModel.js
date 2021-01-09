const mongoose=require('mongoose');

const spreadingAreasSchema=new mongoose.Schema({
    chart:{
        type:String,
        default: 'spreadingAreas'
    },
    city:{
        type:String
    },
    totalCases:{
        type: Number,
    },
    activeCases:{
        type:Number,
    },
    newCasesLastSevenDays:{
        type:Number,
    },
    testsLastSevenDays:{
        type:Number,
    },
    activeCasesPerTenThousandPeople:{
        type:Number,
        min:0,
        max:100,
    }
});


const spreadingAreasInfo = new mongoose.model('spreading areas',spreadingAreasSchema);

module.exports = spreadingAreasInfo;