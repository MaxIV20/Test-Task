<template>
  <div class="widget" @click="closeSearch">
    <div class="widget__header">
      <div class="search-container" v-if="showSearch">
        <input
          type="text"
          class="widget__search"
          v-model="search"
          @keydown="foundCity"
        />
        <button class="widget__apply-location" @click="foundCity">
          ок
        </button>
        <div class="search-list-container" @click="founDefaultCity">
          <div
            class="search-list__item"
            v-for="item in Cities"
            :key="item.name"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="location-info" v-else>
        <div class="location-info__city-title">
          {{ weatherData.location }}
        </div>
        <div class="change-location-container">
          <button class="change-location" @click.stop="selectLocation">
            Сменить город
          </button>
          <button class="my-location" @click="getLocationWeather">
            <svg
              class="my-location__icon"
              width="18"
              height="21"
              viewBox="0 0 18 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.489 0.838191L0.238948 11.6268L8.72799 13.2769L13.2146 20.7637L17.489 0.838191Z"
                fill="white"
              />
            </svg>
            <span class="my-location__text">
              Мое местоположение
            </span>
          </button>
        </div>
      </div>
      <div class="temp-container" @click="changeTemp">
        <div :class="['temp-cel', { 'temp-item_active': tempCel }]">
          <svg
            class="temp-cel__icon"
            width="7"
            height="7"
            viewBox="0 0 7 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.398494"
              d="M3.636 0.959014C4.056 0.959014 4.434 1.02501 4.77 1.15701C5.112 1.28302 5.403 1.46601 5.643 1.70601C5.883 1.94601 6.069 2.24001 6.201 2.58802C6.333 2.93001 6.399 3.31401 6.399 3.74001C6.399 4.17201 6.333 4.56201 6.201 4.91002C6.069 5.25802 5.883 5.55501 5.643 5.80101C5.403 6.04101 5.112 6.22701 4.77 6.35901C4.434 6.48501 4.056 6.54801 3.636 6.54801C3.21 6.54801 2.826 6.48501 2.484 6.35901C2.142 6.22701 1.848 6.04101 1.602 5.80101C1.362 5.55501 1.176 5.25802 1.044 4.91002C0.912 4.56201 0.846 4.17201 0.846 3.74001C0.846 3.31401 0.912 2.93001 1.044 2.58802C1.176 2.24001 1.362 1.94601 1.602 1.70601C1.848 1.46601 2.142 1.28302 2.484 1.15701C2.826 1.02501 3.21 0.959014 3.636 0.959014ZM3.636 5.59402C4.14 5.59402 4.515 5.43801 4.761 5.12601C5.013 4.80801 5.139 4.34901 5.139 3.74901C5.139 3.14901 5.013 2.69301 4.761 2.38102C4.515 2.06901 4.14 1.91301 3.636 1.91301C3.108 1.91301 2.721 2.06901 2.475 2.38102C2.229 2.69301 2.106 3.14901 2.106 3.74901C2.106 4.34901 2.229 4.80801 2.475 5.12601C2.721 5.43801 3.108 5.59402 3.636 5.59402Z"
              fill="white"
            />
          </svg>
          c
        </div>
        <div :class="['temp-foren', { 'temp-item_active': tempFor }]">f</div>
      </div>
    </div>
    <div class="weather-info">
      <div class="weather-info-row">
        <img
          class="weather-info__icon"
          :src="weatherData.url"
          alt="weather icon"
        />
        <div class="weather-info__temp">
          {{ weatherData.temp }}
        </div>
        <span class="cel-temp" v-if="tempCel">o</span>
      </div>
      <div class="weather-info__title">
        {{ weatherData.title }}
      </div>
    </div>
    <div class="widget__subinfo">
      <div class="subinfo-item" v-for="item in getSubitem()" :key="item.id">
        <div class="subinfo-item__title">
          {{ item.title }}
        </div>
        <div class="subinfo-item__value">
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cities from "@/jsons/city-list.json";
import axios from "axios";

export default {
  name: "WeatherWidget",
  data() {
    return {
      showSearch: false,
      search: "",
      Cities,
      test: "fsdfsdfds",
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
    };
  },
  methods: {
    changeTemp(ev) {
      let item = ev.target;
      if (item.classList.contains("temp-cel")) {
        this.weatherData.temp = this.tempCelVal;
        this.tempCel = true;
        this.tempFor = false;
      } else if (item.classList.contains("temp-foren")) {
        this.weatherData.temp = this.tempForVal;
        this.tempCel = false;
        this.tempFor = true;
      } else return;
    },

    getSubitem() {
      return [
        {
          id: 1,
          title: "Ветер",
          value: `${this.weatherData.wind} м/c, ${this.weatherData.windDirection}`,
        },
        {
          id: 2,
          title: "Давление",
          value: `${Math.trunc(this.weatherData.pressure * 0.75)} мм рт. ст.`,
        },
        {
          id: 3,
          title: "Влажность",
          value: `${this.weatherData.humidity}%`,
        },
        {
          id: 4,
          title: "Вероятность дождя",
          value: "50%", // Api не даёт инфы по этому параметру
        },
      ];
    },

    selectLocation() {
      this.showSearch = !this.showSearch;
    },

    closeSearch(ev) {
      if (!this.showSearch) return;

      let item = ev.target;

      if (item.closest(".search-container")) return;
      this.selectLocation();
    },

    getWeatherInfo(update) {
      this.tempCelVal = Math.trunc(update.main.temp);
      this.tempForVal = Math.trunc(this.tempCelVal * 1.8 + 32);

      if (this.tempCel) {
        this.weatherData.temp = this.tempCelVal;
      } else {
        this.weatherData.temp = this.tempForVal;
      }

      this.weatherData.location = update.name;
      this.weatherData.title = update.weather[0].description;
      this.weatherData.pressure = update.main.pressure;
      this.weatherData.humidity = update.main.humidity;
      this.weatherData.wind = Math.ceil(update.wind.speed);
      this.weatherData.url = `http://openweathermap.org/img/wn/${update.weather[0].icon}@4x.png`;

      let windDirection = update.wind.deg;

      if (windDirection <= 44 || windDirection == 360) {
        this.weatherData.windDirection = "северный";
      } else if ((windDirection >= 45) & (windDirection <= 89)) {
        this.weatherData.windDirection = "северо-восточный";
      } else if ((windDirection >= 90) & (windDirection <= 134)) {
        this.weatherData.windDirection = "восточный";
      } else if ((windDirection >= 135) & (windDirection <= 179)) {
        this.weatherData.windDirection = "юго-восточный";
      } else if ((windDirection >= 180) & (windDirection <= 224)) {
        this.weatherData.windDirection = "южный";
      } else if ((windDirection >= 225) & (windDirection <= 269)) {
        this.weatherData.windDirection = "юго-западный";
      } else if ((windDirection >= 270) & (windDirection <= 314)) {
        this.weatherData.windDirection = "западный";
      } else if ((windDirection >= 315) & (windDirection <= 359)) {
        this.weatherData.windDirection = "северо-западный";
      }
    },

    foundCity(ev) {
      if ((ev.type == "keydown") & (ev.code != "Enter")) return;
      this.selectLocation();

      axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?q=${this.search}&appid=cc89ddbc2c29f2feea66c166069723a0&lang=ru&units=metric`
        )
        .then(
          (result) => {
            let update = result.data;
            this.getWeatherInfo(update);
          },
          () => {
            alert("Нет информации по такому городу");
          }
        );
    },

    founDefaultCity(ev) {
      let selectItem = ev.target;
      if (!selectItem.matches(".search-list__item")) return;

      this.search = selectItem.textContent.trim();
      this.selectLocation();

      axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?q=${this.search}&appid=cc89ddbc2c29f2feea66c166069723a0&lang=ru&units=metric`
        )
        .then((result) => {
          let update = result.data;
          this.getWeatherInfo(update);
        });
    },

    getLocationWeather() {
      //   let coords = navigator.geolocation.getCurrentPosition((result) => {
      //   this.weatherData.latitude = result.coords.latitude;
      //   this.weatherData.longitude = result.coords.longitude;
      // })
      // Чтобы работало определение координат нужен https, иначе браузер не даёт их определить
      axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?lat=${this.weatherData.latitude}&lon=${this.weatherData.longitude}&appid=cc89ddbc2c29f2feea66c166069723a0&lang=ru&units=metric`
        )
        .then((result) => {
          let update = result.data;
          this.getWeatherInfo(update);
        });
    },
  },
  created() {
    this.getLocationWeather();
  },
};
</script>

<style scoped lang="scss">
.widget {
  display: flex;
  flex-direction: column;
  width: 1366px;
  height: 1024px;
  padding: 75px 75px 120px 100px;
  background: #498cec;
  border: 1px solid #979797;
  border-radius: 25px;
}

.widget__header {
  display: flex;
  justify-content: space-between;
  height: 97px;
}

.search-container {
  position: relative;
  display: flex;
}

.search-list-container {
  position: absolute;
  top: 101px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 168px;
  background: white;
  overflow: hidden scroll;
  border-radius: 16px;
}

.search-list__item {
  display: flex;
  padding: 10px 15px;
  font-size: 30px;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    background: rgb(228, 228, 228);
  }
}

.widget__search {
  width: 579px;
  height: 97px;
  padding: 0 100px 0 30px;
  background: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  font-size: 30px;
  line-height: 36px;
  color: #000000;
}

.widget__apply-location {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100px;
  height: 100%;
  padding-right: 30px;
  font-size: 30px;
  line-height: 36px;
  color: #1086ff;
  text-transform: uppercase;
  cursor: pointer;
}

.location-info {
  display: flex;
  flex-direction: column;
}

.location-info__row {
  margin-bottom: 10px;
}

.location-info__city-title {
  margin-bottom: 10px;
  font-size: 50px;
  line-height: 60px;
  color: #ffffff;
}

.change-location-container {
  display: flex;
}

.change-location {
  margin-right: 30px;
  font-size: 18px;
  line-height: 22px;
  color: rgba(255, 255, 255, 0.6);
  transition: 0.2s;

  &:hover {
    color: rgba(255, 255, 255, 1);
  }
}

.my-location {
  display: flex;
  align-items: center;

  &:hover {
    .my-location__icon {
      opacity: 0.8;
    }

    .my-location__text {
      color: rgba(255, 255, 255, 1);
    }
  }
}

.my-location__icon {
  margin-right: 10px;
  opacity: 0.4;
  transition: 0.2s;
}

.my-location__text {
  font-size: 18px;
  line-height: 22px;
  color: rgba(255, 255, 255, 0.6);
  transition: 0.2s;
}

.temp-container {
  display: flex;
  width: 77px;
  height: 29px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
}

%temp-item-styles {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  font-size: 18px;
  line-height: 22px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.2s;
}

.temp-cel {
  @extend %temp-item-styles;
  position: relative;
  border-radius: 7px 0 0 7px;
}

.temp-cel__icon {
  position: absolute;
  top: 8px;
  left: -18px;
}

.temp-foren {
  @extend %temp-item-styles;
  position: relative;
  border-radius: 0 7px 7px 0;
}

.temp-item_active {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
}

.weather-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  padding-top: 160px;
}

.weather-info-row {
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: 335px; // паддинг для того, чтобы при переключении температуры иконка не прыгала по горизонтали
  margin-bottom: 10px;
}

.weather-info__icon {
  width: 200px;
  height: 200px;
}

.weather-info__temp {
  font-size: 180px;
  color: #ffffff;
}

.cel-temp {
  align-self: flex-start;
  font-size: 80px;
  color: #ffffff;
}

.weather-info__title {
  font-size: 25px;
  line-height: 30px;
  color: #ffffff;

  &:first-letter {
    text-transform: uppercase;
  }
}

.widget__subinfo {
  display: flex;
  width: 100%;
}

.subinfo-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 23%;

  &:first-child {
    width: 30%;
  }
}

.subinfo-item__title {
  margin-bottom: 10px;
  font-size: 18px;
  line-height: 22px;
  color: rgba(255, 255, 255, 0.6);
}

.subinfo-item__value {
  font-size: 25px;
  line-height: 30px;
  color: #ffffff;
}
</style>
