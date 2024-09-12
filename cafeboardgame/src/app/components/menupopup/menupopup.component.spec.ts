import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenupopupComponent } from './menupopup.component';

describe('MenupopupComponent', () => {
  let component: MenupopupComponent;
  let fixture: ComponentFixture<MenupopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenupopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenupopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
