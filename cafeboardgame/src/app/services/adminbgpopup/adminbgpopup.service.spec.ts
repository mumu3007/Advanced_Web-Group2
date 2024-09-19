import { TestBed } from '@angular/core/testing';

import { AdminbgpopupService } from './adminbgpopup.service';

describe('AdminbgpopupService', () => {
  let service: AdminbgpopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminbgpopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
