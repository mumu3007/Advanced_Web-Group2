import { TestBed } from '@angular/core/testing';

import { ItemlistpopupService } from './itemlistpopup.service';

describe('ItemlistpopupService', () => {
  let service: ItemlistpopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemlistpopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
