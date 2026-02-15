import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaptopComponent } from './laptop.component';

describe('Laptop', () => {
  let component: LaptopComponent;
  let fixture: ComponentFixture<LaptopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaptopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaptopComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
