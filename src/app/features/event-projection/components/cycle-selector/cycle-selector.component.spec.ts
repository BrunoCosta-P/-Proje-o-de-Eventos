import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleSelectorComponent } from './cycle-selector.component';

describe('CycleSelectorComponent', () => {
  let component: CycleSelectorComponent;
  let fixture: ComponentFixture<CycleSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CycleSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
