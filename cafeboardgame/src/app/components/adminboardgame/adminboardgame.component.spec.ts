import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminboardgameComponent } from './adminboardgame.component';

describe('AdminboardgameComponent', () => {
  let component: AdminboardgameComponent;
  let fixture: ComponentFixture<AdminboardgameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminboardgameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminboardgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
