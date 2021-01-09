const mongoose=require('mongoose');

const infoSchema=new mongoose.Schema({
    date:{
        type:Date
    },
    amount:{
        type: Number
    }
});

const Info = new mongoose.model('General',infoSchema);

module.exports = Info;