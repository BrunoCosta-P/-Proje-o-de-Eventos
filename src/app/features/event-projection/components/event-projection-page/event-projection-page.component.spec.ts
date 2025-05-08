import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventProjectionPageComponent } from './event-projection-page.component';

describe('EventProjectionPageComponent', () => {
  let component: EventProjectionPageComponent;
  let fixture: ComponentFixture<EventProjectionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventProjectionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventProjectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
