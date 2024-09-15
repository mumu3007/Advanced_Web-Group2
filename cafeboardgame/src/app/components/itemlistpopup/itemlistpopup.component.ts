import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-itemlistpopup',
  templateUrl: './itemlistpopup.component.html',
  styleUrls: ['./itemlistpopup.component.css']
})
export class ItemlistpopupComponent {
  updateorderForm: FormGroup;
  @Output() close = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
  ) {
    this.updateorderForm = this.fb.group({
      name: [''],
      tallcupprice: [],
      grandecupprice: [],
      venticupprice: [],
      hot: [''],
      iced: [''],
      frappe: [''],
      upload: ['null'],
      status: ['status'],
    });
  }

  closePopup() {
    this.close.emit();
  }
}
