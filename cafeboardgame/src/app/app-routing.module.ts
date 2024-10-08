import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { BoardgameComponent } from './components/boardgame/boardgame.component';

import { authGuard } from './guards/auth-guard.guard';
import { CartComponent } from './components/cart/cart.component';
import { AdminorderComponent } from './components/adminorder/adminorder.component';
import { NavbaradminComponent } from './components/navbaradmin/navbaradmin.component';
import { AdminboardgameComponent } from './components/adminboardgame/adminboardgame.component';
import { ItemlistpopupComponent } from './components/itemlistpopup/itemlistpopup.component';
import { AdminpaymentComponent } from './components/adminpayment/adminpayment.component';



const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'boardgame', component: BoardgameComponent ,canActivate: [authGuard]},
  { path: 'cart', component: CartComponent,canActivate: [authGuard]},
  { path: 'menu', component: MenuComponent,canActivate: [authGuard]},
  { path: 'admin', component: AdminorderComponent,canActivate:[authGuard] },
  { path: 'itempop', component: ItemlistpopupComponent,canActivate: [authGuard] },
  { path: 'adminboardgame', component: AdminboardgameComponent,canActivate:[authGuard]},
  { path: 'adminpayment', component: AdminpaymentComponent,canActivate:[authGuard]},
  { path: '', redirectTo: '/home', pathMatch: 'full' },  
  { path: '**', redirectTo: '/home' }  
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
