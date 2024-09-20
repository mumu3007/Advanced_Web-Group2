import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../../services/menu/menuservice.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api'; // Import MessageService
import { CakeMenu } from '../../models/cakemenu.model';
import { Menu } from '../../models/menu.model';

@Component({
  selector: 'app-adminorder',
  templateUrl: './adminorder.component.html',
  styleUrls: ['./adminorder.component.css']
})
export class AdminorderComponent {

  menu: Menu = { name: '', s_price: 0, m_price: 0, l_price: 0, photo: '', type_coffee: [], status: '', create_at:new Date(), }
  cakemenu: CakeMenu = { name: '', description: '', price: 0, photo: '', create_at:new Date(), }

  currentSection: string = 'all-orders'; // กำหนดค่าเริ่มต้นให้กับ section ที่จะแสดง
  menuSection: string = 'all-menu';
  message: string = '';
  menuItems: any[] = [];
  cakeItems: any[] = [];
  displayedMenuItems: any[] = [];
  displayedCakeItems: any[] = [];
  selectedFile: File | null = null;
  selectedCoffeemenuId?: string;
  showPopup = false;


  constructor(
    private menuService: ApiService,
    private cakeService: ApiService,
    private router: Router,
    private messageService: MessageService, // Inject MessageService
    private cdr: ChangeDetectorRef

  ) { }


  ngOnInit(): void {
    this.DisplayMenuItems();
    this.DisplayCakeItems();
  }

  showSection(sectionId: string): void {
    this.currentSection = sectionId; // เปลี่ยน section ที่จะแสดงตามการคลิก
  }


  openPopup(coffeemenuId: string) {
    this.selectedCoffeemenuId = coffeemenuId;
    this.showPopup = true;
    console.log(coffeemenuId);
  }

  closePopup() {
    this.showPopup = false;
  }

  BeveragemenuForm = new FormGroup({
    name: new FormControl(''),
    tallcupprice: new FormControl(),
    grandecupprice: new FormControl(),
    venticupprice: new FormControl(),
    hot: new FormControl(false),
    iced: new FormControl(false),
    frappe: new FormControl(false),
    upload: new FormControl(),
    status: new FormControl('status'),
    create_at: new FormControl(new Date()),

  });

  CakemenuForm = new FormGroup({
    name: new FormControl(''),
    cakedescription: new FormControl(''),
    cakeprice: new FormControl(),
    upload: new FormControl(),
    create_at: new FormControl(new Date()),

  });


  // เมื่อเลือกไฟล์
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    console.log('Selected File:', file);
    if (file && this.isValidFile(file)) {
      this.selectedFile = file;
      this.BeveragemenuForm.patchValue({ upload: file });
      this.CakemenuForm.patchValue({ upload: file });
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

  //เพิ่มเมนูกาแฟ
  AddMenuItem() {
    if (this.BeveragemenuForm.valid) {

      console.log("beveragemenuform",this.BeveragemenuForm)

      const coffeeTypes = ['hot', 'iced', 'frappe']
      .filter(type => this.BeveragemenuForm.get(type)?.value)
      .map(type => type.toUpperCase());

      const status = this.BeveragemenuForm.get('status')?.value;
      const statusValue = status === 'true' ? 'regular' : 'recommended';



      // รับค่าจากฟอร์ม
      const formData = new FormData();
      formData.append('name', this.BeveragemenuForm.get('name')?.value || '');
      formData.append('s_price', this.BeveragemenuForm.get('tallcupprice')?.value.toString() || '0');
      formData.append('m_price', this.BeveragemenuForm.get('grandecupprice')?.value?.toString() || '0');
      formData.append('l_price', this.BeveragemenuForm.get('venticupprice')?.value?.toString() || '0');
      formData.append('type_coffee', JSON.stringify(coffeeTypes));
      formData.append('photo', this.BeveragemenuForm.get('upload')?.value || '');
      formData.append('status', statusValue);
      formData.append('create_at', this.BeveragemenuForm.get('create_at')?.value?.toString() || new Date().toISOString());

      console.log('Form Data:', {
        name: this.BeveragemenuForm.get('name')?.value,
        s_price: this.BeveragemenuForm.get('tallcupprice')?.value,
        m_price: this.BeveragemenuForm.get('grandecupprice')?.value,
        l_price: this.BeveragemenuForm.get('venticupprice')?.value,
        type_coffee: coffeeTypes,
        photo: this.BeveragemenuForm.get('upload')?.value,
        status: this.BeveragemenuForm.get('status')?.value
    });

      console.log('formData',formData)
      this.menuService.addMenuItem(formData).subscribe(
        (response) => {
          this.message = "success";
          console.log(response, this.message);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Add menu successful!',
          });
          this.BeveragemenuForm.reset();
          this.currentSection = 'beverage-menu';
          this.DisplayMenuItems()
          this.cdr.detectChanges();
          this.BeveragemenuForm.get('status')?.setValue('status');
        },
        (error) => {
          this.message = "fail";
          console.log(error, this.message);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Add menu failed. Please try again.',
          });
        }
      );
    }
  }

  // ลบรายการของเมนูกาแฟ
  deleteMenuItem(id: number) {
    this.menuService.deleteCoffeeMenu(id).subscribe(
      (response) => {
        console.log("response",response)
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Menu item deleted successfully!',
        });
        this.DisplayMenuItems(); // รีเฟรชรายการเมนู
      },
      (error) => {
        console.log("error",error)
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete menu item. Please try again.',
        });
      }
    );
  }
  
  // ลบรายการของเมนูเค้ก
  deletecakeItem(id: number) {
    this.menuService.deletedCakemenu(id).subscribe(
      (response) => {
        console.log("response",response)
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Menu item deleted successfully!',
        });
        this.DisplayCakeItems(); // รีเฟรชรายการเมนู
      },
      (error) => {
        console.log("error",error)
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete menu item. Please try again.',
        });
      }
    );
  }

  //เคลียร์ฟอร์มเมนูเครื่องดื่มและเค้ก
  ClearBeveragemenuForm() {
    this.BeveragemenuForm.reset();
    this.BeveragemenuForm.get('status')?.setValue('status');
  }
  ClearCakemenuForm() {
    this.CakemenuForm.reset();
  }

  //เพิ่มเมนูเค้ก
  AddCakeMenuItem() {
    if (this.CakemenuForm.valid) {
      
      // รับค่าจากฟอร์ม
      const formData = new FormData();
        formData.append('name', this.CakemenuForm.get('name')?.value || '');
        formData.append('description', this.CakemenuForm.get('cakedescription')?.value || '');
        formData.append('price', this.CakemenuForm.get('cakeprice')?.value?.toString() || '0');
        formData.append('photo', this.CakemenuForm.get('upload')?.value || '');
        formData.append('create_at', this.CakemenuForm.get('create_at')?.value?.toString() || new Date().toISOString());

      // ส่งข้อมูลไปยังเมธอดของ ApiService
      this.menuService.addCakeItem(formData).subscribe(
        (response) => {
          this.message = "success";

          console.log(response, this.message);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Add Item successful!',
          });

          this.CakemenuForm.reset();
          this.currentSection = 'cake-menu';
          this.DisplayCakeItems();
          

        },
        (error) => {
          this.message = "fail";
          console.log(error, this.message);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Add Item failed. Please try again.',
          });
        }
      );
    }
  }

  DisplayMenuItems() {
    this.menuService.getMenuItems().subscribe(
      (data) => {
        
        this.menuItems = data;
        console.log('Menu items:', this.menuItems);
      },
      (error) => {
        console.error('Error fetching menu:', error);
      }
    );
  }

  DisplayCakeItems() {
    this.cakeService.getCakeItems().subscribe(
      (data) => {
        this.cakeItems = data;
      },
      (error) => {
        console.error('Error fetching menu:', error);
      }
    );
  }

  orders = [
    {
      image: 'assets/images/iced-espresso-coffee.jpg',
      name: 'ICED ESPRESSO COFFEE',
      description: 'SWEET: 25% \nSIZE: TALL \nUsername: myde',
      quantity: 'X2',
      price: 138
    },
    {
      image: 'assets/images/classic-chocolate-cake.jpg',
      name: 'CLASSIC CHOCOLATE CAKE',
      description: 'เค้กช็อกโกแลตสดสลับพร้อมไอศครีมช็อกโกแลต \nUsername: myde',
      quantity: 'X1',
      price: 99
    },
    {
      image: 'assets/images/iced-matcha-milk.jpg',
      name: 'ICED MATCHA MILK',
      description: 'SWEET: 75% \nSIZE: TRENTA \nUsername: myde',
      quantity: 'X2',
      price: 176
    },
    {
      image: 'assets/images/iced-matcha-milk.jpg',
      name: 'ICED MATCHA MILK',
      description: 'SWEET: 75% \nSIZE: TRENTA \nUsername: myde',
      quantity: 'X2',
      price: 176
    },
    {
      image: 'assets/images/iced-matcha-milk.jpg',
      name: 'ICED MATCHA MILK',
      description: 'SWEET: 75% \nSIZE: TRENTA \nUsername: myde',
      quantity: 'X2',
      price: 176
    }
  ];

}
