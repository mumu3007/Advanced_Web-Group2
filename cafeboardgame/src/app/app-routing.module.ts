import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { BoardgameComponent } from './components/boardgame/boardgame.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth-guard.guard';
import { CartComponent } from './components/cart/cart.component';



const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'boardgame', component: BoardgameComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'cart', component: CartComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },  
  { path: '**', redirectTo: '/home' }  
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
