<template>
  <div class="calendar-ui">
    <div class="calendar-ui__header">
      <div class="calendar-ui__day-name " v-for="dayName in weekDays" :key="dayName">
        <p> {{dayName}} </p>
      </div>
    </div>
    <div class="calendar-ui__main-content">
      <div class="calendar-ui__datebox"
        :class="{
          'calendar-ui__datebox--disabled': !date.isCurrentMonth,
          'calendar-ui__datebox--selected': date === selectedDay
        }"
        v-for="date in calendarDaysList" :key="date.actualDateNumber+`-${date.month}`"
        v-on:click="assignDay(date)"
      >
        {{date.actualDateNumber}}
      </div>
    </div>
  </div>
</template>

<script>
import { daysOfWeek, totalCalendarDays } from "../constants/calendarOptions";
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'CalendarUI',
  props: {
    month: {
      type: Number,
      default: new Date().getMonth(),
      required: true
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
      required: true
    }
  },
  data() {
    return {
      weekDays: daysOfWeek,
      calendarDaysList: [],
      showDialog: false
    }
  },
  computed: {
    ...mapGetters([
      'selectedDay',
    ]),
    firstMonthDayDate() {
      return new Date(this.year, this.month, 1);
    },
    firstMonthDayNumber() {
      return this.firstMonthDayDate.getDay();
    }
  },
  created () {
    this.selectDay(this.buildCalendarDay(new Date()));
    this.generateCalendarDays();
  },
  methods: {
    ...mapActions([
      'selectDay',
    ]),
    assignDay(date) {
      this.selectDay(date);
    },
    generateCalendarDays() {
      let firstDayOfMonthN = this.firstMonthDayDate;
      for(let calendarDay = 0; calendarDay < totalCalendarDays; calendarDay++){
        if(this.firstMonthDayNumber === 0 && calendarDay === 0) {
          firstDayOfMonthN.setDate(firstDayOfMonthN.getDate() - 7);
        } else if (calendarDay === 0) {
          firstDayOfMonthN.setDate(firstDayOfMonthN.getDate() + (calendarDay - this.firstMonthDayDate));
        } else {
          firstDayOfMonthN.setDate(firstDayOfMonthN.getDate() + 1);
        }
        const day = this.buildCalendarDay(firstDayOfMonthN);
        this.calendarDaysList.push(day);
      }
    },
    buildCalendarDay(date) {
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        actualDateNumber: date.getDate(),
        date: (new Date(date)),
        weekDay: date.getDay(),
        isCurrentMonth: (date.getMonth() === this.month),
        isSelected: false,
        events: []
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import './scss/_calendar-ui.scss';
</style>