import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../../services/menu/menuservice.service';
import {Router } from '@angular/router';
import { MessageService } from 'primeng/api'; // Import MessageService
import { CakeMenu } from '../../models/cakemenu.model';
import { Menu } from '../../models/menu.model';

@Component({
  selector: 'app-adminorder',
  templateUrl: './adminorder.component.html',
  styleUrls: ['./adminorder.component.css']
})
export class AdminorderComponent {

  menu: Menu = {name:'', s_price: 0, m_price: 0, l_price: 0, photo:'', type_coffee:[], status:'',}
  cakemenu: CakeMenu = {name:'', description: '', price: 0, photo:'',}

  currentSection: string = 'all-orders'; // กำหนดค่าเริ่มต้นให้กับ section ที่จะแสดง
  menuSection: string = 'all-menu';
  message: string = '';
  showPopup: boolean = false;

  constructor(
    private menuService: ApiService,
    private router: Router,
    private messageService: MessageService // Inject MessageService
    
  ) {}


  showSection(sectionId: string): void {
    this.currentSection = sectionId; // เปลี่ยน section ที่จะแสดงตามการคลิก
  }
  
  BeveragemenuForm = new FormGroup({
    name: new FormControl(''),
    tallcupprice: new FormControl(),
    grandecupprice: new FormControl(),
    venticupprice: new FormControl(),
    hot: new FormControl(false),
    iced: new FormControl(false),
    frappe: new FormControl(false),
    upload: new FormControl(null),
    status: new FormControl('status'),

  });

  CakemenuForm = new FormGroup({
    name: new FormControl(''),
    cakedescription: new FormControl(''),
    cakeprice: new FormControl(),
    upload: new FormControl(null),
    
  });

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }



  AddMenuItem() {
    if (this.BeveragemenuForm.valid) {
        // รับค่าจากฟอร์ม
        const formData = this.BeveragemenuForm.value;

        // กำหนดค่าให้กับ this.menu จากฟอร์ม
        this.menu.name = formData.name || '';
        this.menu.s_price = formData.tallcupprice || 0;
        this.menu.m_price = formData.grandecupprice || 0;
        this.menu.l_price = formData.venticupprice || 0;
        this.menu.type_coffee = [
            formData.hot ? 'HOT' : '',
            formData.iced ? 'ICED' : '',
            formData.frappe ? 'FRAPPE' : ''
        ].filter(Boolean);
        this.menu.photo = formData.upload || '';
        this.menu.status = formData.status || '';

        // ส่งข้อมูลไปยังเมธอดของ ApiService
        this.menuService.addMenuItem(this.menu).subscribe(
            (response) => {
                this.message = "success";
                console.log(response, this.message);
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Login successful!',
                });
                setTimeout(() => {
                  this.BeveragemenuForm.reset();
                }, 1000); // หน่วงเวลา 2 วินาที ก่อน redirect
                
            },
            (error) => {
                this.message = "fail";
                console.log(error, this.message);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Login failed. Please try again.',
                });
            }
        );
    }
 } 

 ClearBeveragemenuForm() {
  
  this.BeveragemenuForm.reset();
  this.BeveragemenuForm.get('status')?.setValue('status');
 }
 ClearCakemenuForm() {
  this.CakemenuForm.reset();
 }

 AddCakeMenuItem() {
  if (this.CakemenuForm.valid) {
      // รับค่าจากฟอร์ม
      const formData = this.CakemenuForm.value;

      // กำหนดค่าให้กับ this.menu จากฟอร์ม
      this.cakemenu.name = formData.name || '';
      this.cakemenu.description = formData.cakedescription || '';
      this.cakemenu.price = formData.cakeprice || 0;
      this.cakemenu.photo = formData.upload || '';

      // ส่งข้อมูลไปยังเมธอดของ ApiService
      this.menuService.addCakeItem(this.cakemenu).subscribe(
          (response) => {
              this.message = "success";
              console.log(response, this.message);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Add Item successful!',
              });
              setTimeout(() => {
                this.CakemenuForm.reset();
              }, 1000); // หน่วงเวลา 2 วินาที ก่อน redirect
              
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

  aa = [
    {
      image: 'assets/images/iced-espresso-coffee.jpg',
      name: 'ICED ESPRESSO COFFEE',
      description: 'SWEET: 25% \nSIZE: TALL',
      quantity: 'X2',
      price: 138
    },
    {
      image: 'assets/images/classic-chocolate-cake.jpg',
      name: 'CLASSIC CHOCOLATE CAKE',
      description: 'เค้กช็อกโกแลตสดสลับพร้อมไอศครีมช็อกโกแลต',
      quantity: 'X1',
      price: 99
    },
    {
      image: 'assets/images/iced-matcha-milk.jpg',
      name: 'ICED MATCHA MILK',
      description: 'SWEET: 75% \nSIZE: TRENTA',
      quantity: 'X2',
      price: 176
    },
    {
      image: 'assets/images/iced-matcha-milk.jpg',
      name: 'ICED MATCHA MILK',
      description: 'SWEET: 75% \nSIZE: TRENTA',
      quantity: 'X2',
      price: 176
    },
    {
      image: 'assets/images/iced-matcha-milk.jpg',
      name: 'ICED MATCHA MILK',
      description: 'SWEET: 75% \nSIZE: TRENTA',
      quantity: 'X2',
      price: 176
    }
  ];

  ngOnInit(): void {}
  
}
