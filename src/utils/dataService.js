import axios from "axios";
const openWeatherKey = '5583c0f99386023fb34437c092fa144c';
// NOT IDEAL, API keys should be bundled in some ENV configuration like dotenv

// GET requests //
const getWeatherByCityName = (city) => {
  return axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${openWeatherKey}`)
    .then(response => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

// const toJson = (obj) => {
//   return JSON.stringify(obj);
// }

export {
  getWeatherByCityName
}