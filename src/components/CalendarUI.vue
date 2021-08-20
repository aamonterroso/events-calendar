<template>
  <div class="calendar-ui">
    <div class="calendar-ui__header">
      <div class="calendar-ui__day-name " v-for="dayName in weekDays" :key="dayName">
        <p> {{dayName}} </p>
      </div>
    </div>
    <div class="calendar-ui__main-content">
      <div class="calendar-ui__datebox"
        v-for="(date, index) in getCalendarDays" :key="date.actualDateNumber+`-${index}`"
        v-on:click="assignDay(date)"
        :class="{
          'calendar-ui__datebox--disabled': !date.isCurrentMonth,
          'calendar-ui__datebox--selected': date === getSelectedDay
        }"
      >
        {{date.actualDateNumber}}
        <div v-if="!isCompressedView(date.events)" >
          <div v-for="(event, index) in date.events" :key="index">
            <md-chip :style="'background-color:'+event.color"
              @md-delete="deleteEvent(index, date)"
              @click="handleEdit(index, event)"
              md-deletable 
              md-clickable
            >
              {{formatDescription(event.description)}}
            </md-chip>
          </div>
        </div>
        <md-chip v-else class="md-accent calendar-ui__compressed-events" md-clickable>{{date.events.length}} reminders</md-chip>

      </div>
    </div>
  </div>
</template>

<script>
import { daysOfWeek, totalCalendarDays } from "../constants/calendarOptions";
import { mapActions, mapGetters } from 'vuex';
import { EventBus } from '../main';

export default {
  name: 'CalendarUI',
  props: {
  },
  data() {
    return {
      weekDays: daysOfWeek,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters([
      'getSelectedYear',
      'getSelectedMonth',
      'getSelectedDay',
      'getCalendarDays'
    ]),
    firstMonthDayDate() {
      return new Date(this.getSelectedYear, this.getSelectedMonth, 1);
    },
    firstMonthDayNumber() {
      return this.firstMonthDayDate.getDay();
    }
  },
  created () {
    this.selectDay(this.buildCalendarDay(new Date()));
    this.clearCalendarDays();
    this.generateCalendarDays();
    //listening for calendar rebuild
    EventBus.$on('rebuildCalendar', () => {
      this.clearCalendarDays();
      this.generateCalendarDays();
    });
  },
  methods: {
    ...mapActions([
      'selectDay',
      'addCalendarDay',
      'clearCalendarDays',
      'editEvent'
    ]),
    assignDay(date) {
      if(date.month !== this.getSelectedMonth) return;
      this.selectDay(date);
    },
    generateCalendarDays() {
      let firstDayOfMonthN = this.firstMonthDayDate;

      for(let calendarDay = 0; calendarDay < totalCalendarDays; calendarDay++){
        if(this.firstMonthDayNumber === 0 && calendarDay === 0) {
          firstDayOfMonthN.setDate(firstDayOfMonthN.getDate() - 7);
        } else if (calendarDay === 0) {
          firstDayOfMonthN.setDate(firstDayOfMonthN.getDate() + (calendarDay - this.firstMonthDayNumber));
        } else {
          firstDayOfMonthN.setDate(firstDayOfMonthN.getDate() + 1);
        }
        const day = this.buildCalendarDay(firstDayOfMonthN);
        this.addCalendarDay(day);
      }
    },
    buildCalendarDay(date) {
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        actualDateNumber: date.getDate(),
        date: (new Date(date)),
        weekDay: date.getDay(),
        isCurrentMonth: (date.getMonth() === this.getSelectedMonth),
        events: []
      }
    },
    isCompressedView(events) {
      return events.length > 2;
    },
    formatDescription(desc){
      return desc.length > 8 ? desc.substring(0,8)+'...' : desc;
    },
    deleteEvent(id){
      this.isDeleting = true;
      const payload = {
        event: {},
        date: this.getSelectedDay,
        id: id,
        isDelete: true
      };
      
      this.editEvent(payload);
      this.isDeleting = false;
    },
    handleEdit(id, event, target){
      if(this.isDeleting) return;
      const evt = {id, event, target};
      EventBus.$emit('editEvent', evt);
    }
  },
}
</script>

<style lang="scss" scoped>
@import './scss/_calendar-ui.scss';
</style>