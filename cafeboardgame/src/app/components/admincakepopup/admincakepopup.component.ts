import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../services/menu/menuservice.service';
import { ItemlistpopupService } from '../../services/itemlistpopup/itemlistpopup.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admincakepopup',
  templateUrl: './admincakepopup.component.html',
  styleUrls: ['./admincakepopup.component.css']
})
export class AdmincakepopupComponent {

  @Output() close = new EventEmitter<void>();
  updatecakeForm!: FormGroup;


  constructor(
    private apiService: ApiService,
    private itemlistpopupService: ItemlistpopupService,
    private fb: FormBuilder,
  ){}

  ngOnInit(): void {
    this.updatecakeForm = this.fb.group({
      name: [''],
      cakedescription: [''],
      cakeprice: [null],
      upload: [''],
      create_at: [new Date()],
    });
  }

  closePopup() {
    this.close.emit();
  }

}
