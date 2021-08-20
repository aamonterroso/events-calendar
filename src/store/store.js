import Vue from 'vue'
import Vuex from 'vuex'
import { getWeatherByCityName } from '../utils/dataService';

Vue.use(Vuex);

const state = {
  selectedDay: {},
  selectedYear: 0,
  selectedMonth: 0,
  selectedEvent: {},
  calendarDays: [],
  cityWeather: {}
};

const mutations = {
  SET_SELECTED_DAY(state, day) {
    state.selectedDay = day
  },
  SET_SELECTED_YEAR(state, year) {
    state.selectedYear = year
  },
  SET_SELECTED_MONTH(state, month) {
    state.selectedMonth = month
  },
  SET_SELECTED_EVENT(state, event) {
    state.selectedEvent = event;
  },
  SET_CITY_WEATHER(state, weather) {
    state.cityWeather = weather;
  },
  ADD_EVENT(state, event) {
    state.selectedDay.events.push(event);
  },
  EDIT_EVENT(state, payload) {
    const { event, id, date, isDelete, isDeleteAll } = payload;
    const pos = state.calendarDays
      .findIndex(day => convertDateString(day.date) === convertDateString(date.date));
    if(pos >= 0){
      if (isDelete) {
        state.calendarDays[pos].events.splice(id, 1);
      } else if (isDeleteAll) {
        const end = state.calendarDays[pos].events.length;
        state.calendarDays[pos].events.splice(0, end);
      } else {
        state.calendarDays[pos].events.splice(id, 1, event);
      }
    }
  },
  ADD_CALENDAR_DAY(state, day) {
    state.calendarDays.push(day);
  },
  ADD_CALENDAR_EVENT(state, event) {
    const pos = state.calendarDays
      .findIndex(day => convertDateString(day.date) === convertDateString(event.dateTime));
    if(pos >= 0) {
      state.calendarDays[pos].events.push(event);
    }
  },
  CLEAR_CALENDAR_DAYS(state) {
    state.calendarDays = [];
  },
};

const actions = {
  selectDay({ commit }, day) {
    commit('SET_SELECTED_DAY', day);
  },
  selectMonth({ commit }, month) {
    commit('SET_SELECTED_MONTH', month);
  },
  selectYear({ commit }, year) {
    commit('SET_SELECTED_YEAR', year);
  },
  addCalendarDay({ commit }, day) {
    commit('ADD_CALENDAR_DAY', day);
  },
  clearCalendarDays({ commit }) {
    commit('CLEAR_CALENDAR_DAYS');
  },
  async fetchWeatherByCity({ commit }, city) {
    if(city.length <= 3) return;
    commit('SET_CITY_WEATHER', await getWeatherByCityName(city));
  },
  createEvent({ commit }, event) {
    if(event){
      commit('ADD_CALENDAR_EVENT', event);
    }
  },
  editEvent({ commit }, {id, event, date, isDelete, isDeleteAll}) {
    commit('EDIT_EVENT', {id, event, date, isDelete, isDeleteAll});
  },
};

const getters = {
  getSelectedDay: state => state.selectedDay,
  getSelectedYear: state => state.selectedYear,
  getSelectedMonth: state => state.selectedMonth,
  getCityWeather: state => state.cityWeather,
  getCalendarDays: state => state.calendarDays,
  getSelectedDayEvents: state => state.selectedDay.events
};

// Utilities //
const convertDateString = (date) => {
  let dt = date;
  return new Date(dt.setHours(0,0,0,0)).toString();
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});

