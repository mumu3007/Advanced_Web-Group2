import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbaradmin',
  templateUrl: './navbaradmin.component.html',
  styleUrl: './navbaradmin.component.css'
})
export class NavbaradminComponent {

  scrolled = false;

  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const isScrolled = window.scrollY > 10;
    this.scrolled = isScrolled;
  }

}

