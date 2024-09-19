import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminbgpopupComponent } from './adminbgpopup.component';

describe('AdminbgpopupComponent', () => {
  let component: AdminbgpopupComponent;
  let fixture: ComponentFixture<AdminbgpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminbgpopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminbgpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
