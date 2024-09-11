import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navadmenu',
  templateUrl: './navadmenu.component.html',
  styleUrl: './navadmenu.component.css'
})
export class NavadmenuComponent {

  scrolled = false;

  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const isScrolled = window.scrollY > 10;
    this.scrolled = isScrolled;
  }

}
