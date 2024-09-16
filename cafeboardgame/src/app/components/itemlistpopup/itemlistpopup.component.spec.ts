import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemlistpopupComponent } from './itemlistpopup.component';

describe('ItemlistpopupComponent', () => {
  let component: ItemlistpopupComponent;
  let fixture: ComponentFixture<ItemlistpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemlistpopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemlistpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
