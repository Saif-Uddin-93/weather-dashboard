function callAPI(city, countryCode){
    const apiKey = "f7755e3d7158d958bc9cd2b4fee96a47";

    // https://api.openweathermap.org/data/2.5/weather?q=London,&APPID=f7755e3d7158d958bc9cd2b4fee96a47&units=metric&dt=1705861348330
    
    callFetch(0);
    function callFetch(nextDay) {
        const time = day(nextDay).timestamp;
        const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&APPID=${apiKey}&units=metric&dt=${time}`;
        
        fetch(apiURL)
            .then(response => response.json())
            .then(result => {
                //console.log(time, nextDay);
                //console.log(apiURL)
                const city = result.name;
                const country = result.sys.country;
                const cityInfo = {
                    cityName: city,
                    countryName: country,
                    forecast,
                }
                
                cityInfo.forecast[days[nextDay]] = {
                    timestamp : result.dt,
                    temp : result.main.temp,
                    wind : result.wind.speed,
                    humidity : result.main.humidity,
                }
                updateWeatherInfo(day(nextDay), cityInfo); // today
                if(nextDay===5){
                    addCountryToRecent(cityInfo);
                }
                return nextDay+1
            })
            .then(nextDay => {
                if(nextDay <= 5) {
                    callFetch(nextDay);
                }
            })
            .catch(error => console.error(error));
    }
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
    let y = convertTime.getFullYear()
    
    //console.log(day.timestamp, d, m, y);
    console.log(day.selector, result);
    //$("#forecast").html("")
    //appendForecast(day.selector);

    $(".city-name").text(result.cityName);
    $(`${day.selector} .date`).text(`${d}/${m}/${y}`);
    $(`${day.selector} .temp`).text(result.forecast[day.selector].temp);
    $(`${day.selector} .wind`).text(result.forecast[day.selector].wind);
    $(`${day.selector} .humidity`).text(result.forecast[day.selector].humidity);

    saveLocal(result);
}

$("#search-button").on("click", function(event){
    event.preventDefault();
    const searchInput = $("#search-input").val().replace(" ", "").split(',');
    const city = searchInput[0];
    const country = !searchInput[1] ? '' : searchInput[1].toUpperCase();
    console.log(city, country)
    appendSearch(`${city}, ${country}`);
    callAPI(city, country)
})

function appendForecast(selector){
    selector = selector.replace("#", "");
    const element = $("<div>")
    element.attr("id", `${selector}`)
    element.addClass("col")
    element.html(`<h6 class="date"></h6>
    <p>Temp: <span class="temp"></span>°C</p>
    <p>Wind: <span class="wind"></span>KPH</p>
    <p>Humidity: <span class="humidity"></span>%</p>`)
    $("#forecast").append(element)
}

function appendSearch(searchItem){
    const searchedElement = $(`<li>`)
    searchedElement.addClass("search-item")
    searchedElement.text(searchItem)
    $("#history").append(searchedElement); 
    addRecentEvent();
}

function addCountryToRecent(result){
    let recentSearch = document.querySelectorAll(".search-item")
    recentSearch = recentSearch[recentSearch.length-1]
    //let city = result.name;
    let city = result.cityName;
    let countryCode = recentSearch.textContent.trim().split(',')[1];
    //countryCode = !countryCode ? result.sys.country.toUpperCase() : country.toUpperCase();
    countryCode = !countryCode ? result.countryName.toUpperCase() : countryCode.toUpperCase();
    //console.log(recentSearch)
    recentSearch.textContent=`${city}, ${countryCode}`
}   

function addRecentEvent(){
    $(".search-item").on("click", function(event){
        console.log("clicked", event.target.textContent)
        const item = event.target.textContent.replace(" ", "")
        console.log(item)
        //loadLocal(event.target.textContent.replace(" ", ""))
        //loadLocal(`${item[0]},${item[1]}`)
        loadLocal(item)
    })
}

const days = ["#today", "#day-1", "#day-2", "#day-3", "#day-4", "#day-5"];

function loadLocal(city){
    const result = JSON.parse(localStorage.getItem(city));
    console.log(city, result)
    for (let i = 0; i < days.length; i++) {
        updateWeatherInfo(day(i), result)
    }
}

function saveLocal(cityObj){
    /* const city = cityObj.name;
    const country = cityObj.sys.country;

    const cityInfo = {
        cityName: city,
        countryName: country,
        forecast,
    }
    
    cityInfo.forecast[date] = {
        timestamp : cityObj.dt,
        temp : cityObj.main.temp,
        wind : cityObj.wind.speed,
        humidity : cityObj.main.humidity,
    } */
    const city = cityObj.cityName;
    const country = cityObj.countryName;
    const recentSearches = JSON.parse(localStorage.getItem(`${city},${country}`)) || {};
    recentSearches[`${city},${country}`]=cityObj//cityInfo;
    //localStorage.setItem(`${city},${country}`, JSON.stringify(cityInfo));
    localStorage.setItem(`${city},${country}`, JSON.stringify(cityObj));
}