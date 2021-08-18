<template>
  <div class="calendar">
    <div class="calendar__header md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label for="month">Month</label>
          <md-select v-model="selectedMonthName" name="month" id="month">
            <md-option v-for="month in monthList" :key="month" :value="month"> 
              {{month}}
            </md-option>
          </md-select>
        </md-field>
      </div>
      <div class="md-layout-item">
        <md-field>
          <label for="year">Year</label>
          <md-input v-model="year" type="number" id="year"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item">
        <h2> {{selectedMonthName}} {{currentYear}} </h2>
      </div>
    </div>
    <div class="calendar__body">
      <CalendarUI :month="month" :year="year" />
    </div>
    
  </div>
</template>

<script>
import { months } from '../constants/calendarOptions';
import CalendarUI from './CalendarUI.vue';

export default {
  name: 'Calendar',
  components: {
    CalendarUI
  },
  data() {
    return {
      selectedMonthName: '',
      year: null,
      month: null,
      monthList: months,
      currentDay: new Date()
    }
  },
  computed: {
    currentMonthName() {
      return this.monthList[this.currentDay.getMonth()-1];
    },
    currentYear() {
      return this.currentDay.getFullYear();
    }
  },
  created() {
    this.selectedMonthName = this.currentMonthName;
    this.month = this.currentDay.getMonth();
    this.year = this.currentDay.getFullYear();
  }
}
</script>

<style lang="scss" scoped>
  @import './scss/_calendar.scss';
</style>
