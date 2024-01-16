//let apiResult = {};
function callFetch(apiURL, nextDay){
    fetch(apiURL)
    .then(response => response.json())
    .then(result => {
        updateWeatherInfo(day(nextDay), result);
    })
}
function callAPI(city, countryCode, index){
    let time = day(0).timestamp;
    const apiKey = "f7755e3d7158d958bc9cd2b4fee96a47";
    // https://api.openweathermap.org/data/2.5/weather?q=London,&APPID=f7755e3d7158d958bc9cd2b4fee96a47&units=metric
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&APPID=${apiKey}&units=metric&dt=${time}`;
    
    fetch(apiURL)
    .then(response => response.json())
    .then(result => {
        console.log(time, index);
        console.log(apiURL)
        updateWeatherInfo(day(index), result); // today
        return index+1
    })
    .then(nextDay => {
        time = day(nextDay).timestamp
        apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&APPID=${apiKey}&units=metric&dt=${time}`;
        callFetch(apiURL, nextDay); // day-1
        console.log(time, nextDay);
        console.log(apiURL)
        return nextDay+1;
    })
    .then(nextDay => {
        time = day(nextDay).timestamp
        apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&APPID=${apiKey}&units=metric&dt=${time}`;
        callFetch(apiURL, nextDay); // day-2
        console.log(time, nextDay);
        console.log(apiURL)
        return nextDay+1;
    })
    .then(nextDay => {
        time = day(nextDay).timestamp
        apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&APPID=${apiKey}&units=metric&dt=${time}`;
        callFetch(apiURL, nextDay); // day-3
        console.log(time, nextDay);
        console.log(apiURL)
        return nextDay+1;
    })
    .then(nextDay => {
        time = day(nextDay).timestamp
        apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&APPID=${apiKey}&units=metric&dt=${time}`;
        callFetch(apiURL, nextDay); // day-4
        console.log(time, nextDay);
        console.log(apiURL)
        return nextDay+1;
    })
    .then(nextDay => {
        time = day(nextDay).timestamp
        apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&APPID=${apiKey}&units=metric&dt=${time}`;
        callFetch(apiURL, nextDay); // day-5
        console.log(time, nextDay);
        console.log(apiURL)
        //return nextDay+1;
    })
    //.catch(err)
}


function day(index=0){
    const oneDay = 86400 //seconds
    const timeToday = Date.now();
    let timestamp = timeToday + (oneDay*index*1000);
    let selector = index>0 ? `#day-${index}`: "#today";
    if (index>5)return;
    return {selector, timestamp}
}

/* const exampleAPIResult = 
{
    "coord":{
        "lon":-0.1257,
        "lat":51.5085},
    "weather":[{
        "id":803,
        "main":"Clouds",
        "description":"broken clouds",
        "icon":"04n"}],
    "base":"stations",
    "main":{
        "temp":4.07,
        "feels_like":1.32,
        "temp_min":2.9,
        "temp_max":4.98,
        "pressure":1009,
        "humidity":83},
    "visibility":10000,
    "wind":{
        "speed":3.09,
        "deg":360},
    "clouds":{
        "all":75},
    "dt":1705266216,
    "sys":{
        "type":2,
        "id":2075535,
        "country":"GB",
        "sunrise":1705219240,
        "sunset":1705249051},
    "timezone":0,
    "id":2643743,
    "name":"London",
    "cod":200
} */

function updateWeatherInfo(day, result){
    //console.log(day.timestamp);
    let convertTime = new Date (day.timestamp);
    //console.log(convertTime);
    let d = convertTime.getDate()<10 ? `0${convertTime.getDate()}`:`${convertTime.getDate()}`;
    let m = (convertTime.getMonth()+1)<10 ? `0${convertTime.getMonth()+1}`:`${convertTime.getMonth()+1}`;
    let y = convertTime.getFullYear().toString();
    
    /* d = dayjs.unix(day.timestamp).format('DD')
    m = dayjs.unix(day.timestamp).format('MM')
    y = dayjs.unix(day.timestamp).format('YYYY') */
    
    console.log(day.timestamp, d, m, y);

    $(".city-name").text(result.name);
    $(`${day.selector} .date`).text(`${d}/${m}/${y}`);
    $(`${day.selector} .temp`).text(result.main.temp);
    $(`${day.selector} .wind`).text(result.wind.speed);
    $(`${day.selector} .humidity`).text(result.main.humidity);
    saveLocal(day.selector, result);
}

$("#search-button").on("click", function(event){
    event.preventDefault();
    const searchInput = $("#search-input").val().trim().split(",");
    console.log(searchInput[0], searchInput[1]||'')
    callAPI(searchInput[0], searchInput[1]||'', 0)
})

function loadLocal(city){
    const result = JSON.parse(localStorage.getItem("su-weather-app"));
}

function saveLocal(date, cityObj){
    const cityInfo = {
        cityName: cityObj.name,
        countryName: cityObj.sys.country,
    }

    cityInfo["forecast"][date] = {
        timestamp : cityObj.dt,
        temp : cityObj.main.temp,
        wind : cityObj.wind.speed,
        humidity : cityObj.main.humidity,
    }
    
    const recentSearches = JSON.parse(localStorage.getItem(`${cityObj.name},${cityObj.sys.country}`)) || {};
    recentSearches[`${cityObj.name},${cityObj.sys.country}`]=cityInfo;
    localStorage.setItem(`${cityObj.name},${cityObj.sys.country}`, JSON.stringify(cityInfo));
}