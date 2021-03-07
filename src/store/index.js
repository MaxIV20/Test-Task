import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tempCel: true,
    tempCelVal: 0,
    tempFor: false,
    tempForVal: 0,
    weatherData: {
      temp: "0",
      location: "Неизвестно",
      url: `http://openweathermap.org/img/wn/02d@4x.png`,
      title: "Неизвестно",
      latitude: 45.0328,
      longitude: 38.9769,
      pressure: 0,
      wind: 0,
      windDirection: "",
      humidity: 0,
    },
  },
  mutations: {
    changeTempCel(state) {
      state.weatherData.temp = state.tempCelVal;
      state.tempCel = true;
      state.tempFor = false;
    },
    changeTempFor(state) {
      state.weatherData.temp = state.tempForVal;
      state.tempCel = false;
      state.tempFor = true;
    },

    // запись текущих координат
    getCoords(state, result) {
      state.weatherData.latitude = result.coords.latitude;
      state.weatherData.longitude = result.coords.longitude;
    },

    // заполнение погодных даннных
    getWeatherInfo(state, update) {
      state.tempCelVal = Math.trunc(update.main.temp);
      state.tempForVal = Math.trunc(state.tempCelVal * 1.8 + 32);

      if (state.tempCel) {
        state.weatherData.temp = state.tempCelVal;
      } else {
        state.weatherData.temp = state.tempForVal;
      }

      state.weatherData.location = update.name;
      state.weatherData.title = update.weather[0].description;
      state.weatherData.pressure = update.main.pressure;
      state.weatherData.humidity = update.main.humidity;
      state.weatherData.wind = Math.ceil(update.wind.speed);
      state.weatherData.url = `http://openweathermap.org/img/wn/${update.weather[0].icon}@4x.png`;

      let windDirection = update.wind.deg;

      if (windDirection <= 44 || windDirection == 360) {
        state.weatherData.windDirection = "северный";
      } else if ((windDirection >= 45) & (windDirection <= 89)) {
        state.weatherData.windDirection = "северо-восточный";
      } else if ((windDirection >= 90) & (windDirection <= 134)) {
        state.weatherData.windDirection = "восточный";
      } else if ((windDirection >= 135) & (windDirection <= 179)) {
        state.weatherData.windDirection = "юго-восточный";
      } else if ((windDirection >= 180) & (windDirection <= 224)) {
        state.weatherData.windDirection = "южный";
      } else if ((windDirection >= 225) & (windDirection <= 269)) {
        state.weatherData.windDirection = "юго-западный";
      } else if ((windDirection >= 270) & (windDirection <= 314)) {
        state.weatherData.windDirection = "западный";
      } else if ((windDirection >= 315) & (windDirection <= 359)) {
        state.weatherData.windDirection = "северо-западный";
      }
    },
  },
});
