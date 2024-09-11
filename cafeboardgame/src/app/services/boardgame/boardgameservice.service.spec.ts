import { TestBed } from '@angular/core/testing';

import { BoardgameserviceService } from './boardgameservice.service';

describe('BoardgameserviceService', () => {
  let service: BoardgameserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardgameserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
