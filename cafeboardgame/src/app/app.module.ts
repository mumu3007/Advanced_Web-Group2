import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
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
import { AdminboardgameComponent } from './components/adminboardgame/adminboardgame.component';

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
    NavadmenuComponent,
    AdminboardgameComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    provideClientHydration(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
