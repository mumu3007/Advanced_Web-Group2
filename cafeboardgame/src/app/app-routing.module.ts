import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { BoardgameComponent } from './components/boardgame/boardgame.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth-guard.guard';



const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'boardgame', component: BoardgameComponent },
  { path: 'menu', component: MenuComponent,canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent,canActivate: [authGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },  
  { path: '**', redirectTo: '/home' }  
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
