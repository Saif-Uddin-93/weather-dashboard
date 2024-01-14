const city = "london";
const country = "UK";
const apiKey = "f7755e3d7158d958bc9cd2b4fee96a47";
const openWeatherAPI = `api.openweathermap.org/data/2.5/weather?q=${city},${country}&APPID=${apiKey}&units=metric`;

const exampleAPIResult = 
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
}

$(".city-name").text(exampleAPIResult.name);
$("#today .date").text(dayjs().format("DD/MM/YYYY"));
$("#today .temp").text(exampleAPIResult.main.temp);
$("#today .wind").text(exampleAPIResult.wind.speed);
$("#today .humidity").text(exampleAPIResult.main.humidity);