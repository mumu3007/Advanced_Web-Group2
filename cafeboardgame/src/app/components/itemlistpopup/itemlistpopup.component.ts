import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/menu/menuservice.service';
import { ItemlistpopupService } from '../../services/itemlistpopup/itemlistpopup.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-itemlistpopup',
  templateUrl: './itemlistpopup.component.html',
  styleUrls: ['./itemlistpopup.component.css']
})
export class ItemlistpopupComponent {
  @Input() coffeemenuID?: string;
  @Output() close = new EventEmitter<void>();
  updateorderForm! : FormGroup
  coffeemenuData: any;
  selectedFile?: File | null = null;

  constructor(
    private apiService: ApiService,
    private itemlistpopupService: ItemlistpopupService,
    private fb: FormBuilder,
    private messageService: MessageService // Inject MessageService
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


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    console.log('Selected File:', file);
    if (file && this.isValidFile(file)) {
      this.selectedFile = file;
      console.log('Selected File:', this.selectedFile);
      this.updateorderForm.patchValue({ photo: file });
    } else {
      console.error('Invalid file selected.');
    }
  }

  // ตรวจสอบประเภทและขนาดของไฟล์
  isValidFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  }

  loadCoffeemenuByID() {
    if (this.coffeemenuID) {
      this.itemlistpopupService.getCoffeemenuByID(this.coffeemenuID).subscribe((data) => {
        console.log('Coffeemenu data received:', data); // ตรวจสอบข้อมูลที่ได้รับ
        const coffeeTypesArray = data.type_coffee ? data.type_coffee[0].split(',') : [];
        
        this.coffeemenuData = data
        if (data) {
          // แสดงข้อมูลในฟอร์ม
          this.updateorderForm.patchValue({
            name: data.name,
            tallcupprice: data.s_price,  
            grandecupprice: data.m_price,  
            venticupprice: data.l_price,  
            hot: coffeeTypesArray.includes('HOT'), // ตรวจสอบว่ามี HOT หรือไม่
            iced: coffeeTypesArray.includes('ICED'), // ตรวจสอบว่ามี ICED หรือไม่
            frappe: coffeeTypesArray.includes('FRAPPE'), // ตรวจสอบว่ามี FRAPPE หรือไม่ // ใช้ค่าจาก coffeeTypes
            create_at: data.create_at,
            status: data.status
          });

        }
        console.log('Form data received:', this.coffeemenuData); // ตรวจสอบข้อมูลที่ได้รับ
      });
    }
  }

  updateCoffeemenu() {
    if (this.updateorderForm.valid && this.coffeemenuID) {
      const formData = new FormData();
      const coffeeTypes = ['hot', 'iced', 'frappe']
      .filter(type => this.updateorderForm.get(type)?.value) // ตรวจสอบว่าเลือกประเภทไหนบ้าง
      .map(type => type.toUpperCase()); // แปลงให้เป็นตัวใหญ่

      formData.append('name', this.updateorderForm.get('name')?.value);
      formData.append('s_price', this.updateorderForm.get('tallcupprice')?.value);
      formData.append('m_price', this.updateorderForm.get('grandecupprice')?.value);
      formData.append('l_price', this.updateorderForm.get('venticupprice')?.value);
      formData.append('type_coffee', coffeeTypes.join(','));
      formData.append('status', this.updateorderForm.get('status')?.value.toString());
      formData.append('create_at', this.updateorderForm.get('create_at')?.value);
    
  
      // ถ้ามีรูปภาพใหม่ ให้เพิ่มรูปภาพลงใน FormData
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile, this.selectedFile.name);
        console.log('FormData with photo:', formData);
      }else {
        console.log('No photo selected');
      }
  
      // เรียกใช้ service สำหรับอัปเดตข้อมูล
      this.itemlistpopupService.updateCoffeemenu(this.coffeemenuID, formData)
        .subscribe(
          (response) => {
            console.log('Cake updated:', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Update menu successful!',
            });
            this.closePopup(); // ปิด popup หลังจากอัปเดตเสร็จ
          },
          
          (error) => {
            console.error('Error updating boardgame:', error);
          }
        );
    } else {
      console.log('Form is not valid');
    }
  }

  closePopup() {
    this.close.emit();
  }


}
