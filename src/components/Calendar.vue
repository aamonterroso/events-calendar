<template>
  <div class="calendar">
    <div class="calendar__header md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label for="month">Month</label>
          <md-select v-model="selectedMonthName" name="month" id="month" @input="changeMonth">
            <md-option v-for="month in monthList" :key="month" :value="month"> 
              {{month}}
            </md-option>
          </md-select>
        </md-field>
      </div>
      <div class="md-layout-item">
        <md-field>
          <label for="year">Year</label>
          <md-input v-model="year" type="number" :min="2021" id="year" @input="changeYear"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item">
        <h2> {{selectedMonthName}} {{currentYear}} </h2>
      </div>
    </div>
    <div class="calendar__ui-body">
      <CalendarUI />
    </div>
    <div class="calendar__events-body">
      <Events />
    </div>
  </div>
</template>

<script>
import { months } from '../constants/calendarOptions';
import CalendarUI from './CalendarUI.vue';
import Events from './Events.vue';
import { mapActions, mapGetters } from 'vuex';
import { EventBus } from '../main';

export default {
  name: 'Calendar',
  components: {
    CalendarUI,
    Events
  },
  data() {
    return {
      selectedMonthName: '',
      monthList: months,
      currentDay: new Date(),
      year: null,
      month: null,
    }
  },
  computed: {
    ...mapGetters([
      'getSelectedMonth',
      'getSelectedYear'
    ]),
    currentMonthName() {
      return this.monthList[this.currentDay.getMonth()];
    },
    currentYear() {
      return this.currentDay.getFullYear();
    }
  },
  created() {
    this.selectedMonthName = this.currentMonthName;
    this.selectMonth(this.currentDay.getMonth());
    this.selectYear(this.year = this.currentDay.getFullYear());
  },
  methods: {
    ...mapActions([
      'selectYear',
      'selectMonth'
    ]),
    changeYear(year){
      if(year.length === 4 && year >= new Date().getFullYear()){
        this.selectYear(year);
        EventBus.$emit('rebuildCalendar', true);
      } else {
        this.year = this.getSelectedYear;
      }
    },
    changeMonth(month){
      this.selectMonth(months.indexOf(month));
      EventBus.$emit('rebuildCalendar', true);
    }
  }
}
</script>

<style lang="scss">
  @import './scss/_global.scss';
  @import './scss/_utils.scss';
  @import './scss/_calendar.scss';
</style>
