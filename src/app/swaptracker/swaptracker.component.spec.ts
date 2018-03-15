import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwaptrackerComponent } from './swaptracker.component';

describe('SwaptrackerComponent', () => {
  let component: SwaptrackerComponent;
  let fixture: ComponentFixture<SwaptrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwaptrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwaptrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
