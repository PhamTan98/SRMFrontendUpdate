import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBaiTestComponent } from './list-test.component';

describe('ListBaiTestComponent', () => {
  let component: ListBaiTestComponent;
  let fixture: ComponentFixture<ListBaiTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBaiTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBaiTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
