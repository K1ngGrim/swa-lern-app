import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningHeatmap } from './learning-heatmap';

describe('LearningHeatmap', () => {
  let component: LearningHeatmap;
  let fixture: ComponentFixture<LearningHeatmap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningHeatmap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningHeatmap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
