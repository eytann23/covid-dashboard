const express=require('express');
const dayInfo = require('../models/dayInfoModel');

const newCases = require('../models/newCasesModel');
const criticalCases = require('../models/criticalCasesModel');
const newCasesTrend = require('../models/newCasesTrendModel');
const seriousCases = require('../models/seriousCasesModel');
const curveData = require('../models/curveDataModel');
const testsToLocatePatients=require('../models/testsToLocatePatientsModel');
const spreadingAreas=require('../models/spreadingAreasModel');
const staffInIsolation=require('../models/staffInIsolationModel');
const hospitalStatus=require('../models/hospitalStatusModel');
const casesByAgeAndGender=require('../models/casesByAgeAndGenderModel');

const router = new express.Router();

function getModelByChartName(chartName,reqBody){

        switch (chartName) {
            case 'newCases':{
                const date=new Date(reqBody.date);
                const amount=reqBody.amount;
                const newCasesDayInfo=new newCases({
                    date,
                    amount
                })
                return newCasesDayInfo;
            }
                
            case 'criticalCases':{
                const date=new Date(reqBody.date);
                const amount=reqBody.amount;
                const criticalCasesDayInfo=new criticalCases({
                    date,
                    amount
                })
                return criticalCasesDayInfo;
            }
            case 'newCasesTrend':{
                const date=new Date(reqBody.date);
                const percentage=reqBody.percentage;
                const newCasesTrendDayInfo=new newCasesTrend({
                    date,
                    percentage
                })
                return newCasesTrendDayInfo;
            }
            case 'seriousCases':{
                const date=new Date(reqBody.date);
                const critical=reqBody.critical;
                const respirators=reqBody.respirators;
                const deaths=reqBody.deaths;
                const seriousCasesDayInfo=new seriousCases({
                    date,
                    critical,
                    respirators,
                    deaths
                })
                return seriousCasesDayInfo;
            }

            case 'curveData':{
                const date=new Date(reqBody.date);
                const totalCases=reqBody.totalCases;
                const newCases=reqBody.newCases;
                const recoverdCases=reqBody.recoverdCases;
                const curveDataDayInfo=new curveData({
                    date,
                    totalCases,
                    newCases,
                    recoverdCases
                })
                return curveDataDayInfo;
            }

            case 'testsToLocatePatients':{
                const date=new Date(reqBody.date);
                const testsAmount=reqBody.testsAmount;
                const positivePercentage=reqBody.positivePercentage;
                const testsToLocatePatientsInfo=new testsToLocatePatients({
                    date,
                    testsAmount,
                    positivePercentage
                })
                return testsToLocatePatientsInfo;
            }
            case 'spreadingAreas':{
                const city=reqBody.city;
                const totalCases=reqBody.totalCases;
                const activeCases=reqBody.activeCases;
                const newCasesLastSevenDays=reqBody.newCasesLastSevenDays;
                const testsLastSevenDays=reqBody.testsLastSevenDays;
                const activeCasesPerTenThousandPeople=reqBody.activeCasesPerTenThousandPeople;
                const spreadingAreasInfo=new spreadingAreas({
                    city,
                    totalCases,
                    activeCases,
                    newCasesLastSevenDays,
                    testsLastSevenDays,
                    activeCasesPerTenThousandPeople
                })
                return spreadingAreasInfo;
            }
            case 'staffInIsolation':{
                const nurses=reqBody.nurses;
                const doctors=reqBody.doctors;
                const other=reqBody.other;
                const staffInIsolationInfo=new staffInIsolation({
                    nurses,
                    doctors,
                    other
                })
                return staffInIsolationInfo;
            }
            case 'hospitalStatus':{
                const hospital=reqBody.hospital;
                const occupiedSpace=reqBody.occupiedSpace;
                const staffInIsolation=reqBody.staffInIsolation;
                const hospitalStatusInfo=new hospitalStatus({
                    hospital,
                    occupiedSpace,
                    staffInIsolation
                })
                return hospitalStatusInfo;
            }
            case 'casesByAgeAndGender':{
                const dataType=reqBody.dataType;
                const ageRange=reqBody.ageRange;
                const malePercentage=reqBody.malePercentage;
                const femalePercentage=reqBody.femalePercentage;
                const casesByAgeAndGenderInfo=new casesByAgeAndGender({
                    dataType,
                    ageRange,
                    malePercentage,
                    femalePercentage
                })
                return casesByAgeAndGenderInfo;
            }
        }

    
}

// chartName options = ['newCases','criticalCases','seriousCases','newCasesTrend','curveData']
router.post('/add-data', async (req, res) => {
    const chartName=req.query.chart;
    chartNameOptions = ['newCases','criticalCases','seriousCases','newCasesTrend','curveData',
                        'staffInIsolation','testsToLocatePatients','spreadingAreas','hospitalStatus','casesByAgeAndGender'];
    if (!chartNameOptions.includes(chartName)){
        return res.status(400).send({
            status: 400,
            message: "Invalid Chart Name: " + chartName,
        });
    }

    const dataModel = await getModelByChartName(chartName,req.body);
    await dataModel.save();
    res.send(dataModel);

})

router.post('/add-data/array', async (req, res) => {
    const chartName=req.query.chart;
    chartNameOptions = ['newCases','criticalCases','seriousCases','newCasesTrend','curveData',
                        'staffInIsolation','testsToLocatePatients','spreadingAreas','hospitalStatus','casesByAgeAndGender'];
    if (!chartNameOptions.includes(chartName)){
        return res.status(400).send({
            status: 400,
            message: "Invalid Chart Name: " + chartName,
        });
    }
    const dataArray=req.body;
    for(let data of dataArray){
        console.log(data);
        const dataModel = await getModelByChartName(chartName,data);
        await dataModel.save();
    }
    res.send(dataArray);
})


router.get('/all-data', async(req,res)=>{
    try{
        // const allData = await dayInfo.find({});
        // const allData2 = await newCases.find({});

        const allNewCases = await newCases.find({}).sort({date:1});
        const allCriticalCases = await criticalCases.find({}).sort({date:1});
        const allNewCasesTrend = await newCasesTrend.find({}).sort({date:1});
        const allSeriousCases = await seriousCases.find({}).sort({date:1});
        const allCurveData =await curveData.find({}).sort({date:1});
        const allTestsToLocatePatients=await testsToLocatePatients.find({}).sort({date:1});
        const allSpreadingAreas=await spreadingAreas.find({})
        const allStaffInIsolation=await staffInIsolation.find({});
        const allHospitalStatus=await hospitalStatus.find({});
        const allCasesByAgeAndGender=await casesByAgeAndGender.find({});
        const allData = [].concat(
            allNewCases, 
            allCriticalCases,
            allNewCasesTrend,
            allSeriousCases,
            allCurveData,
            allTestsToLocatePatients,
            allSpreadingAreas,
            allStaffInIsolation,
            allHospitalStatus,
            allCasesByAgeAndGender
            );

        if(allData.length>0){
            res.send(allData);
            
        }  
        else{
            res.status(404).send({
                message:'No data'
            })
        }
    }catch(err){
        res.status(500).send();
    }
})

module.exports=router;
