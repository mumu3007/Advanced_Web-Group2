import { TestBed } from '@angular/core/testing';

import { MenupopupService } from '../menupopup/menupopup.service';

describe('MenupopupService', () => {
  let service: MenupopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenupopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
