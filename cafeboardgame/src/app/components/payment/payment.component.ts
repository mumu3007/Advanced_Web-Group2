import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  @Input() price: number = 0;
  @Output() close = new EventEmitter<void>();
  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log('File selected:', file);
    }
  }
  closePopup() {
    this.close.emit(); // ส่งสัญญาณกลับไปที่ parent component เพื่อปิด popup
  }
}
