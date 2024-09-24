import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../../services/menu/menuservice.service';
import { ItemlistpopupService } from '../../services/itemlistpopup/itemlistpopup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admincakepopup',
  templateUrl: './admincakepopup.component.html',
  styleUrls: ['./admincakepopup.component.css']
})
export class AdmincakepopupComponent {

  @Input() cakemenuID?: string;
  @Output() close = new EventEmitter<void>();
 
  cakemenuData: any;
  updatecakeForm!: FormGroup;
  selectedFile?: File | null = null;
  currentSection: string = 'all-orders';
  cakeItems: any[] = [];

  constructor(
    private cakeService: ApiService,
    private ItemlistpopupService: ItemlistpopupService,
    private fb: FormBuilder,
    private messageService: MessageService 
  ){}

  ngOnInit(): void {
    this.updatecakeForm = this.fb.group({
      name: ['', Validators.required],
      cakedescription: ['', Validators.required],
      cakeprice: [null, [Validators.required, Validators.min(1)]], // ต้องระบุค่าและระบุค่าเป็นตัวเล
      photo: [''],
      create_at: [new Date()],
    });
    this.loadCakemenuByID();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    console.log('Selected File:', file);
    if (file && this.isValidFile(file)) {
      this.selectedFile = file;
      console.log('Selected File:', this.selectedFile);
      this.updatecakeForm.patchValue({ photo: file });
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


  loadCakemenuByID() {
    if (this.cakemenuID) {
      this.ItemlistpopupService.getCakeByID(this.cakemenuID).subscribe((data) => {
        console.log('ข้อมูลที่ได้รับ:', data);
        this.cakemenuData = data;
        if (data) {
          this.updatecakeForm.patchValue({
            name: data.name,
            cakedescription: data.description,
            cakeprice: data.price,
            create_at: data.create_at,
          });
        }
        console.log('ข้อมูลในฟอร์มที่ได้รับ:', this.cakemenuData);
      });
    }
  }
  
  updateCakemenu() {
    if (this.updatecakeForm.valid && this.cakemenuID) {
      const formData = new FormData();

      formData.append('name', this.updatecakeForm.get('name')?.value);
      formData.append('description', this.updatecakeForm.get('cakedescription')?.value);
      formData.append('price', this.updatecakeForm.get('cakeprice')?.value);
      formData.append('create_at', this.updatecakeForm.get('create_at')?.value);
    
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile, this.selectedFile.name);
        console.log('FormData with photo:', formData);
      }else {
        console.log('No photo selected');
      }

      this.ItemlistpopupService.updateCakemenu(this.cakemenuID, formData)
        .subscribe(
          (response) => {
            console.log('Cake updated:', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Update menu successful!',
            });
            this.closeCakePopup(); 
          },
          
          (error) => {
            console.error('Error updating boardgame:', error);
          }
        );
    } else {
      console.log('Form is not valid');
    }
  }

  closeCakePopup() {
    this.close.emit();
    
  }
}
