
const allDataUrl='http://localhost:3000/all-data';

async function getData(url) {
    let data;
    await fetch(url)
    .then((res)=>{
        if (res.ok)
            return res.json();
        else
            throw new Error(res.status)
    }).then((jsonObj)=>{
        data=[...jsonObj];       
    }).catch((err)=>{
        console.log(err);
    })
    return data;
}
async function getChartsData(){
    let allData=await getData(allDataUrl);
    // console.log(allData);
    const allNewCases = allData.filter(data => data.chart==='newCases');
    const allCriticalCases = allData.filter(data => data.chart==='criticalCases');
    const allNewCasesTrend = allData.filter(data => data.chart==='newCasesTrend');
    const allSeriousCases = allData.filter(data => data.chart==='seriousCases');
    const allCurveData = allData.filter(data => data.chart==='curveData');
    const allCasesByAgeAndGenderChart=allData.filter(data => data.chart==='casesByAgeAndGender');
    const allSpreadingAreas = allData.filter(data => data.chart==='spreadingAreas');
    const allStaffInIsolation = allData.filter(data => data.chart==='staffInIsolation');
    const allHospitalStatus = allData.filter(data => data.chart==='hospitalStatus');
    const allTestsToLocatePatients = allData.filter(data => data.chart==='testsToLocatePatients');
    
    const chartsData={
        allNewCases,
        allCriticalCases,
        allNewCasesTrend,
        allSeriousCases,
        allCurveData,
        allCasesByAgeAndGenderChart,
        allSpreadingAreas,
        allStaffInIsolation,
        allHospitalStatus,
        allTestsToLocatePatients
    }
    return chartsData;
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function createNewCasesChart(){
    const ctx = document.getElementById('newCasesChart');
    ctx.height = 240;
    let chartData=(await getChartsData()).allNewCases;
    const amountOfDataSets=7;
    chartData=chartData.slice(Math.max(chartData.length - amountOfDataSets, 0));
    
    let dateLabels=[];
    let numberData=[];
    for (let item of chartData){
        let dateString = new Date(item.date).getDate()+'.'+(parseInt(new Date(item.date).getMonth())+1);
        dateLabels.push(dateString);
        numberData.push(item.amount);
    }

    let myChart=new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dateLabels,
            datasets: [{
                type:'bar',
                label: '# of something',
                data: numberData,
                barThickness:7,
                backgroundColor: 'rgba(182, 202, 81, 1)'
            }]
        },
        options: {
            cornerRadius: 20,
            legend: {
                display:false,
             },
            "hover": {//pointer
                onHover: function(e) {
                    const point = this.getElementAtEvent(e);
                    if (point.length) e.target.style.cursor = 'pointer';
                    else e.target.style.cursor = 'default';
                 },
                "animationDuration": 0,
                
            },
            "animation": {
                "duration": 1,
                    "onComplete": function () {
                        let chartInstance = this.chart,
                            ctx = chartInstance.ctx;
                        
                        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';

                        this.data.datasets.forEach(function (dataset, i) {
                            let meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function (bar, index) {
                                let data = dataset.data[index];
                                data=numberWithCommas(data);
                                ctx.fillStyle = "rgba(0,0,0,0.7)";                
                                ctx.fillText(data, bar._model.x, bar._model.y - 5);
                            });
                        });
                    }
            },
            tooltips: {enabled: false},//remove tooltips box
            
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        padding:-20,
                        userCallback: function(value, index, values) {
                            value = value.toString();
                            value = value.split(/(?=(?:...)*$)/);
                            value = value.join(',');
                            return value;
                        }
                    },
                    gridLines: false,
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                    },
                    gridLines: false,
                }],
            },
            layout: {
                padding:{
                    top:20,
                    left:20,
                    right:20,
                    bottom:20
                }
            },
            responsive:true,
            maintainAspectRatio: false,
            annotation: {
                events: ['mouseenter','mouseleave','mouseover'],

                annotations: [{
                    drawTime: 'afterDraw', // overrides annotation.drawTime if set
                    id: 'a-line-1', // optional
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y-axis-0',
                    value: '100',
                    borderColor: 'rgba(240,70,94,1)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    label: {
                        backgroundColor: 'rgba(240,70,94,1)',
                        fontFamily: "sans-serif",
                        fontSize: 12,
                        fontStyle: "normal",
                        fontColor: "#fff",
                        xPadding: 3,
                        yPadding: 3,
                        cornerRadius: 0,
                        position: "left",
                        xAdjust: 0,
                        yAdjust: 0,
                        enabled: true,
                        content: "100",
                        // rotation: 90
                    },
                    // Fires when the user clicks this annotation on the chart
                    // (be sure to enable the event in the events array below).
                    onMouseenter: function(e) {
                        ctx.style.cursor = 'pointer';
                        this.options.borderWidth = 3;
                        this.options.borderDash= [0, 0];
                        this.chartInstance.update();
                    },
                    onMouseleave: function(e) {
                        this.options.borderWidth = 1;
                        this.options.borderDash= [5, 5];
                        this.chartInstance.update();
                    },
                }]
            }
            
        },
        
            
        
        
    });
}

async function createCriticalCasesChart(){
    const ctx = document.getElementById('criticalCasesChart');
    ctx.height=250;
    const chartData=(await getChartsData()).allCriticalCases;
    
    let dateLabels=[];
    let numberData=[];
    for (let item of chartData){
        let dateString = new Date(item.date).getDate()+'.'+(parseInt(new Date(item.date).getMonth())+1);
        dateLabels.push(dateString);
        numberData.push(item.amount);
    }
    let c=ctx.getContext("2d");
    let gradientFill = c.createLinearGradient (ctx.clientWidth*0.5, 0,ctx.clientWidth*0.5 , ctx.clientHeight*0.9);
    gradientFill.addColorStop(0, "rgba(28, 125, 126, 1)");
    gradientFill.addColorStop(1, "rgba(255, 255, 255, 1)");
    let myChart=new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateLabels,
            datasets: [{
                label: '# of something',
                data: numberData,
                fill: true,
                borderWidth: 3,
                borderColor: 'rgba(28, 125, 126, 1)',
                lineTension: 0,
                pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                pointBorderColor:'rgba(28, 125, 126, 0.8)',
                pointBorderWidth:2,
                pointRadius:3,
                backgroundColor: gradientFill,
                
                
            }]
        },
        options: {
            legend: {
                display:false,
             },
             "hover": {//pointer
                onHover: function(e) {
                    const point = this.getElementAtEvent(e);
                    if (point.length) e.target.style.cursor = 'pointer';
                    else e.target.style.cursor = 'default';
                 },
                "animationDuration": 0,
            },
            tooltips: {enabled: false},//remove tooltips box
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        padding:30,
                    },
                    gridLines: false,
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        padding:15,
                    },
                    gridLines: false,
                }],
            },
            responsive:true,
            maintainAspectRatio: false,
            layout: {
                padding:{
                    top:20,
                    left:40,
                    right:40,
                }
            },
        },
        plugins: [{
            afterDatasetsDraw: function(chart) {
               var ctx = chart.ctx;
               chart.data.datasets.forEach(function(dataset, index) {
                  var datasetMeta = chart.getDatasetMeta(index);
                  if (datasetMeta.hidden) return;
                  datasetMeta.data.forEach(function(point, index) {
                     var value = dataset.data[index],
                         x = point.getCenterPoint().x,
                         y = point.getCenterPoint().y,
                         radius = point._model.radius,
                         fontSize = 12,
                         fontFamily = 'sans-serif',
                         fontColor = 'rgba(0,0,0,0.7)',
                         fontStyle = 'normal';
                     ctx.save();
                     ctx.textBaseline = 'middle';
                     ctx.textAlign = 'center';
                     ctx.font = fontStyle + ' ' + fontSize + 'px' + ' ' + fontFamily;
                     ctx.fillStyle = fontColor;
                     ctx.fillText(value, x, y - radius - fontSize);
                     ctx.restore();
                  });
               });
            }
         }]
    });
}

async function createNewCasesTrendChart(){
    const ctx = document.getElementById('newCasesTrendChart');
    ctx.height=230;
    const chartData=(await getChartsData()).allNewCasesTrend;
    
    let dateLabels=[];
    let numberData=[];
    for (let item of chartData){
        let dateString = new Date(item.date).getDate()+'.'+(parseInt(new Date(item.date).getMonth())+1);
        dateLabels.push(dateString);
        numberData.push(item.percentage);
    }
    let c=ctx.getContext("2d");
    let gradientFill = c.createLinearGradient (ctx.clientWidth*0.5, 0,ctx.clientWidth*0.5 , ctx.clientHeight*0.9);
    gradientFill.addColorStop(0, "rgba(133, 219, 254, 1)");
    gradientFill.addColorStop(1, "rgba(255, 255, 255, 1)");
    let myChart=new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateLabels,
            datasets: [{
                label: '# of something',
                data: numberData,
                fill: true,
                borderWidth: 3,
                borderColor: 'rgba(133, 219, 254, 1)',
                lineTension: 0,
                pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                pointBorderColor:'rgba(88, 205, 253, 1)',
                pointBorderWidth:2,
                pointRadius:3,
                backgroundColor: gradientFill,
                
            }]
        },
        options: {
            legend: {
                display:false,
             },
             "hover": {//pointer
                onHover: function(e) {
                    const point = this.getElementAtEvent(e);
                    if (point.length) e.target.style.cursor = 'pointer';
                    else e.target.style.cursor = 'default';
                 },
                "animationDuration": 0,
            },
            tooltips: {enabled: false},//remove tooltips box
            layout: {
                padding: {
                    left: -5,
                    right: 20,
                    top: 20,
                    bottom: 10
                }
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'אחוז שינוי יומי',
                        fontFamily:'sans-serif',
                        fontSize:13,
                        fontColor:'rgba(0,0,0,0.7)',
                        padding:20,
                      },
                    ticks: {
                        beginAtZero: true,
                        padding:30,
                        display:false,
                    },
                    gridLines: false,
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        padding:15,
                    },
                    gridLines: false,
                }],
            },
            responsive:true,
            maintainAspectRatio: false,
        },
        plugins: [{
            afterDatasetsDraw: function(chart) {
               var ctx = chart.ctx;
               chart.data.datasets.forEach(function(dataset, index) {
                  var datasetMeta = chart.getDatasetMeta(index);
                  if (datasetMeta.hidden) return;
                  datasetMeta.data.forEach(function(point, index) {
                     var value = dataset.data[index]+'%',
                         x = point.getCenterPoint().x,
                         y = point.getCenterPoint().y,
                         radius = point._model.radius,
                         fontSize = 13,
                         fontFamily = 'sans-serif',
                         fontColor = 'rgba(0,0,0,0.9)',
                         fontStyle = 'bold';
                     ctx.save();
                     ctx.textBaseline = 'middle';
                     ctx.textAlign = 'center';
                     ctx.font = fontStyle + ' ' + fontSize + 'px' + ' ' + fontFamily;
                     ctx.fillStyle = fontColor;
                     ctx.fillText(value, x, y - 12 - radius - fontSize);
                     
                     //label under the number data
                     let textValue=dataset.data[index]<0?'(דעיכה)':'(ההיפך)';
                     fontStyle = 'normal';
                     fontColor = 'rgba(0,0,0,0.7)',
                     ctx.fillStyle = fontColor;
                     ctx.font = fontStyle + ' ' + fontSize + 'px' + ' ' + fontFamily; 
                     ctx.fillText(textValue,x,y-radius-fontSize);
                     
                     ctx.restore();
                  });
               });
            }
         }]
    });
}


function sortSeriousCasesData(chartData){
    let dateLabels=[];
    let criticalData=[];
    let respiratorsData=[];
    let deathsData=[];
    for (let item of chartData){
        let dateString = new Date(item.date).getDate()+'.'+(parseInt(new Date(item.date).getMonth())+1);
        dateLabels.push(dateString);
        criticalData.push(item.critical);
        respiratorsData.push(item.respirators);
        deathsData.push(item.deaths);
    }  
    return {dateLabels,criticalData,respiratorsData,deathsData};
}
async function createSeriousCasesChart(){
    const ctx = document.getElementById('seriousCasesChart');
    ctx.height=250;

    createSelectDropdown("serious-cases-container","עד עכשיו","שבוע אחרון","שבועיים אחרונים","חודש אחרון");

    
    let chartData=(await getChartsData()).allSeriousCases;
    //select drop-down - when change => render this chart
    const selectElement=document.querySelector('#serious-cases-container select');
    selectElement.addEventListener('change',async()=>{
        chartData=(await getChartsData()).allSeriousCases;
        const amountOfDataSets=convertSelectOptionToDaysPeriod(selectElement.value);
        if (amountOfDataSets)
            chartData=chartData.slice(Math.max(chartData.length - amountOfDataSets, 0));

        let {dateLabels,criticalData,respiratorsData,deathsData}=sortSeriousCasesData(chartData);
        const datasets=[criticalData,respiratorsData,deathsData];
        
        updateData(myChart,dateLabels,datasets);
    });

    
     
    //Days amount of data
     const amountOfDataSets=convertSelectOptionToDaysPeriod(selectElement.value);
     if (amountOfDataSets)
         chartData=chartData.slice(Math.max(chartData.length - amountOfDataSets, 0));

         let {dateLabels,criticalData,respiratorsData,deathsData}=sortSeriousCasesData(chartData);

    //Chart
    let myChart=new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateLabels,
            datasets: [{
                label: 'חולים קשים',
                data: criticalData,
                fill:false,
                lineTension: 0,
                borderWidth: 3,
                borderColor: 'rgba(182, 202, 81, 1)',
                
                pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                pointBorderColor:'rgba(182, 202, 81, 1)',
                pointBorderWidth:2,
                pointRadius:15,
                // radius:15,
                hoverRadius:15,
                hoverBackgroundColor:'white',
                hoverBorderColor:'rgba(182, 230, 81, 1)',
                pointStyle: 'rectRounded',
            },
            {
                label: 'מונ',
                data: respiratorsData,
                fill:false,
                borderWidth: 3,
                borderColor: 'rgba(80, 203, 253, 1)',
                lineTension: 0,
                pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                pointBorderColor:'rgba(80, 203, 253, 1)',
                pointBorderWidth:2,
                pointRadius:15,
                hoverRadius:15,
                hoverBackgroundColor:'white',
                hoverBorderColor:'rgba(80, 223, 253, 1)',
                pointStyle: 'rectRounded',
            },
            {
                label: 'נפ',
                data: deathsData,
                fill:false,
                borderWidth: 3,
                borderColor: 'rgba(35, 125, 125, 1)',
                lineTension: 0,
                pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                pointBorderColor:'rgba(35, 125, 125, 1)',
                pointBorderWidth:2,
                pointRadius:15,
                hoverRadius:15,
                hoverBackgroundColor:'white',
                hoverBorderColor:'rgba(35, 135, 135, 1)',
                pointStyle: 'rectRounded',
                
            }]
        },
        options: {
            
            legend: {
                display:false,
                
             },
             "hover": {//pointer
                onHover: function(e) {
                    const point = this.getElementAtEvent(e);
                    if (point.length) e.target.style.cursor = 'pointer';
                    else e.target.style.cursor = 'default';
                 },
                mode: 'nearest',
                "animationDuration": 0,
            },
            tooltips: {enabled: false},//remove tooltips box
            
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        padding:15,
                    },
                    gridLines:  {
                        display:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'מספר מקרים',
                        fontFamily:'sans-serif',
                        fontSize:12,
                        fontColor:'rgba(0,0,0,0.7)',
                        padding:0,
                    },
                }],
                xAxes: [{
                    
                    
                    
                    ticks: {
                        beginAtZero: true,
                        // userCallback: function(item, index) {
                        //     if (!(index % 2)) return item;
                        //  },
                    },
                    
                    gridLines: {
                        display:false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'תאריך',
                        fontFamily:'sans-serif',
                        fontSize:15,
                        fontColor:'rgba(0,0,0,0.7)',
                        padding:0,
                    },
                }],
            },
            layout: {
                padding:{
                    top:30,
                    right:20,
                }
            },

            responsive:true,
            maintainAspectRatio: false,
            
        },
        
        plugins: [{
            afterDatasetsDraw: function(chart) {
                
               var ctx = chart.ctx;
               chart.data.datasets.forEach(function(dataset, index) {
                  var datasetMeta = chart.getDatasetMeta(index);
                  
                  if (datasetMeta.hidden) return;
                  datasetMeta.data.forEach(function(point, index) {
                    
                      if (point._options.radius===0) return;
                     var value = dataset.data[index],
                         x = point.getCenterPoint().x,
                         y = point.getCenterPoint().y,
                         radius = point._model.radius,
                         fontSize = 12,
                         fontFamily = 'sans-serif',
                         fontColor = 'rgba(0,0,0,0.7)',
                         fontStyle = 'normal';
                     ctx.save();
                     ctx.textBaseline = 'middle';
                     ctx.textAlign = 'center';
                     ctx.font = fontStyle + ' ' + fontSize + 'px' + ' ' + fontFamily;
                     ctx.fillStyle = fontColor;
                     ctx.fillText(value, x, y - radius - fontSize+28);
                     ctx.restore();
                  });
               });
            }
         }]
    });


    
    function updateData(chart,labels,datasets){
        
        chart.data.labels=labels;
        chart.data.datasets[0].data=datasets[0]
        chart.data.datasets[1].data=datasets[1]
        chart.data.datasets[2].data=datasets[2]

        displayOnlyFourPoints();
        chart.update();
    }

    const displayOnlyFourPoints = function() {
        const dataPointsAmount=myChart.data.datasets[0].data.length;
        const indexesToDisplay=[
            0,
            Math.floor(myChart.data.datasets[0].data.length/3),
            Math.floor(myChart.data.datasets[0].data.length*(2/3)),
            myChart.data.datasets[0].data.length-1
        ]
        

        //If point should be displayed, pointRadius=15, else = 0
        for (let datasetIndex=0;datasetIndex<=2;datasetIndex++){
            myChart.data.datasets[datasetIndex].pointRadius = [];
            for (let i = 0; i <= dataPointsAmount - 1; i++) {
                myChart.data.datasets[datasetIndex].pointRadius[i] = (!indexesToDisplay.includes(i))? 0:15;             
            }
        }
        myChart.update();
    }
    displayOnlyFourPoints();
    
}

function myCrosshair (evt,ctx,maxValue){
    const topBorder=ctx.clientHeight*0.08;
        const bottomBorder=ctx.clientHeight*0.812;
        // console.log(evt.layerY);
        let yPosition=evt.layerY;
        if(yPosition<topBorder)
            yPosition=topBorder;
        if(yPosition>bottomBorder)
            yPosition=bottomBorder;
        const horizontalNewValue=Math.round(((bottomBorder-yPosition)/(bottomBorder-topBorder))*maxValue);
        return horizontalNewValue;
}


function createSelectDropdown(containerId,...options){
    const selectElement=document.createElement('select');
    
    for (let [i,option] of options.entries()){
        const selectOptionElement=document.createElement('option');
        selectOptionElement.value=i;
        selectOptionElement.innerHTML=option;
        selectElement.appendChild(selectOptionElement);
    }
    selectElement.selectedIndex=1;
    const container=document.getElementById(containerId);
    container.prepend(selectElement);
}
function convertSelectOptionToDaysPeriod(value){
    switch (value){
        case "0":
            return 0;
        case "1":
            return 7
        case "2":
            return 14;
        case "3":
            return 30;
    }
}



function sortEpidemicCurveData(chartData){
    let dateLabels=[];
    let totalCasesData=[];
    let newCasesData=[];
    let recoverdCasesData=[];
    let totalCases=0;
    for (let item of chartData){
        let dateString = new Date(item.date).getDate()+'.'+(parseInt(new Date(item.date).getMonth())+1);
        dateLabels.push(dateString);
        totalCases+=item.newCases;
        newCasesData.push(item.newCases);
        totalCasesData.push(totalCases);
        // totalCasesData.push(item.totalCases);
        recoverdCasesData.push(item.recoverdCases);
    }
    return {dateLabels,totalCasesData,newCasesData,recoverdCasesData};
}
async function createEpidemicCurveChart(){
    const ctx = document.getElementById('epidemicCurveChart');
    ctx.height=250;
    
    createSelectDropdown("epidemic-curve-container","עד עכשיו","שבוע אחרון","שבועיים אחרונים","חודש אחרון");

    
    let chartData=(await getChartsData()).allCurveData;    
    //select drop-down - when change => render this chart
    const selectElement=document.querySelector('#epidemic-curve-container select');
    selectElement.addEventListener('change',async()=>{
        chartData=(await getChartsData()).allCurveData;
        const amountOfDataSets=convertSelectOptionToDaysPeriod(selectElement.value);
        if (amountOfDataSets)
            chartData=chartData.slice(Math.max(chartData.length - amountOfDataSets, 0));
        
        let {dateLabels,totalCasesData,newCasesData,recoverdCasesData}=sortEpidemicCurveData(chartData);
        const datasets=[totalCasesData,recoverdCasesData,newCasesData];
        
        updateData(myChart,dateLabels,datasets);
    });

    //Days amount of data
    const amountOfDataSets=convertSelectOptionToDaysPeriod(selectElement.value);
        if (amountOfDataSets)
            chartData=chartData.slice(Math.max(chartData.length - amountOfDataSets, 0));

    //Colors
    let c=ctx.getContext("2d");
    let gradientFill = c.createLinearGradient (ctx.clientWidth*0.5, 0,ctx.clientWidth*0.5 , ctx.clientHeight*0.9);
    gradientFill.addColorStop(0, "rgba(72, 202, 255, 0.3)");
    gradientFill.addColorStop(1, "rgba(255, 255, 255, 1)");

    let {dateLabels,totalCasesData,newCasesData,recoverdCasesData}=sortEpidemicCurveData(chartData);
    
    //Chart
    let myChart=new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dateLabels,
            datasets: [{
                type: 'line',
                label: 'מאומתים מצטבר',
                data: totalCasesData,
                fill:true,
                borderWidth: 3,
                borderColor: 'rgba(72, 202, 255, 1)',
                
                lineTension: 0,
                pointBackgroundColor: 'rgba(72, 202, 255, 1)',
                pointBorderColor:'rgba(72, 202, 255, 1)',
                pointBorderWidth:2,
                pointRadius:3,
                pointHoverRadius:8,
                yAxisID: 'A',
                backgroundColor: gradientFill,
                
            },
            {
                type: 'bar',
                label: 'מחלימים חדשים',
                data: recoverdCasesData,
                barThickness:8,
                backgroundColor: 'rgba(137, 137, 137, 1)',
                yAxisID: 'B',

                // categoryPercentage: 0.4,
                // barPercentage: 0.5,
                
            },
            {
                type: 'bar',
                label: 'מאומתים חדשים',
                data: newCasesData,
                barThickness:8,
                backgroundColor: 'rgba(28, 125, 126, 1)',
                yAxisID: 'B',
                // categoryPercentage: 0.4,
                // barPercentage: 0.5
            }]
        },
        options: {
            cornerRadius: 20,
            showAllTooltips:true,
            legend: {
                display:false
             },
            "hover": {
                onHover: function(e) {
                    const point = this.getElementAtEvent(e);
                    if (point.length) e.target.style.cursor = 'pointer';
                    else e.target.style.cursor = 'default';

                    let points = myChart.getElementsAtXAxis(e);
                    //my crosshair
                    const maxValueYaxis = myChart.scales.A.end;
                    let horizontalNewValue=myCrosshair(e,ctx,maxValueYaxis);
                    myChart.options.annotation.annotations[0].value = horizontalNewValue;
                    myChart.options.annotation.annotations[1].value = myChart.config.data.labels[points[0]._index];
                    if(e.type == "mouseout"){
                        myChart.options.annotation.annotations[0].value = '';
                        myChart.options.annotation.annotations[1].value = '';
                    }
                    myChart.update();
                 },
            },
            tooltips: {
                // displayColors: true,
                position: 'custom',
                custom: function(tooltip) {
                    if (!tooltip) return;
                    // disable displaying the color box;
                    tooltip.displayColors = false;
                  },
                  callbacks: {
                    labelTextColor : function(tooltipItem, chart) {
                        var dataset = chart.config.data.datasets[tooltipItem.datasetIndex];
                        if(dataset.type==='line')
                            return 'rgba(72, 202, 255, 1)';
                        return dataset.backgroundColor;
                    },
                    label: function(tooltipItem, data) {
                        let label = Math.round(tooltipItem.yLabel * 100) / 100;
                        if (label) {
                            label += ' ';
                        }
                        label +=data.datasets[tooltipItem.datasetIndex].label || '';
                        return label;
                    },
                    // remove title
                    title: function(tooltipItem, data) {
                      return;
                    }
                  },
                mode: 'index',
                intersect:false,
                backgroundColor:'rgba(255,255,255,1)',
                
                shadowBlur:15,
                shadowColor:'rgba(0,0,0,0.5)',
                shadowOffsetX:0,
                shadowOffsetY:0,
                bodyAlign:'right',
                bodyFontStyle:'bold',
                bodyFontSize:14,
                caretSize:0,
                yPadding:10,
                bodySpacing:4,
                textDirection:'rtl',
                
            },
            scales: {
                yAxes: [{
                    id: 'A',
                    position:'left',
                    ticks: {
                        beginAtZero: true,
                        fontColor:'rgba(72, 202, 255, 1)',
                        userCallback: function(value, index, values) {
                            value = value.toString();
                            value = value.split(/(?=(?:...)*$)/);
                            value = value.join(',');
                            return value;
                        }
                    },
                    gridLines:  {
                        display:true,
                        drawBorder:false,
                        
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'מספר מקרים מצטבר',
                        fontFamily:'sans-serif',
                        fontSize:15,
                        fontColor:'rgba(0,0,0,0.6)',
                        padding:0,
                    },
                    
                },
                
                {
                    id: 'B',
                    position:'right',
                    ticks: {
                        beginAtZero: false,
                        fontColor:'rgba(28, 125, 126, 1)',
                        userCallback: function(value, index, values) {
                            value = value.toString();
                            value = value.split(/(?=(?:...)*$)/);
                            value = value.join(',');
                            return value;
                        }
                    },
                    gridLines:  {
                        display:false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'מספר מקרים חדשים',
                        fontFamily:'sans-serif',
                        fontSize:15,
                        fontColor:'rgba(0,0,0,0.6)',
                        padding:0,
                    },
                }],
                
                xAxes: [{
                    // offset: true,
                    ticks: {
                        // beginAtZero: true,
                        
                    },
                    gridLines: {
                        display:false
                    },
                    // barThickness:8,
                    // categoryPercentage: 1.0,
                    // barPercentage: 0.45
                    scaleLabel: {
                        display: true,
                        labelString: 'תאריך הבדיקה',
                        fontFamily:'sans-serif',
                        fontSize:14,
                        fontColor:'rgba(0,0,0,0.7)',
                        padding:0,
                    },
                }],
            },
            layout: {
                padding:{
                    top:20,
                    right:20,
                    left:20
                }
            },
            responsive:true,
            maintainAspectRatio: false,
            annotation: {
                events: ['mouseover'],

                annotations: [{
                    drawTime: 'beforeDatasetsDraw', // overrides annotation.drawTime if set
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'A',
                    value: '0',
                    borderColor: 'rgba(128, 128, 128,1)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    

                },
                {
                    drawTime: 'beforeDatasetsDraw', // overrides annotation.drawTime if set
                    type: 'line',
                    scaleID:'x-axis-0',
                    mode: 'vertical',
                    value: '0',
                    borderColor: 'rgba(128, 128, 128,0.7)',
                    borderWidth: 1,
                    
                    

                }]
            }
        },
        
    });

    function updateData(chart,labels,datasets){
        chart.data.labels=labels;
        chart.data.datasets[0].data=datasets[0]
        chart.data.datasets[1].data=datasets[1]
        chart.data.datasets[2].data=datasets[2]
        chart.update();
    }
   
}


//Custom tooltip position - cursor
Chart.Tooltip.positioners.custom = function(elements, position) {
    if (!elements.length) {
      return false;
    }
    let offsetX = 0;
    let offsetY=0;
    //adjust the offset left or right depending on the event position
    if (elements[0]._chart.width / 2 > position.x) {
      offsetX = 20;
    } else {
      offsetX = -20;
    }
    //adjust the offset up or down depending on the event position
    if (elements[0]._chart.height / 2 > position.y) {
        offsetY = 20;
      } else {
        offsetY = -20;
      }
    return {
      x: position.x + offsetX,
      y: position.y + offsetY
    }
}


//data types for this chart - ['cases', 'deaths', 'respirators', 'critical']
function getChartDataAccordingToType(chartData,dataType){
    let filteredChartData=chartData.filter(item=>item.dataType===dataType);
    const agesRangeArray=[];
    const malePercetageData=[];
    const femalePercetageData=[];
    for (let item of filteredChartData){
        
        agesRangeArray.push(item.ageRange);
        malePercetageData.push(item.malePercentage);
        femalePercetageData.push(-item.femalePercentage);
    }
    
    return {agesRangeArray,malePercetageData,femalePercetageData};
    //return only relevant data
}
function convertSelectOptionToDataType(value){
    switch(value){
        case '0':
            return "cases";
        case '1':
            return "deaths";
        case '2':
            return "respirators";
        case '3':
            return "critical";

    }
}

async function createCasesByAgeAndGenderChart(){
    const ctx = document.getElementById('casesByAgeAndGenderChart');
    ctx.height=260;
    let chartData=(await getChartsData()).allCasesByAgeAndGenderChart;
    // console.log(chartData);


    createSelectDropdown("age-gender-container"," מאומתים","נפטרים","מונשמים","מצב קשה");
    
    //select drop-down - when change => render this chart
    const selectElement=document.querySelector('#age-gender-container select');
    selectElement.selectedIndex=0;
    selectElement.addEventListener('change',async()=>{
        chartData=(await getChartsData()).allCasesByAgeAndGenderChart;
        const dataTypeRequired=convertSelectOptionToDataType(selectElement.value);

        const {agesRangeArray,malePercetageData,femalePercetageData}=getChartDataAccordingToType(chartData,dataTypeRequired);
        
        const datasets=[malePercetageData.reverse(),femalePercetageData.reverse()];
        updateData(myChart,agesRangeArray.reverse(),datasets);
    });

    
    const dataTypeRequired=convertSelectOptionToDataType(selectElement.value);
    const {agesRangeArray,malePercetageData,femalePercetageData}=getChartDataAccordingToType(chartData,dataTypeRequired);

    
    //ChartJS
    let myChart=new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: agesRangeArray.reverse(),
            datasets: [
            {
                
                data: malePercetageData.reverse(),
                label: "גברים",
                backgroundColor: "rgba(80,203,253,1)",
                categoryPercentage: 1.0,
                barPercentage: 0.45,

                hoverShadowOffsetX: 3,
                hoverShadowOffsetY: 3,
                hoverShadowBlur: 10,
                hoverShadowColor: 'rgba(0, 0, 0, 0.4)',

                
            },
            {
                data: femalePercetageData.reverse(),
                label: "נשים",
                backgroundColor: "rgba(182,202,81,1)",
                categoryPercentage: 1.0,
                barPercentage: 0.45,
                hoverShadowOffsetX: 3,
                hoverShadowOffsetY: 3,
                hoverShadowBlur: 10,
                hoverShadowColor: 'rgba(0, 0, 0, 0.4)',
                
            }
            ]
        },
        
        options: {
            events:['mousemove','mouseout'],
            legend: {
                display:false
             },
            "hover": {
                onHover: function(e,item) {
                    
                    //pointer
                    const point = this.getElementAtEvent(e);
                    if (point.length) e.target.style.cursor = 'pointer';
                    else e.target.style.cursor = 'default';

                    
                    //Horizontal crosshair
                    let activePoints = myChart.getElementsAtEventForMode(e, 'y', myChart.options);
                    if(activePoints){
                        let firstPoint = activePoints[0];
                        if (firstPoint){
                            let label = myChart.data.labels[firstPoint._index];
                            const horizontalNewValue=firstPoint._index;
                            myChart.options.annotation.annotations[0].value = horizontalNewValue;
                            myChart.options.annotation.annotations[0].label.content = label;
                        }
                    }
                    
                    //Vertical crosshair
                    let points = myChart.getElementsAtXAxis(e);
                    if(points.length){
                        let chartArea=points[0]._chart.chartArea;
                        let margins=points[0]._xScale.margins;
                        let width=chartArea.right-chartArea.left;
                        let currentPositionX=e.layerX-margins.left;
                        if (e.layerX>chartArea.left &&e.layerX<chartArea.right){
                            let tempValue=Math.round((currentPositionX/width)*40);                      
                            const currentValueX=Math.abs(tempValue-20);
                            myChart.options.annotation.annotations[1].value = ((currentPositionX/width)*40)-20;
                            myChart.options.annotation.annotations[1].label.content = currentValueX+"";
                        }
                    }
                    if(e.type == "mouseout"){
                        myChart.options.annotation.annotations[0].value = '';
                        myChart.options.annotation.annotations[1].value = '';
                    }
                    
                    myChart.update();
                 },
                
                "animationDuration": 0,
                
            },
            
            animation: {
                    duration:1,                  
                    onProgress: function () {
                        
                        let chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                        
                        ctx.save();
                        ctx.globalCompositeOperation='destination-over';

                        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';

                        this.data.datasets.forEach(function (dataset, i) {
                            let meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function (bar, index) {
                                let data = dataset.data[index];
                                let poisitionX=i===0?bar._model.x+20:bar._model.x-20;
                                let poisitionY = bar._model.y+6
                                ctx.fillText(Math.abs(data)+'%', poisitionX, poisitionY);
                            });
                        });
                        ctx.restore()
                    }
            },
            cornerRadius: 10,
            responsive:true,
            maintainAspectRatio: false,
            tooltips: {
                position: 'custom',
                custom: function(tooltip) {
                    if (!tooltip) return;
                    // disable displaying the color box;
                    tooltip.displayColors = false;
                    
                  },
                  callbacks: {
                    labelTextColor : function(tooltipItem, chart) {
                        
                        var dataset = chart.config.data.datasets[tooltipItem.datasetIndex];
                        if(dataset.type==='line')
                            return 'rgba(72, 202, 255, 1)';
                        return dataset.backgroundColor;
                    },
                    label: function(tooltipItem, data) {
                        
                        let genderLabel=data.datasets[tooltipItem.datasetIndex].label
                        let label=[];
                        let yLabel = tooltipItem.yLabel;
                        let XLabel = tooltipItem.xLabel;
                        label.push(genderLabel+' '+yLabel);
                        label.push(Math.abs(XLabel)+'%');
                        // let label = tooltipItem.yLabel;
                        // if (label) {
                        //     label += ' ';
                        // }
                        // label +=data.datasets[tooltipItem.datasetIndex].label || '';
                        return label;
                    },
                    // remove title
                    title: function(tooltipItem, data) {
                      return;
                    }
                  },
                mode: 'nearest',
                // intersect:false,
                backgroundColor:'rgba(255,255,255,1)',
                
                shadowBlur:15,
                shadowColor:'rgba(0,0,0,0.5)',
                shadowOffsetX:0,
                shadowOffsetY:0,
                bodyAlign:'right',
                bodyFontStyle:'bold',
                bodyFontSize:14,
                caretSize:0,
                yPadding:7,
                xPadding:5,
                bodySpacing:4,
                textDirection:'rtl',
                
            },
            scales: {
                
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'סה"כ %',
                        fontFamily:'sans-serif',
                        fontSize:12,
                        fontColor:'rgba(0,0,0,0.7)',
                        padding:0,
                    },
                    stacked: true,
                    ticks: {
                        
                        maxTicksLimit: 6,
                        suggestedMin:-20,
                        suggestedMax: 20, 
                        callback: function(value, index, values) {
                            return Math.abs(value);
                        }
                    },
                    
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'קבוצות גיל',
                        fontFamily:'sans-serif',
                        fontSize:12,
                        fontColor:'rgba(0,0,0,0.7)',
                        padding:0,
                    },
                    padding:15,
                    stacked: true,    
                }]
            
            },
            layout:{
                bottom:0,
            },
            
            annotation: {
                
                // events: ['mouseover','mouseleave'],
                'leave': function(context) {
                    // context: {chart, element}
                    console.log('as')
                },
                annotations: [{
                    drawTime: 'afterDraw', // overrides annotation.drawTime if set
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y-axis-0',
                    value: "",
                    borderColor: 'rgba(128, 128, 128,1)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    label: {
                        backgroundColor: 'rgb(51,102,255)',
                        fontFamily: "sans-serif",
                        fontSize: 12,
                        fontStyle: "normal",
                        fontColor: "#fff",
                        xPadding: 7,
                        yPadding: 7,
                        cornerRadius: 0,
                        position: "left",
                        xAdjust: 0,
                        yAdjust: 0,
                        enabled: true,
                        content: "",
                    },

                },
                {
                    drawTime: 'afterDraw', // overrides annotation.drawTime if set
                    type: 'line',
                    scaleID:'x-axis-0',
                    mode: 'vertical',
                    value: "",
                    borderColor: 'rgba(128, 128, 128,0.7)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    
                    label: {
                        backgroundColor: 'rgb(51,102,255)',
                        fontFamily: "sans-serif",
                        fontSize: 12,
                        fontStyle: "normal",
                        fontColor: "#fff",
                        xPadding: 7,
                        yPadding: 5,
                        cornerRadius: 0,
                        position: "bottom",
                        xAdjust: 0,
                        yAdjust: 0,
                        enabled: true,
                        content: "",
                    },

                }],
                
            }
            
        },        
    })

    function updateData(chart,labels,datasets){
        chart.data.labels=labels;
        chart.data.datasets[0].data=datasets[0];
        chart.data.datasets[1].data=datasets[1];
        chart.options.animation.duration=900;
        chart.update();
        chart.options.animation.duration=1;
    }

    
}


async function createSpreadingAreasTable(){
    const chartData=(await getChartsData()).allSpreadingAreas;

    let rowDataArray=[];
    for (let item of chartData){
        rowDataArray.push(item);
    }

    const columnDefs = [
        {headerName: "יישוב", field: "city",
            cellStyle: {'font-weight': 'bold',
                        'text-align': 'right',
                        'width':'150px'
                    }
        },
        {headerName: "מאומתים", field: "totalCases",type: 'numberColumn'},
        {headerName: "חולים פעילים", field: "activeCases",type: 'numberColumn'},
        {headerName: "חולים חדשים ב-7 ימים האחרונים", field: "newCasesLastSevenDays",type: 'numberColumn'},
        {headerName: "בדיקות ב-7 ימים האחרונים", field: "testsLastSevenDays",type: 'numberColumn'},
        {headerName: "חולים פעילים ל-10,000 נפש", field: "activeCasesPerTenThousandPeople",type: 'numberColumn'},
      ];
          
      // specify the data
      const rowData = rowDataArray;
          

    
      // let the grid know which columns and what data to use
      const gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        enableRtl: true,
        headerHeight:45,
        editable: false,
        // minHeight:50,
        columnTypes: {
            
            // numberColumn: { textAlign: 'center' },
        },
        
        defaultColDef: {
            // set the default column width
            width: 140,
            
            sortable: true,
            suppressMovable:true,


            wrapText: true,
            autoHeight: true,
            cellStyle: {textAlign: 'center'}
          },
          
          onGridSizeChanged: onGridSizeChanged,
      };

      // setup the grid
      const gridDiv = document.querySelector('#spreadingAreasTable');
      new agGrid.Grid(gridDiv, gridOptions);
      
      
    
}
function onGridSizeChanged(params) {
    params.api.sizeColumnsToFit();
}

async function createStaffInIsolationChart(){
    
    // const ctx = document.getElementById('staffInIsolationChart');
    const chartData=(await getChartsData()).allStaffInIsolation;
    const doctorsInIsolation=chartData[0].doctors;
    const nursesInIsolation=chartData[0].nurses;
    const otherInIsolation=chartData[0].other;
    

    //D3
    var dataset = [
            {label:'אחים/ות',count:nursesInIsolation},
            {label:'רופאים/ות',count:doctorsInIsolation},
            {label:"מקצועות אחרים",count:otherInIsolation},
        ];
        
    
    //Size
    let width = 360,
        height = 300,
        radius = Math.min(width, height)/1.2;//radius
        let donutWidth = 20;
        let outerRadius = 70;
    

    //Colors
    let color = d3.scale.ordinal()
    .domain(["nursesInIsolation", "doctorsInIsolation", "otherInIsolation"])
    .range(["rgb(182,202,81)" , "rgb(80,203,253)" , "rgb(35,125,125)"]);
    
    let pie = d3.layout.pie()
        .value(function(d) {
            return d.count;
        })
        .sort(null);
      
    
    //Events  
    var eventObj = {
        'mouseover': function(d, i, j) {
            pathAnim(d3.select(this), 1);
            
        },
        
        'mouseout': function(d, i, j) {
            var thisPath = d3.select(this);
            if (!thisPath.classed('clicked')) {
            pathAnim(thisPath, 0);
            }
        },    
    };
    
    //Animation
    var pathAnim = function(path, dir) {
    switch (dir) {
        case 0:
        path.transition()
            .duration(500)
            .ease(d3.easeElasticOut.amplitude(1).period(0.3))
            .attr('d', d3.svg.arc()
            .innerRadius((radius - 100))
            .outerRadius(radius - 50)
            );
        path.style("filter","none");
        
        break;
    
        case 1:
        path.transition()
            .duration(500)
            .ease(d3.easeElasticOut.amplitude(1).period(0.3))
            .attr('d', d3.svg.arc()
            .innerRadius((radius - 100))
            .outerRadius((radius - 40) * 1.08)//radius when hover
            );
        path.style("filter", "url(#drop-shadow)");
        break;
    }
    }
    
    let arc = d3.svg.arc()
        .innerRadius(radius - 100)
        .outerRadius((radius - 50));
    
    let svg = d3.select("#staffInIsolation").append("svg")
        .attr("id","staffInIsolationPie")
        .attr("width", width)
        .attr("height", height)
        // .attr("preserveAspectRatio", "xMinYMin meet")
        // .attr("viewBox", "0 0 250 250")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ") scale(0.35)")//size of donut relative to svg
    
    //Shadow filter
    let defs = svg.append("defs");
    let filter = defs.append("filter")
                    .attr("id", "drop-shadow")
                    .attr("height","130%");
    
    filter.append("feGaussianBlur")
            .attr("in","SourceAlpha")
            .attr("stdDeviation",9)
            .attr("result", "blur");
    
    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 0)
        .attr("dy", 0)
        .attr("result", "offsetBlur");
    
    let feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur");
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    
    //Paths
    let paths = svg.selectAll("path")
        .data(pie(dataset));
        
    paths
    .transition()
    .duration(1000)
    .attr('d', arc);
    
    paths.enter()
    .append('path')
    .attr('d', arc)
    .style('fill', function(d, i) {
        return color(i);
    })
    .style("cursor", "pointer")
    .on(eventObj)
    
    paths.exit().remove();
      
    //Text - center
    const total=nursesInIsolation+doctorsInIsolation+otherInIsolation;
    svg.append('text')
        .style('fill', '#1A2138')
        .style("font-size", "85px")
        .style("font-weight", "bold")
        // .attr("transform", "translate(0," + 50 + ")")
        .attr("text-anchor", "middle")
        .html(total);

    
    svg.append('text')
        .style('fill', '#8F9BB3')
        .style("font-size", "45px")
        .style("font-weight", "bold")
        .attr("transform", "translate(0," + 55 + ")")
        .attr("text-anchor", "middle")
        .html('סה"כ');


    /* -------Polylines-------*/
    let outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);
    let key = function(d){ return d.data.label; };
    
    svg.append("g")
	    .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");

    const text = svg.select(".labels").selectAll("text")
		.data(pie(dataset), key);

    
    
    //label text
	text.enter()
        .append("text")
        .attr("dy", ".35em")
        .attr("font-size","2.5rem")
		.text(function(d) {
			return d.data.label;
        });



        function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        }
    
        text.transition().duration(1000)
            .attrTween("transform", function(d) {
                this._current = this._current || d;
                let interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    let d2 = interpolate(t);
                    let pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate("+ pos +")";
                };
            })
            .styleTween("text-anchor", function(d){
                this._current = this._current || d;
                let interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    let d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start":"end";
                };
            });
    
        text.exit()
            .remove();



        //label - number
        text.enter()
        .append("text")
        .attr("dy", "1.8em")
        // .attr("dx", ".8em")
        .attr("font-size","2.5rem")
        .attr("font-weight","700")
        .attr("fill", function(d, i) { return color(i); })
        .text(function(d) {
            return d.data.count;
        });



        function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        }

        text.transition().duration(1000)
            .attrTween("transform", function(d) {
                this._current = this._current || d;
                let interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    let d2 = interpolate(t);
                    let pos = outerArc.centroid(d2);
                    //the position of the text
                    pos[0] = (radius * (midAngle(d2) < Math.PI ? 1 : -1) + (midAngle(d2) < Math.PI ? 45 : -90));
                    return "translate("+ pos +")";
                };
            })
            .styleTween("text-anchor", function(d){
                this._current = this._current || d;
                let interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    let d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start":"end";
                };
            });

        text.exit()
            .remove();

            

        //Lines
        let polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(dataset), key);

        
        polyline.enter()
            .append("polyline");

        polyline.transition().duration(1000)
            .attrTween("points", function(d){
                this._current = this._current || d;
                let interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    let d2 = interpolate(t);
                    let pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };			
            });

        polyline.exit()
            .remove();
    
}

function createPercentageBar(params){
    let width = 50
    height = 10,
    max = 100,
    val = params.value;

    const element = document.createElement("span");
    const newBar=document.createElement('canvas');
    newBar.width=width,
    newBar.height=height,
    newBar.classList.add('percentage-bar');
    element.classList.add('percentage-bar-container');
    ctx = newBar.getContext('2d');


    // direction = $('input[name="direction"]:checked').val();
    
    //Rounded corners
    let x=0,y=0;
    let radius=5;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    // Draw the background
    ctx.fillStyle = 'rgb(222,235,243)';
    ctx.clearRect(0, 0, newBar.width, newBar.height);
    // ctx.fillRect(0, 0, width, height);
    ctx.fill();
    
    // Draw the fill
    ctx.fillStyle = 'rgba(80,203,253)';
    var fillVal = Math.min(Math.max(val / max, 0), 1);
    ctx.fillRect(width-(fillVal * width), 0, width, height);
    element.appendChild(newBar);
    element.appendChild(document.createTextNode(params.value+'%'));
    element.dir='rtl';
    return element;
}

async function createHospitalStatusTable(){
    const chartData=(await getChartsData()).allHospitalStatus;
    // document.body.appendChild(createPercentageBar(100,50))
    
    let rowDataArray=[];
    for (let item of chartData){
        item.covidSpace='לא ידוע';      
        // item.occupiedSpace+='%';
        rowDataArray.push(item);
    }

    const columnDefs = [
        {headerName: "בית חולים", field: "hospital",
            cellStyle: {'font-weight': 'bold',
                        'text-align': 'right',
                        'width':'150px'
                    }
        },
        {headerName: "% תפוסה כללי", field: "occupiedSpace",cellRenderer: 'createPercentageBar',type: 'numberColumn'},
        {headerName: "% תפוסת קורונה", field: "covidSpace",
        cellStyle: {'opacity': '0.4',
        cellRenderer: 'createPercentageBar'
        }},
        {headerName: "צוות בבידוד", field: "staffInIsolation",type: 'numberColumn'},
        
      ];
          
      // specify the data
      const rowData = rowDataArray;
          

    
      // let the grid know which columns and what data to use
      const gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        enableRtl: true,
        headerHeight:45,
        editable: false,
        // minHeight:50,
        columnTypes: {
            
            // numberColumn: { textAlign: 'center' },
        },
        
        defaultColDef: {
            // set the default column width
            width: 180,
            
            sortable: true,
            suppressMovable:true,
            
            
            wrapText: true,     // <-- HERE
            autoHeight: true,
            cellStyle: {textAlign: 'center'}
          },
          onGridSizeChanged: onGridSizeChanged,
          components: {
            createPercentageBar: createPercentageBar,
          }
          
      };

      // setup the grid
      const gridDiv = document.querySelector('#hospitalStatusTable');
      new agGrid.Grid(gridDiv, gridOptions);
      
    
}

function drawBox(ctx,x,y,width,height,cornersRadius,borderWeight){
    
    //draw rectangle that will be the frame
    ctx.beginPath();
    ctx.moveTo(x + cornersRadius, y);
    ctx.lineTo(x + width - cornersRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + cornersRadius);
    ctx.lineTo(x + width, y + height - cornersRadius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - cornersRadius, y + height);
    ctx.lineTo(x + cornersRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - cornersRadius);
    ctx.lineTo(x, y + cornersRadius);
    ctx.quadraticCurveTo(x, y, x + cornersRadius, y);
    ctx.closePath();
    ctx.fillStyle = 'rgb(28,125,126,0.8)';
    ctx.fill();

    
    //draw smaller rectangle that will be the the background of the text box
    x+=borderWeight;
    y+=borderWeight;
    width-=borderWeight+2;
    height-=borderWeight+2;
    
    ctx.beginPath();
    ctx.moveTo(x + cornersRadius, y);
    ctx.lineTo(x + width - cornersRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + cornersRadius);
    ctx.lineTo(x + width, y + height - cornersRadius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - cornersRadius, y + height);
    ctx.lineTo(x + cornersRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - cornersRadius);
    ctx.lineTo(x, y + cornersRadius);
    ctx.quadraticCurveTo(x, y, x + cornersRadius, y);
    ctx.closePath();
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fill();
}
function drawTextBox(ctx, txt, font, x, y) {
     
    ctx.save();
    /// set font
    ctx.font = font;
    /// draw text from top
    ctx.textBaseline = 'top';
    /// get width of text
    var width = ctx.measureText(txt).width + 18;
    //rect assuming height of font
    var height=parseInt(font, 10)+8;


    drawBox(ctx,x-18,y-4,width,height,3,2);

    
    //text
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.font = "7px";
    ctx.fillText(txt+'%', x, y+1);
    
    /// restore original state
    ctx.restore();
    
}
async function createTestsToLocatePatientsChart(){
    const ctx = document.getElementById('testsToLocatePatientsChart');
    ctx.height=250;
    const chartData=(await getChartsData()).allTestsToLocatePatients;
    
    let dateLabels=[],
    testsAmount=[],
    positivePercentage=[];
    for (let item of chartData){
        let dateString = new Date(item.date).getDate()+'.'+(parseInt(new Date(item.date).getMonth())+1);
        dateLabels.push(dateString);
        testsAmount.push(item.testsAmount);
        positivePercentage.push(item.positivePercentage);
    }

    let myChart=new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dateLabels,
            datasets: [{
                type:'bar',
                label: '# of something',
                data: testsAmount,
                barThickness:10,
                backgroundColor: 'rgba(80, 203, 253, 1)',

                hoverShadowOffsetX: 0,
                hoverShadowOffsetY: 0,
                hoverShadowBlur: 10,
                hoverShadowColor: 'rgba(0, 0, 0, 0.4)',
            }]
        },
        options: {
            cornerRadius: 20,
            legend: {
                display:false
             },
            "hover": {//pointer
                onHover: function(e) {
                    const point = this.getElementAtEvent(e);
                    if (point.length) e.target.style.cursor = 'pointer';
                    else e.target.style.cursor = 'default';
                 },
                "animationDuration": 0,
                
            },
            "animation": {//data labels - top of the bars
                "duration": 1,
                    "onComplete": function () {
                        let chartInstance = this.chart,
                            ctx = chartInstance.ctx;
                        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        this.data.datasets.forEach(function (dataset, i) {
                            let meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function (bar, index) {
                                let data = dataset.data[index];
                                data=numberWithCommas(data);
                                //draw data text on top of every bar
                                ctx.fillStyle = "rgba(0,0,0,0.7)";                     
                                ctx.fillText(data, bar._model.x, bar._model.y - 5);
                                //draw txt box of the percentage
                                drawTextBox(ctx,positivePercentage[index],ctx.font,bar._model.x, bar._model.base-17);
                                
                            });
                        });
                    }
            },
            tooltips: {enabled: false},//remove tooltips box
            
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        padding:0,
                        maxTicksLimit: 6,
                        userCallback: function(value, index, values) {
                            value = value.toString();
                            value = value.split(/(?=(?:...)*$)/);
                            value = value.join(',');
                            return value;
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'מספר בדיקות',
                        fontFamily:'sans-serif',
                        fontSize:14,
                        fontColor:'rgba(0,0,0,0.7)',
                        padding:10,
                    },
                    gridLines: false,
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        padding:15,
                        
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'תאריך הבדיקה',
                        fontFamily:'sans-serif',
                        fontSize:13,
                        fontColor:'rgba(0,0,0,0.7)',
                        padding:0,
                    },
                    gridLines: false,
                }],
            },
            layout:{
                padding:{
                    right:10,
                    bottom:10
                },
            },
            responsive:true,
            maintainAspectRatio: false,
            
            
        },
        
            
        
        
    });
}


// General Information Boxes - Top of the page
//Create all boxes
async function createGeneralInformationBoxes(){
    const chartData=(await getChartsData());
    
    const reduceAllTimeData=(dayInfoArray)=>{
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        return dayInfoArray.reduce(reducer);

    }


    const totalCases={
        title:'סה"כ מאומתים (נדבקים)',
        // main:chartData.allCurveData[chartData.allCurveData.length-1].totalCases,
        main:reduceAllTimeData(chartData.allCurveData.map(dayInfo=>dayInfo.newCases)),
        fromMidnight:chartData.allCurveData[chartData.allCurveData.length-1].newCases,
        fromYesterday:chartData.allCurveData[chartData.allCurveData.length-2].newCases,
        moderate:'none',
        critical:chartData.allSeriousCases[chartData.allSeriousCases.length-1].critical
    }
    
    const respirators={
        title:'מונשמים',
        main:chartData.allSeriousCases[chartData.allSeriousCases.length-1].respirators,
        fromMidnight:
            chartData.allSeriousCases[chartData.allSeriousCases.length-1].respirators-
            chartData.allSeriousCases[chartData.allSeriousCases.length-2].respirators,
        allData:chartData.allSeriousCases.map(({date,respirators}) => ([Date.parse(date),respirators]))
    }

    
    const totalDeaths={
        title:'נפטרים',
        main:reduceAllTimeData(chartData.allSeriousCases.map(dayInfo=>dayInfo.deaths)),
        fromMidnight: chartData.allSeriousCases[chartData.allSeriousCases.length-1].deaths,
        allData:chartData.allSeriousCases.map(({date,deaths}) => ([Date.parse(date),deaths]))
    }


    const totalRecoverdCases={
        title:'החלימו עד כה',
        main:reduceAllTimeData(chartData.allCurveData.map(dayInfo=>dayInfo.recoverdCases)),
        fromMidnight:chartData.allCurveData[chartData.allCurveData.length-1].recoverdCases,
        allData:chartData.allCurveData.map(({date,recoverdCases}) => ([Date.parse(date),recoverdCases]))
    }
    
    const totalTestsYesterday={
        title:'כלל הבדיקות שהתבצעו אתמול',
        main:chartData.allTestsToLocatePatients[chartData.allTestsToLocatePatients.length-2].testsAmount,
        fromMidnight:chartData.allTestsToLocatePatients[chartData.allTestsToLocatePatients.length-1].testsAmount
    }
    
    const activeCases={
        title:'חולים פעילים',
        main:totalCases.main-totalRecoverdCases.main,
        fromMidnight:
            //newCases-recoverdCases-deaths
            chartData.allCurveData[chartData.allCurveData.length-1].newCases-
            chartData.allCurveData[chartData.allCurveData.length-1].recoverdCases-
            chartData.allSeriousCases[chartData.allSeriousCases.length-1].deaths,
        //where
        home:'none',
        hotel:'none',
        hospital:'none'
    }
    
    
    
    
    createInfoBox(totalTestsYesterday);
    createInfoBox(totalRecoverdCases,true);
    createInfoBox(totalDeaths,true);
    createInfoBox(respirators,true);
    createInfoBox(activeCases);
    createInfoBox(totalCases);
}
//Create single box
function createInfoBox(dataObject,isContainsTrendButton){
    const generalContainer=document.getElementById('general-info-container');

    const infoBoxContainer=document.createElement('div');
    infoBoxContainer.classList.add('general-info__item');
    const title=document.createElement('h6');
    title.classList.add('title');
    title.innerText=dataObject.title;
    const mainNumber=document.createElement('h5');
    mainNumber.classList.add('main-number');
    mainNumber.innerText=numberWithCommas(dataObject.main);
    const subNumber=document.createElement('p');
    subNumber.classList.add('sub-number');
    
    const subNumberValue=document.createElement('span');
    subNumberValue.classList.add('value');
    subNumberValue.innerHTML=numberWithCommas(Math.abs(dataObject.fromMidnight))+((dataObject.fromMidnight>0)?'+':'-');
    subNumber.appendChild(subNumberValue);
    const subNumberLable=document.createElement('span');
    subNumberLable.innerHTML='מחצות';
    subNumber.appendChild(subNumberLable);

    infoBoxContainer.appendChild(title);
    infoBoxContainer.appendChild(mainNumber);
    infoBoxContainer.appendChild(subNumber);
    generalContainer.appendChild(infoBoxContainer);
    

    if(isContainsTrendButton){
        const trendButton=createTrendChartButton(infoBoxContainer);
        infoBoxContainer.appendChild(trendButton);
        //dailyCharts - array which contains the details and the status
        dailyCharts.push({
            open:false,
            parentElement: infoBoxContainer,
            title: dataObject.title +' - שינוי יומי',
            data: dataObject.allData
        })
    }
    
    
}
function createTrendChartButton(informationBoxElement){
    //Trend chart
    const trendButton=document.createElement('button');
    trendButton.classList.add('daily-trend-button');

    //icon
    const buttonIcon=document.createElement('span');
    buttonIcon.classList.add('daily-trend-icon');
    buttonIcon.classList.add('close');
    trendButton.appendChild(buttonIcon);
    
    //label
    const buttonLabel=document.createElement('span');
    buttonLabel.innerHTML="מגמת שינוי יומית";
    trendButton.appendChild(buttonLabel);
    
    //trend button event
    trendButton.addEventListener('click',(event)=>{
        dailyCharts.map(chartObj=>{
            if (chartObj.parentElement.isEqualNode(informationBoxElement)){
                chartObj.open=!chartObj.open;
                
            }else{
                chartObj.open=false;
            }
        })
        renderDailyCharts();
    })
    return trendButton;
}
//Create daily trend chart - get div container id
function createDailyChart(id,axisLabelY,data){
    // var data = [];
    //     var currentValue = 100;
    //     var random = d3.random.normal(0, 20.0);

    //     for(var i=0; i<100; i++) {
    //         var currentDate = new Date();
    //         currentDate.setDate(currentDate.getDate() + i);
            
    //         data.push([currentDate, currentValue]);
    //         currentValue = currentValue + random();
    //     }
    // console.log(data);

        var drawLineGraph = function(containerHeight, containerWidth, data, yLabel, xLabel) {

            var svg = d3.select(`#${id}`).append("svg")
                .attr("width", containerWidth)
                .attr("height", containerHeight);

            var margin = { top: 10, left: 50, right: 10, bottom: 50 };
            
            var height = containerHeight - margin.top - margin.bottom;
            var width = containerWidth - margin.left - margin.right;

            var xDomain = d3.extent(data, function(d) { return d[0]; })
            var yDomain = d3.extent(data, function(d) { return d[1]; });

            var xScale = d3.time.scale().range([0, width]).domain(xDomain);
            var yScale = d3.scale.linear().range([height, 0]).domain(yDomain);

            var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(5).tickFormat(d3.time.format("%d.%m"));
            var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(5);

            var line = d3.svg.line()
                .x(function(d) { return xScale(d[0]); })
                .y(function(d) { return yScale(d[1]); });

            var area = d3.svg.area()
                .x(function(d) { return xScale(d[0]); })
                .y0(function(d) { return yScale(d[1]); })
                .y1(height);

            var g = svg.append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

            g.append('path')
                .datum(data)
                .attr('class', 'area')
                .attr('d', area)
                .style("fill", "url(#mygrad)");//id of the gradient for fill

            g.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0, ' + height + ')')
                .call(xAxis)
				.append('text')
                    .attr('transform', 'rotate(0)')
                    .attr('x', width/2)
                    .attr('dy', '2.71em')
                    .attr('text-anchor', 'end')
					.attr('class','axisX-label')
                    .text(xLabel);

            g.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
                .append('text')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', 6)
                    .attr('dy', '-3.9em')
					.attr('dx','-6em')
                    .attr('text-anchor', 'end')
					.attr('class','axisY-label')
                    .text(yLabel);

            g.append('path')
                .datum(data)
                .attr('class', 'daily-line')
                .attr('d', line);


            // Gradient - Chart Area
    
            //make defs and add the linear gradient
            var lg = svg.append("defs").append("linearGradient")
            .attr("id", "mygrad")//id of the gradient
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%")//since its a vertical linear gradient 
            ;
            lg.append("stop")
            .attr("offset", "0%")
            .style("stop-color", "rgb(80,203,253)")//end in red
            .style("stop-opacity", 1)

            lg.append("stop")
            .attr("offset", "90%")
            .style("stop-color", "white")//start in blue
            .style("stop-opacity", 1);
            
            
            
            // focus tracking
            var focus = g.append('g').style('display', 'none');
            
			//lines
            focus.append('line')
                .attr('id', 'focusLineX')
                .attr('class', 'focusLine');
            focus.append('line')
                .attr('id', 'focusLineY')
                .attr('class', 'focusLineDashed');
            //focus point
			focus.append('circle')
                .attr('id', 'focusCircle')
                .attr('r', 5)
                .attr('class', 'circle focusCircle');
			
			
			//Lebels
			//labels box
			focus.append('rect')
				.attr('id','focusLabelBoxX')
				.attr('class','focusLabelBox');
			focus.append('rect')
				.attr('id','focusLabelBoxY')
				.attr('class','focusLabelBox');

			//labels text
			focus.append('text')
				.attr('id','focusLabelX')
				.attr('class','focusLabel');
			focus.append('text')
				.attr('id','focusLabelY')
				.attr('class','focusLabel');
				

            var bisectDate = d3.bisector(function(d) { return d[0]; }).left;

            g.append('rect')
                .attr('class', 'overlay')
                .attr('width', width)
                .attr('height', height)
                .on('mouseover', function() { focus.style('display', null); })
                .on('mouseout', function() { focus.style('display', 'none'); })
                .on('mousemove', function() { 
                    var mouse = d3.mouse(this);
					
                    var mouseDate = xScale.invert(mouse[0]);
					var mouseValue=yScale.invert(mouse[1]);
                    var i = bisectDate(data, mouseDate); // returns the index to the current data item
					//console.log(mouseValue);
                    var d0 = data[i - 1]
                    var d1 = data[i];
                    // work out which date value is closest to the mouse
                    var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;

                    var x = xScale(d[0]);
                    var y = yScale(d[1]);
					
					
					
                    focus.select('#focusCircle')
                        .attr('cx', x)
                        .attr('cy', y);
                    focus.select('#focusLineX')
                        .attr('x1', x).attr('y1', yScale(yDomain[0]))
                        .attr('x2', x).attr('y2', yScale(yDomain[1]));
                    focus.select('#focusLineY')
                        .attr('x1', xScale(xDomain[0])).attr('y1', mouse[1])
                        .attr('x2', xScale(xDomain[1])).attr('y2', mouse[1]);
	
	
	
					
					//Label text
					let labelOffsetXaxis=15;
					focus.select('#focusLabelX')
						.attr('x', x-labelOffsetXaxis)
						.attr('y', yScale(yDomain[0])+labelOffsetXaxis)
						.text(mouseDate.getDate()+'.'+(mouseDate.getMonth()+1))
						
					
					let labelOffsetYaxis=40;
					focus.select('#focusLabelY')
						.attr('x', xScale(xDomain[0])-labelOffsetYaxis)
						.attr('y', mouse[1])
						.text(mouseValue.toFixed(2));
					
					//Label box
					let elementLabelY=document.querySelector('#focusLabelY');
					let labelWidthY = elementLabelY.getBBox().width;
					focus.select('#focusLabelBoxY')
						.attr('x', xScale(xDomain[0])-labelOffsetYaxis-labelWidthY*0.09)
						.attr('y', mouse[1]-14)
						.attr('width',labelWidthY*1.2);
					
					let elementLabelX=document.querySelector('#focusLabelX');
					let labelWidthX = elementLabelX.getBBox().width;
					focus.select('#focusLabelBoxX')
						.attr('x', x-labelOffsetXaxis-labelWidthX*0.09)
						.attr('y', yScale(yDomain[0]))
						.attr('width',labelWidthX*1.2);;
					
	
                });

           
        };
        const chartWidth=(window.innerWidth<420)?310:390;
        drawLineGraph(246, chartWidth, data, axisLabelY,"תאריך");
        return;
}

//dailyCharts - daily trend chart state object
//example: {open:false, parentElement: infoBoxContainer, title: 'משהו - שינוי יומי', data: d}
const dailyCharts=[];
function renderDailyCharts(){

    removeOpenArrowBox();

    for (let dailyChart of dailyCharts){
        
        const informationBoxElement=dailyChart.parentElement;
        const trendChartButton=informationBoxElement.lastChild.querySelector(".daily-trend-icon");
        if(dailyChart.open){
            //container
            const newDailyChartContainer=document.createElement('div');
            newDailyChartContainer.classList.add('arrow_box');
            //title
            const dailyChartTitle=document.createElement('h2');
            dailyChartTitle.classList.add("daily-chart-title");
            dailyChartTitle.textContent=dailyChart.title;
            newDailyChartContainer.appendChild(dailyChartTitle);
            //chart
            const newDailyChart=document.createElement('div');
            newDailyChart.id="open-arrow_box";
            newDailyChartContainer.appendChild(newDailyChart);
            
            const infoBoxDOMRect = informationBoxElement.getBoundingClientRect();

            //add offset if daily chart out of screen
            let offsetX=20;
            if (infoBoxDOMRect.left>window.innerWidth/2){
                if(infoBoxDOMRect.left+410>window.innerWidth)
                    offsetX=-(infoBoxDOMRect.left+410-window.innerWidth);
            }
            
            newDailyChartContainer.style.top=infoBoxDOMRect.bottom+window.pageYOffset+3+"px";
            newDailyChartContainer.style.left=infoBoxDOMRect.left-20+offsetX+"px";
            document.body.appendChild(newDailyChartContainer);

            createDailyChart('open-arrow_box','כמות',dailyChart.data);
        }
        changeButtonDisplay(informationBoxElement,trendChartButton,dailyChart.open);
    }
    
    //removing current open chart - if there's one
    function removeOpenArrowBox(){
        const openChart=document.querySelector(".arrow_box");
        if(openChart)
            document.body.removeChild(openChart);
    }

    //changing the button and container style
    function changeButtonDisplay(informationBoxElement,buttonElement,isOpen){
        if (isOpen){
            buttonElement.classList.remove('close');
            buttonElement.classList.add('open');
            informationBoxElement.classList.add("massive-shadow");
        }else if (buttonElement.classList.contains('open')){
            buttonElement.classList.remove('open');
            buttonElement.classList.add('close');
            informationBoxElement.classList.remove("massive-shadow");
        }
    }
}


//when window resize - render the daily charts to relocate them
window.addEventListener('resize',renderDailyCharts);
//click on document close the daily chart
document.addEventListener('click', (event)=>{
    const b=document.getElementsByClassName("daily-trend-button");
    const arrowBox=document.querySelector(".arrow_box");
    for (let button of b){
        if (button.isEqualNode(event.target) || button.isEqualNode(event.target.parentNode))
            return;
        else if (arrowBox){
            if (arrowBox.isEqualNode(event.target) || 
                arrowBox.isEqualNode(event.target.closest(".arrow_box"))){
                return;
            }
        } 
    }
    dailyCharts.map(chartObj=>{
        chartObj.open=false;
    })
    
    renderDailyCharts();
})



const renderAllCharts=function(){
    createGeneralInformationBoxes();
    createNewCasesChart();
    createCriticalCasesChart();
    createNewCasesTrendChart();
    createSeriousCasesChart();
    createEpidemicCurveChart();
    createCasesByAgeAndGenderChart();
    createSpreadingAreasTable();
    createStaffInIsolationChart();
    createHospitalStatusTable();
    createTestsToLocatePatientsChart();
}

renderAllCharts();