import { Component, OnInit } from '@angular/core';
import { Boardgame } from '../../models/boardgame.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/menu/menuservice.service';
import { BoardgameserviceService } from '../../services/boardgame/boardgameservice.service';

@Component({
  selector: 'app-adminboardgame',
  templateUrl: './adminboardgame.component.html',
  styleUrl: './adminboardgame.component.css'
})
export class AdminboardgameComponent implements OnInit {
 
  boardgame: Boardgame = {name:'', description:'', quantity:0, price:0, photo:'', create_at:new Date(), status:false, type:"", }

  currentSection: string = 'boardgame'; // กำหนดค่าเริ่มต้นให้กับ section ที่จะแสดง
  menuSection: string = 'all-menu';
  message: string = '';

  typeItems: any[] = [];

  
  showSection(sectionId: string): void {
    this.currentSection = sectionId; // เปลี่ยน section ที่จะแสดงตามการคลิก
  }

  constructor(
    private boardgameService: BoardgameserviceService,
  ) { }

  boardgameForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    quantity: new FormControl(), // ตรวจสอบให้กรอกค่าเป็นตัวเลขที่มากกว่า 0
    price: new FormControl(), // ตรวจสอบให้กรอกค่าราคาที่ถูกต้อง
    photo: new FormControl(''),
    create_at: new FormControl(new Date()), // ตั้งค่าเริ่มต้นเป็นวันที่ปัจจุบัน
    status: new FormControl(null, Validators.required),
    type:new FormControl(''),

  });
  // quantity: new FormControl(0, [Validators.required, Validators.min(1)]), // ตรวจสอบให้กรอกค่าเป็นตัวเลขที่มากกว่า 0

  AddBoardgame() {
    // ตรวจสอบว่าฟอร์มถูกต้อง
    if (this.boardgameForm.valid) {
      // ดึงข้อมูลจากฟอร์ม
      const formData = this.boardgameForm.value;
  
      // สร้างข้อมูล Boardgame จากข้อมูลฟอร์ม
      const boardgame: Boardgame = {
        name: formData.name || '',
        description: formData.description || '',
        quantity: formData.quantity || 0,
        price: formData.price || 0,
        photo: formData.photo || '',
        create_at: formData.create_at || new Date(),
        status: formData.status ?? false, 
        type: formData.type || "",
      };
  
      // ส่งข้อมูลไปยัง backend API
      this.boardgameService.addBoardgame(boardgame).subscribe(
        (response) => {
          // การตอบกลับจาก API สำเร็จ
          this.message = "Boardgame added successfully!";
          console.log('Response:', response);
          // ทำความสะอาดฟอร์มหลังจากส่งข้อมูลสำเร็จ
          this.boardgameForm.reset();
        },
        (error) => {
          // การตอบกลับจาก API ล้มเหลว
          this.message = "Failed to add boardgame.";
          console.error('Error:', error);
          console.log(boardgame)
        }
      );
    } else {
      // ฟอร์มไม่ถูกต้อง
      this.message = "Form is invalid.";
      console.log("Form is invalid");
    }
  }
  

  // AddBoardgame() {
  //   if (this.boardgameForm.valid) {
  //     const formData = this.boardgameForm.value;
  
  //     const boardgame: Boardgame = {
  //       name: formData.name || '',
  //       description: formData.description || '',
  //       quantity: formData.quantity || 0,
  //       price: formData.price || 0,
  //       photo: formData.photo || '',
  //       create_at: formData.create_at || new Date(),
  //       status: formData.status ?? false,
  //       type: (formData.type || []).filter((t: string | null) => t !== null) as string[],
  //     };
  
  //     this.boardgameService.addBoardgame(this.boardgame).subscribe(
  //       (response) => {
  //           this.message = "success";
  //           console.log(response, this.message);
  //       },
  //       (error) => {
  //           this.message = "fail";
  //           console.log(error, this.message);
  //       }
  //   );

  //   } else {
  //     console.log("Form is invalid");
  //   }
  // }
  

  loadBoardgameTypeItem(){
    this.boardgameService.getBoardgameType().subscribe(
      (data) => {
        this.typeItems = data
      }
    )
  }


  ngOnInit(): void {
      this.loadBoardgameTypeItem();
  }
}
