import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'progress-date',
  templateUrl: './progress-date.component.html',
  styleUrls: ['./progress-date.component.scss'],
})
export class ProgressDateComponent implements OnInit {
  @Input() start?: any;
  @Input() end?: any;
  timePoint1Hour: number = 9;
  timePoint1Minute: number = 22;
  timePoint2Hour: number = 14;
  currentHour: number = new Date().getHours();
  startTime = 8;
  endTime = 17;

  ngOnInit() {}

  startProgress(dateTime: number) {
    if (!dateTime) {
      return 0;
    }
    const hourString = dateTime.toString();
    const hour = parseFloat(hourString.substr(8, 2));
    const minute = parseFloat(hourString.substr(10, 2));
    const startTime = 8;
    const endTime = 17;
    const totalHours = endTime - startTime;
    const totalMinutes = totalHours * 60;
    const currentTime = hour * 60 + minute;
    const progress = (currentTime - startTime * 60) / totalMinutes;
    const result = progress * 100;
    if (result > 100) {
      return 100;
    } else if (result < 0) {
      return 0;
    }
    return result ? result.toFixed(2) : 0;
  }
  formatDate(date: number) {
    if (!date) return '';
    const dateTimeString = date.toString();
    const hour = dateTimeString.substr(8, 2);
    const minute = dateTimeString.substr(10, 2);
    return `${hour}:${minute}`;
  }
}
