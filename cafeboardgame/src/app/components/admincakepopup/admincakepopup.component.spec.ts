import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmincakepopupComponent } from './admincakepopup.component';

describe('AdmincakepopupComponent', () => {
  let component: AdmincakepopupComponent;
  let fixture: ComponentFixture<AdmincakepopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmincakepopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmincakepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
