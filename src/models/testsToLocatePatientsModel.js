const mongoose=require('mongoose');

const testsToLocatePatientsSchema=new mongoose.Schema({
    chart:{
        type:String,
        default: 'testsToLocatePatients'
    },
    date:{
        type: Date,
        required:true,
    },
    testsAmount:{
        type: Number,
        required:true,
        min:0,
    },
    positivePercentage:{
        type: Number,
        required:true,
        min:0,
        max:100,
    },
    
});


const testsToLocatePatientsInfo = new mongoose.model('tests to locate patients',testsToLocatePatientsSchema);

module.exports = testsToLocatePatientsInfo;