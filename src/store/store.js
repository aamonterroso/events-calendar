import Vue from 'vue'
import Vuex from 'vuex'
import { getWeatherByCityName } from '../utils/dataService';

Vue.use(Vuex);

const state = {
  selectedDay: {},
  selectedEvent: {},
  cityWeather: {},
  allEvents: []
};

const mutations = {
  SET_SELECTED_DAY(state, day) {
    state.selectedDay = day
  },
  SET_SELECTED_EVENT(state, event) {
    state.selectedEvent = event;
  },
  SET_CITY_WEATHER(state, weather) {
    state.cityWeather = weather;
  },
  ADD_EVENT(state, event) {
    state.allEvents.push(event);
  }
};

const actions = {
  selectDay({ commit }, day) {
    commit('SET_SELECTED_DAY', day);
  },
  async fetchWeatherByCity({ commit }, city) {
    if(city.length <= 3) return;
    commit('SET_CITY_WEATHER', await getWeatherByCityName(city));
  },
  createEvent({ commit }, event) {
    if(event){
      commit('ADD_EVENT', event);
    }
  }
};

const getters = {
  selectedDay: state => state.selectedDay,
  getCityWeather: state => state.cityWeather
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});

