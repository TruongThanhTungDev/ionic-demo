import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'datepicker-component',
  templateUrl: './datepicker.component.html',
})
export class DatePickerComponent {
  @Output() filterDate = new EventEmitter<any>();
}
