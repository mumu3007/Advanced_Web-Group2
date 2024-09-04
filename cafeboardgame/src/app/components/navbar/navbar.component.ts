import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  scrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const isScrolled = window.scrollY > 10;
    this.scrolled = isScrolled;
  }
}
