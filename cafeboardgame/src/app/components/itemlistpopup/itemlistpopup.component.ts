import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/menu/menuservice.service';
import { ItemlistpopupService } from '../../services/itemlistpopup/itemlistpopup.service';

@Component({
  selector: 'app-itemlistpopup',
  templateUrl: './itemlistpopup.component.html',
  styleUrls: ['./itemlistpopup.component.css']
})
export class ItemlistpopupComponent {
  @Input() coffeemenuID?: string;
  @Output() close = new EventEmitter<void>();
  updateorderForm! : FormGroup
  BeveragemenuForm!: FormGroup;
  coffeemenuData: any;

  constructor(
    private apiService: ApiService,
    private itemlistpopupService: ItemlistpopupService,
    private fb: FormBuilder,
  ){}

  ngOnInit(): void {
    this.updateorderForm = this.fb.group({
      name: [''],
      tallcupprice: [null],
      grandecupprice: [null],
      venticupprice: [null],
      hot: [false],
      iced: [false],
      frappe: [false],
      photo: [''],
      status: ['status'],
      create_at: [new Date()],
    });
    this.loadCoffeemenuByID()

  }

  loadCoffeemenuByID() {
    if (this.coffeemenuID) {
      this.itemlistpopupService.getCoffeemenuByID(this.coffeemenuID).subscribe((data) => {
        console.log('Coffeemenu data received:', data); // ตรวจสอบข้อมูลที่ได้รับ
        const coffeeTypes = {
          hot: !!data.hot, // แปลงค่าเป็น boolean
          iced: !!data.iced, // แปลงค่าเป็น boolean
          frappe: !!data.frappe // แปลงค่าเป็น boolean
        };

        

        this.coffeemenuData = data
        if (data) {
          // แสดงข้อมูลในฟอร์ม
          this.updateorderForm.patchValue({
            name: data.name,
            tallcupprice: data.s_price,  
            grandecupprice: data.m_price,  
            venticupprice: data.l_price,  
            hot: data.type_coffee.includes('HOT'),
            iced: data.type_coffee.includes('ICED'),
            frappe: data.type_coffee.includes('FRAPPE'),
            // photo: data.photo,
            // photoUrl: data.photoUrl,
            create_at: data.create_at,
            status: data.status === 'regular' ? 'true' : 'false',
          });
        }
        console.log('Form data received:', this.coffeemenuData); // ตรวจสอบข้อมูลที่ได้รับ
      });
    }
  }

  closePopup() {
    this.close.emit();
  }
}
