main();
function main(){
    loadSavedToRecent(0);
}


function callAPI(city, countryCode){
    const apiKey = "f7755e3d7158d958bc9cd2b4fee96a47";

    // `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&APPID=${apiKey}&units=metric&dt=${time}`
    // `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&APPID=f7755e3d7158d958bc9cd2b4fee96a47&units=metric`
    // https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    
    callFetch(0);
    function callFetch(nextDay) {
        //const time = day(nextDay).timestamp;
        const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&APPID=${apiKey}&units=metric`;
        
        fetch(apiURL)
        .then(response => response.json())
        .then(result => {
            const city = result.city.name;
            const country = result.city.country;
            const cityInfo = {
                cityName: city,
                countryName: country,
                forecast,
            };
            cityObject(day(nextDay), cityInfo, result, nextDay);
        })
        .catch(error => {
            console.error(error);
            errorMsg('Invalid search input!')
            $("#errorModal").modal('show')
            let recentSearch = document.querySelectorAll(".search-item");
            recentSearch = recentSearch[recentSearch.length-1];
            recentSearch.remove();
        })
    }
}

function errorMsg(msg){
    $(".error-msg").text(msg);
}

function day(index=0){
    const oneDay = 86400; //seconds
    const timeToday = Date.now();
    let timestamp = timeToday + (oneDay*index*1000);
    let selector = index>0 ? `#day-${index}`: "#today";
    if (index>5)return;
    return {selector, timestamp}
}

function noonIndex(result, index){
    const oneDay = 86400;
    const timestamp = result.list[index].dt;
    // console.log(`remainder: ${timestamp % oneDay}`);
    // look for index at 12pm
    if(timestamp % oneDay !== 43200){return noonIndex(result, index+1)}
    // console.log("next day index:", index)
    return index;
}

function cityObject(dayObj, cityInfo, result, dtIndex, index=0){
    cityInfo.forecast[dayObj.selector] = {
        timestamp : result.list[dtIndex].dt,
        weatherIcon: result.list[dtIndex].weather[0].icon,
        temp : result.list[dtIndex].main.temp,
        wind : result.list[dtIndex].wind.speed,
        humidity : result.list[dtIndex].main.humidity,
    };
    if(index<5){
        let nextDayIndex = noonIndex(result, dtIndex+1);
        cityObject(day(index+1), cityInfo, result, nextDayIndex, index+1);
    }
    else {
        saveLocal(cityInfo)
        updateWeatherInfo(day(0), cityInfo, 0);
    }
}

function updateWeatherInfo(dayObj, cityInfo, index=0){
    
    let convertTime = new Date (dayObj.timestamp);
    let d = convertTime.getDate()<10 ? `0${convertTime.getDate()}`:`${convertTime.getDate()}`;
    let m = (convertTime.getMonth()+1)<10 ? `0${convertTime.getMonth()+1}`:`${convertTime.getMonth()+1}`;
    let y = convertTime.getFullYear();
    
    // console.log(dayObj.selector, cityInfo);
    //$("#forecast").html("")
    //appendForecast(day.selector);
    const {weatherIcon} = cityInfo.forecast[dayObj.selector];

    $(".city-name").text(cityInfo.cityName);
    $(`${dayObj.selector} .date`).text(`${d}/${m}/${y}`);
    $(`${dayObj.selector} .weather-icon`).attr("src", `http://openweathermap.org/img/w/${weatherIcon}.png`);
    $(`${dayObj.selector} .weather-icon`).attr("alt", `Weather icon`);
    $(`${dayObj.selector} .temp`).text(cityInfo.forecast[dayObj.selector].temp);
    $(`${dayObj.selector} .wind`).text(cityInfo.forecast[dayObj.selector].wind);
    $(`${dayObj.selector} .humidity`).text(cityInfo.forecast[dayObj.selector].humidity);

    if(index<5){
        updateWeatherInfo(day(index+1), cityInfo, index+1)
    }
    else $('#forecast').css('opacity','1')
}

$("#search-button").on("click", function(event){
    event.preventDefault();
    const searchInput = $("#search-input").val().replace(/\s+/g, "").split(',');
    const city = searchInput[0];
    const country = !searchInput[1] ? '' : searchInput[1].toUpperCase();
    // console.log(city, country);
    appendSearch(`loading...`);
    // if($("#search-input").val()===''){
    //     errorMsg('Invalid search input!')
    // }
    callAPI(city, country);
})

function appendForecast(selector){
    selector = selector.replace("#", "");
    const element = $("<div>");
    element.attr("id", `${selector}`);
    element.addClass("col");
    element.html(`<h6 class="date"></h6>
    <p>Temp: <span class="temp"></span>°C</p>
    <p>Wind: <span class="wind"></span>KPH</p>
    <p>Humidity: <span class="humidity"></span>%</p>`);
    $("#forecast").append(element);
}

function appendSearch(searchItem){
    const searchedElement = $(`<li>`);
    searchedElement.addClass("search-item");
    const title = $("<h6>");
    title.text(searchItem)
    // searchedElement.text(searchItem);
    const closeIcon = $('<button>');
    closeIcon.addClass('btn-close');
    closeIcon.attr('type', 'button')
    closeIcon.attr('aria-label', 'Close');
    searchedElement.append(title);
    searchedElement.append(closeIcon);
    $("#history").append(searchedElement); 
    addRecentEvent();
}

function addCountryToRecent(result){
    let recentSearchText = document.querySelectorAll(".search-item h6");
    //let recentSearch = document.querySelectorAll(".search-item");
    recentSearchText = recentSearchText[recentSearchText.length-1];
    //recentSearch = recentSearch[recentSearch.length-1];
    //let cityName = recentSearch.textContent.split(",")[0];
    let {cityName} = result
    // cityName = cityName.split("")
    // const capitalized = cityName[0].toUpperCase();
    // cityName[0] = capitalized;
    // cityName = cityName.join("");
    let {countryName} = result;
    recentSearchText.textContent=`${cityName}, ${countryName}`;
    //recentSearch.classList.add(`${cityName}-${countryName}`)
}   

function addRecentEvent(){
    $(".search-item").on("click", function(event){
        //console.log("clicked", event.target.textContent);
        const recentCity = event.target.textContent.replace(/\s+/g, "");
        console.log(recentCity);
        loadLocal(recentCity);
    })
    $(".search-item .btn-close").on("click", function(event){
        event.stopPropagation();
        const parent = this.parentElement;
        console.log(parent.textContent.replace(/\s+/g, ""), "removed")
        localStorage.removeItem(parent.textContent.replace(/\s+/g, ""));
        parent.remove();
    }, )
}

const days = ["#today", "#day-1", "#day-2", "#day-3", "#day-4", "#day-5"];

function loadLocal(city){
    const cityInfo = JSON.parse(localStorage.getItem(city));
    console.log(city, cityInfo);
    loop(0);
    function loop(index){
        updateWeatherInfo(day(index), cityInfo, 0);
        index++;
        if(index<days.length)loop(index);
    }
}

function saveLocal(cityObj){
    const {cityName} = cityObj;
    const {countryName} = cityObj;
    const recentSearches = JSON.parse(localStorage.getItem(`${cityName},${countryName}`)) || {};
    recentSearches[`${cityName},${countryName}`] = cityObj;
    localStorage.setItem(`${cityName},${countryName}`, JSON.stringify(cityObj));
    addCountryToRecent(cityObj);
}

function loadSavedToRecent(i){
    const cityInfo = Object.entries(localStorage);
    // console.log(cityInfo);
    if(cityInfo){
        const savedLength = cityInfo.length;
        // console.log(savedLength);
        if(i===savedLength) return;
        else if(i<savedLength) {
            const cityName = cityInfo[i][0].split(',');
            appendSearch(`${cityName[0]}, ${cityName[1]}`);
            loadSavedToRecent(i+1);
        }
    }
}