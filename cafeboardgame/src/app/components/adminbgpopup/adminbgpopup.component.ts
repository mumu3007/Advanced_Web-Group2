import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminbgpopupService } from '../../services/adminbgpopup/adminbgpopup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoardgameserviceService } from '../../services/boardgame/boardgameservice.service';

@Component({
  selector: 'app-adminbgpopup',
  templateUrl: './adminbgpopup.component.html',
  styleUrl: './adminbgpopup.component.css'
})
export class AdminbgpopupComponent implements OnInit  {
  @Input() boardgameID?: string;
  @Output() close = new EventEmitter<void>();
  boardgameForm!: FormGroup;
  boardgameData: any;
  typeItems: any[] = [];
  selectedFile?: File | null = null;

  
  constructor(
    private adminboardgameService: AdminbgpopupService,
    private boardgameService: BoardgameserviceService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.boardgameForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      quantity: [null, Validators.required],
      price: [null, Validators.required],
      photo: [],
      create_at: [new Date()],
      status: [null, Validators.required],
      type: [''],
    });
    this.loadBoardgameByID();
    this.loadBoardgameTypeItem();

  }

  closePopup() {
    this.close.emit();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    console.log('Selected File:', file);
    if (file && this.isValidFile(file)) {
      this.selectedFile = file;
      console.log('Selected File:', this.selectedFile);
      this.boardgameForm.patchValue({ photo: file });
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

  loadBoardgameByID() {
    if (this.boardgameID) {
      this.adminboardgameService.getBoardgameByID(this.boardgameID).subscribe((data) => {
        console.log('Boardgame data received:', data); // ตรวจสอบข้อมูลที่ได้รับ
        this.boardgameData = data
        if (data) {
          // แสดงข้อมูลเก่าของ Boardgame ในฟอร์ม
          this.boardgameForm.patchValue({
            name: data.name,
            description: data.description,
            quantity: data.quantity,
            price: data.price,
            photo: data.photo,
            photoUrl: data.photoUrl,
            create_at: data.create_at,
            status: data.status,
            type: data.type,
          });
        }
        console.log('Form data received:', this.boardgameData); // ตรวจสอบข้อมูลที่ได้รับ
      });
    }
  }
  loadBoardgameTypeItem(){
    this.boardgameService.getBoardgameType().subscribe(
      (data) => {
        this.typeItems = data
      }
    )
  }

  updateBoardgame() {
    if (this.boardgameForm.valid && this.boardgameID) {
      const formData = new FormData();

       // แปลงฟอร์มทั้งหมดเป็น JSON string และเพิ่มลงใน FormData --> ยังไม่สามารถอัพเดตstatusได้ ถ้าใช้Boolean 
    const formValues = JSON.stringify(this.boardgameForm.value);
    formData.append('formValues', formValues);
  
      // ถ้ามีรูปภาพใหม่ ให้เพิ่มรูปภาพลงใน FormData
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile, this.selectedFile.name);
        console.log(formData)
      }
  
      // เรียกใช้ service สำหรับอัปเดตข้อมูล
      this.adminboardgameService.updateBoardgame(this.boardgameID, formData)
        .subscribe(
          (response) => {
            console.log('Boardgame updated:', response);
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
  
}
