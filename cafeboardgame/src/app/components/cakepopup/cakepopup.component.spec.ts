import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CakepopupComponent } from './cakepopup.component';

describe('CakepopupComponent', () => {
  let component: CakepopupComponent;
  let fixture: ComponentFixture<CakepopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CakepopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CakepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


