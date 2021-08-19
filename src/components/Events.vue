<template>
  <div class="events">
    <h3>{{eventsTitle}}</h3>
    <div class="events__field">  
      <md-field>
        <label for="description">Event description</label>
        <md-input name="description" id="description" v-model="newEvent.description" />
      </md-field>
    </div>

    <div class="events__field">
      <md-autocomplete v-model="newEvent.city" 
        :md-options="cityWeatherOption"
        @md-changed="fetchWeatherByCity">
          <label for="city">City</label>
          <template slot="md-autocomplete-item" slot-scope="{ item }">{{ item }}</template>
      </md-autocomplete>
    </div>

    <md-card v-if="weatherInfo.main">
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">
            {{setCentigradeFormat(weatherInfo.main.temp)}} &#8451;
            {{weatherInfo.sub.description}}
          </div>
          <div class="md-subhead">
            Feels like {{setCentigradeFormat(weatherInfo.main.feels_like)}} &#8451; &nbsp;
          </div>
        </md-card-header-text>
        <md-card-media>
          <img :src="weatherIconRoute" alt="People">
        </md-card-media>
      </md-card-header>  
    </md-card>

    <div class="events__field">  
      <label for="description">Date time</label>
      <DateTimePicker name="date-time" id="date-time" v-model="newEvent.dateTime" :is-date-only="false" />
    </div>

    <div class="events__field">
      <Compact v-model="colors" @input="pickEventColor" />
    </div>
    <md-button class="md-primary md-raised" @click="saveEvent">Save Event</md-button>
    
  </div>
</template>

<script>
import { months, daysOfWeek } from '../constants/calendarOptions';
import DateTimePicker from 'vue-material-date-time-picker';
import { mapActions, mapGetters } from 'vuex';
import { Compact } from 'vue-color';


export default {
  name: 'Events',
  components: {
    DateTimePicker,
    Compact
  },
  data() {
    return {
      newEvent: {},
      colors: '#000',
      weatherInfo: {}
    }
  },
  computed: {
    ...mapGetters([
      'selectedDay',
      'getCityWeather'
    ]),
    cityWeatherOption(){
      if (!this.getCityWeather.name) return ['Searching...'];
      return [this.getCityWeather.name];
    },
    weatherIconRoute(){
      return `http://openweathermap.org/img/w/${this.weatherInfo.sub.icon}.png`
    },
    eventsTitle() {
      if(this.selectedDay === undefined) {
        return '';
      }
      return `${daysOfWeek[this.selectedDay.weekDay]}
        - ${months[this.selectedDay.month-1]} ${this.selectedDay.actualDateNumber} Reminders`
    }
  },
  methods: {
    ...mapActions([
      'selectDay',
      'fetchWeatherByCity'
    ]),
    pickEventColor(color) {
      this.newEvent.color = color.hex;
    },
    saveEvent() {

    },
    setCentigradeFormat(temp){
      const roundTemp = Math.round(temp);
      return roundTemp.toString();
    }
  },
  watch: {
    getCityWeather(newVal) {
      this.weatherInfo.main = newVal.main;
      if(newVal.weather) {
        this.weatherInfo.sub = newVal.weather[0];
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import './scss/_events.scss';
</style>