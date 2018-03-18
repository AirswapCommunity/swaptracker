import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapscanComponent } from './swapscan.component';

describe('SwapscanComponent', () => {
  let component: SwapscanComponent;
  let fixture: ComponentFixture<SwapscanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwapscanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwapscanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
