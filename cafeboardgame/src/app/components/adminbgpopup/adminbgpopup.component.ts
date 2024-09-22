import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminbgpopupService } from '../../services/adminbgpopup/adminbgpopup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoardgameserviceService } from '../../services/boardgame/boardgameservice.service';
import { MessageService } from 'primeng/api'; 

@Component({
  selector: 'app-adminbgpopup',
  templateUrl: './adminbgpopup.component.html',
  styleUrl: './adminbgpopup.component.css',
  providers: [MessageService] // Add MessageService provider

})
export class AdminbgpopupComponent implements OnInit  {
  @Input() boardgameID?: string;
  @Output() close = new EventEmitter<void>();
  boardgameForm!: FormGroup;
  boardgameData: any;
  typeItems: any[] = [];
  selectedFile?: File | null = null;
  message: string = '';

  
  constructor(
    private adminboardgameService: AdminbgpopupService,
    private boardgameService: BoardgameserviceService,
    private messageService: MessageService, // Inject MessageService
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

    formData.append('name', this.boardgameForm.get('name')?.value);
    formData.append('description', this.boardgameForm.get('description')?.value);
    formData.append('quantity', this.boardgameForm.get('quantity')?.value);
    formData.append('price', this.boardgameForm.get('price')?.value);
    formData.append('create_at', this.boardgameForm.get('create_at')?.value);
    formData.append('status', this.boardgameForm.get('status')?.value.toString());

    // เพิ่มประเภทบอร์ดเกม (type)
    formData.append('type', this.boardgameForm.get('type')?.value);
  
      // ถ้ามีรูปภาพใหม่ ให้เพิ่มรูปภาพลงใน FormData
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile, this.selectedFile.name);
        console.log('FormData with photo:', formData);
      }else {
        console.log('No photo selected');
      }
  
      // เรียกใช้ service สำหรับอัปเดตข้อมูล
      this.adminboardgameService.updateBoardgame(this.boardgameID, formData)
        .subscribe(
          (response) => {
            if (response.error) {
              this.message = response.error;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update boardgame. Please try again.',
              });
            }else {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Boardgame update successfully!',
              });
              setTimeout(() => {            
                this.closePopup(); // ปิด popup หลังจากอัปเดตเสร็จ
              }, 2000); // หน่วงเวลา 2 วินาที ก่อน redirect
            }
          }
        );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields.',
      });
      this.boardgameForm.markAllAsTouched(); // ทำให้ทุกฟิลด์ถูก mark ว่า touched เพื่อแสดงข้อผิดพลาด

    }
  }
  
}
