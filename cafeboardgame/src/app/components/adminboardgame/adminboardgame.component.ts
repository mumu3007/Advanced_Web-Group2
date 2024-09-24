import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BoardgameserviceService } from '../../services/boardgame/boardgameservice.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-adminboardgame',
  templateUrl: './adminboardgame.component.html',
  styleUrl: './adminboardgame.component.css',
  providers: [MessageService] // Add MessageService provider

})
export class AdminboardgameComponent implements OnInit {

  message: string = '';
  selectedFile: File | null = null;

  typeItems: any[] = [];
  boardgames: any[] = [];

  selectedBoardgameId?: string;
  showPopup = false;

  constructor(
    private boardgameService: BoardgameserviceService,
    private messageService: MessageService, // Inject MessageService

  ) { }

  boardgameForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    quantity: new FormControl('', [Validators.required, Validators.min(1)]), // ตรวจสอบให้กรอกค่าเป็นตัวเลขที่มากกว่า 0
    price: new FormControl('',[Validators.required,Validators.min(1)]), // ตรวจสอบให้กรอกค่าราคาที่ถูกต้อง
    photo: new FormControl<File | null>(null, [Validators.required]),
    create_at: new FormControl(new Date()), // ตั้งค่าเริ่มต้นเป็นวันที่ปัจจุบัน
    status: new FormControl(null, Validators.required),
    type: new FormControl(null, Validators.required),

  });

  //เปิดpopup
  openPopup(boardgameId: string) {
    this.selectedBoardgameId = boardgameId;
    this.showPopup = true;
    console.log(boardgameId);
  }
  //ปิดpopup
  closePopup() {
    this.showPopup = false;
    this.loadBoardgames();
  }
  //เคลียร์ช่องinput
  ClearBoardgameForm() {
    this.boardgameForm.reset();
    window.location.reload();
  }

  // เมื่อเลือกไฟล์
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    console.log('Selected File:', file);
    if (file && this.isValidFile(file)) {
      this.selectedFile = file;
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

  AddBoardgame() {
    // ตรวจสอบว่าฟอร์มถูกต้อง
    if (this.boardgameForm.valid) {
      // ดึงข้อมูลจากฟอร์ม      
      const formData = new FormData();
      formData.append('name', this.boardgameForm.get('name')?.value || '');
      formData.append('description', this.boardgameForm.get('description')?.value || '');
      formData.append('quantity', this.boardgameForm.get('quantity')?.value?.toString() || '0');
      formData.append('price', this.boardgameForm.get('price')?.value?.toString() || '0');
      formData.append('photo', this.boardgameForm.get('photo')?.value || '');
      formData.append('create_at', this.boardgameForm.get('create_at')?.value?.toString() || new Date().toISOString());
      formData.append('status', this.boardgameForm.get('status')?.value!);
      formData.append('type', this.boardgameForm.get('type')?.value || '');

      // ส่งข้อมูลไปยัง backend API
      this.boardgameService.addBoardgame(formData).subscribe(
        (response) => {
          if (response.error) {
            this.message = response.error;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to add boardgame. Please try again.',
            });
          } else {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Boardgame added successfully!',
            });
            setTimeout(() => {
              this.boardgameForm.reset();
              window.location.reload();
            }, 1000); // หน่วงเวลา 1 วินาที ก่อน redirect
          }
        },
        error => {
          console.log('Failed to add boardgame', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add boardgame. Please try again.',
          });
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

  loadBoardgames() {
    this.boardgameService.getAllBoardgames().subscribe(
      (data) => {
        this.boardgames = data;
      },
      (error) => {
        console.error('Error fetching boardgame:', error);
      }
    );
  }

  loadBoardgameTypeItem() {
    this.boardgameService.getBoardgameType().subscribe(
      (data) => {
        this.typeItems = data
      }
    )
  }

  // ลบบอร์ดเกม
  deleteBoardgameItem(id: number) {
    this.boardgameService.deletedBoardgame(id).subscribe(
      (response) => {
        console.log("response", response)
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Boardgame deleted successfully!',
        });
        this.loadBoardgames(); // รีเฟรชรายการเมนู
      },
      (error) => {
        console.log("error", error)
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete boardgame. Please try again.',
        });
      }
    );
  }

  ngOnInit(): void {
    this.loadBoardgameTypeItem();
    this.loadBoardgames();   
    };  
}
