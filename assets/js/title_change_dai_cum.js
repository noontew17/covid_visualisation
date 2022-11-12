
function changeHeader_cum(){
    document.getElementById("CasesGraph_title").innerHTML="Cumulative Cases"
    document.getElementById("DeathsGraph_title").innerHTML="Cumulative Deaths"
    document.getElementById("TestsGraph_title").innerHTML="Cumulative Tests"
    document.getElementById("HospitalsGraph_title").innerHTML="Cumulative Hospitalization"
};

function changeHeader_day(){
    document.getElementById("CasesGraph_title").innerHTML="Daily Cases"
    document.getElementById("DeathsGraph_title").innerHTML="Daily Deaths"
    document.getElementById("TestsGraph_title").innerHTML="Daily Tests"
    document.getElementById("HospitalsGraph_title").innerHTML="Daily Hospitalization"
};

function changeHeader_cases(){
    document.getElementById("Map_title").innerHTML="Country Positive Cases"
    document.getElementById("BarChart_title").innerHTML="Country Positive Cases"

};

function changeHeader_deaths(){
    document.getElementById("Map_title").innerHTML="Country Deaths"
    document.getElementById("BarChart_title").innerHTML="Country Deaths"
};