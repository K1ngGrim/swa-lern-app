import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { DatePipe, NgForOf } from '@angular/common';
import { StatisticModel } from 'api';

@Component({
  selector: 'app-learning-heatmap',
  standalone: true,
  imports: [NgForOf, DatePipe],
  templateUrl: './learning-heatmap.html',
  styleUrl: './learning-heatmap.scss',
})
export class ContributionHeatmapComponent implements OnChanges, OnInit {

  @Input() statistics: StatisticModel[] = [];

  // layout
  cellSize = 12;
  gap = 3;
  labelWidth = 30;
  topLabelHeight = 20;

  // output
  days: HeatmapDay[] = [];
  monthLabels: MonthLabel[] = [];

  weekdayLabels = [
    { text: 'Mon', row: 0 },
    { text: 'Thu', row: 3 },
    { text: 'Sun', row: 6 },
  ];

  maxValue: number = 0;

  async ngOnInit() {
    this.maxValue = Math.max(
      ...this.statistics.map(d => d.data?.cardsLearned??0),
      1
    );
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['statistics']) {
      this.days = buildHeatmapDays(this.statistics);
      this.monthLabels = generateMonthLabels(this.days);
    }
  }

  color(value: number): string {
    if (value === 0) return '#ebedf0';

    const intensity = value / this.maxValue;
    const t = Math.min(Math.max(intensity, 0), 1);

    const start = { r: 155, g: 233, b: 168 }; // light green
    const end   = { r: 33,  g: 110, b: 57  }; // dark green

    const r = Math.round(start.r + (end.r - start.r) * t);
    const g = Math.round(start.g + (end.g - start.g) * t);
    const b = Math.round(start.b + (end.b - start.b) * t);

    return `rgb(${r}, ${g}, ${b})`;
  }

}

function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Mo = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}


/* ============================================================
   Models
============================================================ */

export interface HeatmapDay {
  date: Date;
  count: number;
  week: number;
  weekday: number; // Mon = 0
}

interface MonthLabel {
  text: string;
  week: number;
}

/* ============================================================
   Helpers
============================================================ */

function getWeekday(date: Date): number {
  return (date.getDay() + 6) % 7;
}

/* ============================================================
   Build Heatmap
============================================================ */

function buildHeatmapDays(dto: StatisticModel[]): HeatmapDay[] {

  const map = new Map<string, number>();

  for (const d of dto) {
    if (!d.date) continue;

    const key = d.date.slice(0, 10); // yyyy-MM-dd
    const values = map.get(key)??0;
    map.set(key, values + (d.data?.cardsLearned ?? 0));
  }

  const end = new Date();
  end.setHours(0, 0, 0, 0);

  const start = new Date(end);
  start.setDate(start.getDate() - 365);
  const calendarStart = startOfWeekMonday(start);

  const days: HeatmapDay[] = [];

  const current = new Date(calendarStart);

  while (current <= end) {
    const key = current.toISOString().slice(0, 10);

    const week =
      Math.floor(
        (current.getTime() - calendarStart.getTime()) /
        (7 * 24 * 60 * 60 * 1000)
      );

    days.push({
      date: new Date(current),
      count: map.get(key) ?? 0,
      week,
      weekday: getWeekday(current),
    });

    current.setDate(current.getDate() + 1);
  }

  return days;
}

function parseDateOnly(dateString: string): Date {
  const parts = dateString.split('-').map(Number);
  if (parts.length !== 3) return new Date(NaN); // invalid guard
  const [year, month, day] = parts;
  return new Date(year, month - 1, day); // JS-Monat 0-basiert
}

/* ============================================================
   Month Labels
============================================================ */

function generateMonthLabels(
  days: HeatmapDay[]
): MonthLabel[] {

  const labels: MonthLabel[] = [];
  const seen = new Set<number>();

  for (const day of days) {
    const month = day.date.getMonth();

    // erstes Auftreten des Monats markieren
    if (!seen.has(month) && day.date.getDate() === 1) {
      labels.push({
        text: day.date.toLocaleString('en', { month: 'short' }),
        week: day.week,
      });
      seen.add(month);
    }
  }

  return labels;
}
