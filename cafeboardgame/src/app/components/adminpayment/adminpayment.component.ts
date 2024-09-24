import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment/payment.service';
import { MessageService } from 'primeng/api'; // เพิ่มการนำเข้า MessageService

@Component({
  selector: 'app-adminpayment',
  templateUrl: './adminpayment.component.html',
  styleUrls: ['./adminpayment.component.css']
})
export class AdminpaymentComponent implements OnInit {
  payments: any[] = [];

  constructor(
    private paymentService: PaymentService,
    private messageService: MessageService,
  ) { }

  loadPaymentAdmins(){
    this.paymentService.getAllPayments().subscribe(
      (data) => {
        this.payments = data;
        // console.log(this.payments)
      },
      (error) => {
        console.error('Error fetching boardgame:', error);
      }
    );
  }

  ngOnInit(): void {
    this.loadPaymentAdmins()
    };

    updatePaymentStatus(paymentId: string, newStatus: string) {
      this.paymentService.updatePaymentStatus(paymentId, newStatus).subscribe(
        (response) => {
          console.log('Payment update successfully', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Payment updated successful!',
          });
          // ทำการ redirect ไปหน้า login หลังจากสมัครสำเร็จ
          setTimeout(() => {
            window.location.reload();
          }, 2000); // หน่วงเวลา 2 วินาที ก่อน redirect
        },
        (error) => {
          console.error('Error updating payment status:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Payment updated failed! Please try again.',
          });
        }
      );
    }

}
