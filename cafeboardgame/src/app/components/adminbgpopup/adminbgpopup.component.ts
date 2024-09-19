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
  // @Input() loadBoardgameTypeItem! : () => void;
  @Output() close = new EventEmitter<void>();
  boardgameForm!: FormGroup;
  boardgameData: any;
  typeItems: any[] = [];
  
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
      photo: [''],
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

  // loadBoardgameTypeItem() {
  //   this.boardgameService.getBoardgameType().subscribe(data => {
  //     this.typeItems = data;
  //   }, error => {
  //     console.error('Error fetching boardgame types:', error);
  //   });
  // }
  
}
