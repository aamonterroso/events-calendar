<template>
  <div class="events">
    <h3>{{eventsTitle}}</h3>
    <div class="events__field">  
      <md-field>
        <label for="description">Event description</label>
        <md-input name="description" id="description" 
          v-model="description" maxlength="30" required/>
        <span class="md-error">Description is required</span>
      </md-field>
    </div>

    <div class="events__field">
      <md-autocomplete v-model="city" 
        :md-options="cityWeatherOption"
        @md-changed="fetchWeatherByCity" required>
          <label for="city">City</label>
          <template slot="md-autocomplete-item" slot-scope="{ item }">{{ item }}</template>
          <span class="md-error">City is required</span>
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
      <label for="dateTime">Date time</label>
      <DateTimePicker name="dateTime" 
        id="dateTime" 
        v-model="getSelectedDay.date"
        :is-time-only="true" />
    </div>

    <div class="events__field">
      <label for="eventColor"> Event color tag </label>
      <Compact v-model="colors" @input="pickEventColor" id="eventColor"/>
    </div>
    <md-button v-if="isEditing && hasEvents" class="md-primary md-raised events__savebtn" 
      :class="{'events__savebtn--shrink': hasEvents}"
      @click="handleEdit"
    > 
      Edit Event
    </md-button>
    <md-button v-else class="md-primary md-raised events__savebtn" 
      @click="saveEvent"
      :disabled="!isValidEvent"
      :class="{'events__savebtn--shrink': hasEvents}"
    >
      Save Event
    </md-button>
      <md-button class="md-accent md-raised events__savebtn events__savebtn--shrink" 
        v-if="hasEvents" 
        @click="deleteAllEvents"
      >
        Delete all events
      </md-button>
  </div>
</template>

<script>
import { months, daysOfWeek } from '../constants/calendarOptions';
import DateTimePicker from 'vue-material-date-time-picker';
import { mapActions, mapGetters } from 'vuex';
import { Compact } from 'vue-color';
import { EventBus } from '../main';


export default {
  name: 'Events',
  components: {
    DateTimePicker,
    Compact
  },
  data() {
    return {
      description: '',
      city: '',
      dateTime: '',
      color: '',
      colors: '#000',
      weatherInfo: {},
      customDate: '',
      isEditing: false,
      editedId: 0,
      clickedEvent: false
    }
  },
  created () {
    EventBus.$on('editEvent', (evt) => {
      if(evt.event){
        this.description = evt.event.description;
        this.city = evt.event.city;
        this.dateTime = evt.event.dateTime;
        this.color = evt.event.color;
        this.isEditing = true;
        this.editedId = evt.id;
        this.clickedEvent = true;
      } else {
        this.isEditing = false;
      }
    });
  },
  computed: {
    ...mapGetters([
      'getSelectedDay',
      'getCityWeather'
    ]),
    cityWeatherOption(){
      if (!this.getCityWeather.name) return ['enter city name...'];
      return [this.getCityWeather.name];
    },
    weatherIconRoute(){
      return `http://openweathermap.org/img/w/${this.weatherInfo.sub.icon}.png`
    },
    eventsTitle() {
      if(this.getSelectedDay === undefined) {
        return '';
      }
      return `${daysOfWeek[this.getSelectedDay.weekDay]}
        - ${this.getSelectedDay.actualDateNumber} ${months[this.getSelectedDay.month]}  Reminders`
    },
    isValidEvent() { // not ideal, should integrate a validation library like Vuelidate 
      return (this.description && this.description.length > 0)
      && (this.getCityWeather.name && this.getCityWeather.name.length > 0)
      && (this.color && this.color.length > 0);
    },
    hasEvents() {
      return this.getSelectedDay.events.length>0;
    }
  },
  methods: {
    ...mapActions([
      'selectDay',
      'fetchWeatherByCity',
      'createEvent',
      'editEvent'
    ]),
    pickEventColor(color) {
      this.color = color.hex;
    },
    saveEvent() {
      this.dateTime = this.getSelectedDay.date;
      const event = this.buildEvent();
      this.createEvent(event);
    },
    setCentigradeFormat(temp){
      const roundTemp = Math.round(temp);
      return roundTemp.toString();
    },
    buildEvent(){
      return {
        description: this.description,
        city: this.city,
        dateTime: this.dateTime,
        color: this.color
      }
    },
    handleEdit(){
      const event = this.buildEvent();
      const payload = {
        event: event,
        date: this.getSelectedDay,
        id: this.editedId,
        isDelete: false
      };
      this.editEvent(payload);
      this.isEditing = false;
    },
    deleteAllEvents(){
      const payload = {
        date: this.getSelectedDay,
        isDeleteAll: true
      };
      this.editEvent(payload);
    }
  },
  watch: {
    getCityWeather(newVal) {
      this.weatherInfo.main = newVal.main;
      if(newVal.weather) {
        this.weatherInfo.sub = newVal.weather[0];
      }
    },
    getSelectedDay(newVal){
      if(newVal.events && newVal.events.length === 0) {
        this.isEditing = false;
      }
    }
  },
}
</script>

<style lang="scss">
@import './scss/_utils.scss';
@import './scss/_events.scss';
</style>