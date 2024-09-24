import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment/payment.service';
import * as QRCode from 'qrcode';
import promptpay from 'promptpay-qr';
import { MessageService } from 'primeng/api'; // เพิ่มการนำเข้า MessageService
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;
  selectedFile: File | null = null;
  promptPayPayload: string = '';
  qrCodeDataUrl: string = '';
  userId: string | null = null; 

  @Input() price: number = 0;
  @Input() cart_id: string | null | undefined;
  @Output() close = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    // สร้างฟอร์ม
    this.paymentForm = this.fb.group({
      cart_id: ['', Validators.required],
      image: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // ตั้งค่า cart_id ที่ได้รับจาก @Input()
    if (this.cart_id) {
      this.paymentForm.patchValue({ cart_id: this.cart_id });
      console.log('cart_id set:', this.cart_id);
    } else {
      console.error('cart_id is not set');
    }

    // สร้าง PromptPay Payload
    const recipient = '0841682816'; // หมายเลข PromptPay
    const amount = this.price; // จำนวนเงินที่ต้องการชำระ
    const payload = promptpay(recipient, { amount });

    // สร้าง QR Code จาก Payload
    QRCode.toDataURL(payload, (err, url) => {
      if (err) {
        console.error('Error generating QR code', err);
      } else {
        this.qrCodeDataUrl = url; // เก็บ URL ของ QR Code เพื่อใช้แสดง
      }
    });

    this.authService.getUserId().subscribe((id) => {
      this.userId = id; // ดึง userId และเก็บไว้ในตัวแปร
    });
  }

  // ฟังก์ชันสำหรับสร้าง PromptPay Payload
  generatePromptPayPayload(recipient: string, amount: number): string {
    const payload = `00020101021129370016A00000067701011101130066${recipient}5802TH53037645404${amount.toFixed(
      2
    )}6304`;
    return payload;
  }

  // เมื่อเลือกไฟล์
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    console.log('Selected File:', file);
    if (file) {
      this.selectedFile = file;
      this.paymentForm.patchValue({ image: file });
    } else {
      console.error('Invalid file selected.');
    }
  }

  // ตรวจสอบประเภทและขนาดของไฟล์
  // isValidFile(file: File): boolean {
  //   const validTypes = ['image/jpeg', 'image/png'];
  //   const maxSize = 5 * 1024 * 1024; // 5MB
  //   return validTypes.includes(file.type) && file.size <= maxSize;
  // }

  // เมื่อกด submit
  onSubmit(): void {
    if(this.paymentForm.valid === false) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Image file is required.',
      });
    }
    if (this.paymentForm.valid && this.selectedFile) {
      const formData = new FormData();
      if (this.userId) {
        formData.append('user_id', this.userId); // เพิ่ม user_id ถ้าไม่ใช่ null
      } else {
        formData.append('user_id', ''); // ใช้ค่าดีฟอลต์ถ้า userId เป็น null
      }
  
      formData.append('cart_id', this.paymentForm.get('cart_id')?.value);
      formData.append('image', this.selectedFile); // เพิ่มไฟล์ที่เลือกลงใน formData

      console.log(formData);

      // เรียก service เพื่อส่งข้อมูล
      this.paymentService.createPayment(formData).subscribe({
        next: (response) => {
          console.log('Payment uploaded successfully', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
          // ทำการ redirect ไปหน้า login หลังจากสมัครสำเร็จ
          setTimeout(() => {
            window.location.reload();
          }, 2000); // หน่วงเวลา 2 วินาที ก่อน redirect
        },
        error: (err) => {
          console.error('Failed to upload payment', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
          });
        },
      });
    }
  }

  closePopup() {
    this.close.emit(); // ส่งสัญญาณกลับไปที่ parent component เพื่อปิด popup
  }
}
