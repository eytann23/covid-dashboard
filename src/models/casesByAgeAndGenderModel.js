const mongoose=require('mongoose');

const casesByAgeAndGenderSchema=new mongoose.Schema({
    chart:{
        type:String,
        default: 'casesByAgeAndGender'
    },
    dataType:{
        type:String,
        enum: ['cases', 'deaths', 'respirators', 'critical'],
        required:true,
    },
    ageRange:{
        type: String,
        enum: ['0-9', '10-19', '20-29', '30-39','40-49','50-59','60-69','70-79','80-89','+90'],
        required:true,
    },
    malePercentage:{
        type:Number,
        required:true,
    },
    femalePercentage:{
        type:Number,
        required:true,
    }

});


const casesByAgeAndGenderInfo = new mongoose.model('age and gender',casesByAgeAndGenderSchema);

module.exports = casesByAgeAndGenderInfo;