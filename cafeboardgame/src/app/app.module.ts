import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { MenuComponent } from './components/menu/menu.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { BoardgameComponent } from './components/boardgame/boardgame.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminorderComponent } from './components/adminorder/adminorder.component';
import { NavbaradminComponent } from './components/navbaradmin/navbaradmin.component';
import { NavadmenuComponent } from './components/navadmenu/navadmenu.component';
import { PaymentComponent } from './components/payment/payment.component';

import { ToastModule } from 'primeng/toast'; // นำเข้า ToastModule



import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for animations
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MenuComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    BoardgameComponent,
    ProfileComponent,
    CartComponent,
    AdminorderComponent,
    NavbaradminComponent,
    NavadmenuComponent,
    PaymentComponent,
    NavadmenuComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,

    ToastModule ,
  

    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-center-top', // Use custom class for center-top position
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
      newestOnTop: true
    }),
    BrowserAnimationsModule

  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
