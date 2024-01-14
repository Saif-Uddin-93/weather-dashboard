const city = "london";
const countryCode = "UK";
const apiKey = "f7755e3d7158d958bc9cd2b4fee96a47";
const openWeatherAPI = `api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&APPID=${apiKey}`;

const exampleAPIResult = 
{"coord":
    {"lon":-0.1257,"lat":51.5085},
    "weather":[{
        "id":802,
        "main":"Clouds",
        "description":"scattered clouds",
        "icon":"03n"
    }],
    "base":"stations",
    "main":{
        "temp":277.57,
        "feels_like":273.69,
        "temp_min":276.24,
        "temp_max":278.42,
        "pressure":1009,
        "humidity":83
    },
    "visibility":10000,
    "wind":
    {
        "speed":5.14,"deg":290
    },
    "clouds":
    {
        "all":40
    },
    "dt":1705264073,
    "sys":
    {
        "type":2,
        "id":2075535,
        "country":"GB",
        "sunrise":1705219240,
        "sunset":1705249051
    },
    "timezone":0,
    "id":2643743,
    "name":"London",
    "cod":200,
}
            