import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavadmenuComponent } from './navadmenu.component';

describe('NavadmenuComponent', () => {
  let component: NavadmenuComponent;
  let fixture: ComponentFixture<NavadmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavadmenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavadmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
