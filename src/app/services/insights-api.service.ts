import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { DateRange, PeriodComparisonPct, PeriodSummary } from '../models/time-range.model';
import { Observable, of } from 'rxjs';
import { timeout, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface InsightsApiRequest {
  range: DateRange;
  periodSummary: PeriodSummary;
  comparison: PeriodComparisonPct;
  transactionCount: number;
}

export interface InsightsApiResponse {
  headline?: string;
  bullets: string[];
  tone?: 'positive' | 'neutral' | 'caution';
}

function normalizeResponse(raw: unknown): InsightsApiResponse | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const bullets = o['bullets'];
  if (!Array.isArray(bullets) || bullets.length === 0) return null;
  const clean = bullets.filter((b): b is string => typeof b === 'string' && b.trim().length > 0);
  if (!clean.length) return null;
  const headline = typeof o['headline'] === 'string' ? o['headline'] : undefined;
  const tone =
    o['tone'] === 'positive' || o['tone'] === 'neutral' || o['tone'] === 'caution'
      ? o['tone']
      : undefined;
  return { headline: headline?.trim() || undefined, bullets: clean, tone };
}

@Injectable({ providedIn: 'root' })
export class InsightsApiService {
  private readonly http = inject(HttpClient);

  private static readonly MOCK_PATH = '/insights-api-mock.json';
  private static readonly TIMEOUT_MS = 4500;

  /**
   * Tries remote API (if configured), then mock JSON, then caller uses rule engine.
   */
  fetchEnrichment(body: InsightsApiRequest): Observable<InsightsApiResponse | null> {
    const url = environment.insightsApiUrl?.trim();

    if (url) {
      return this.http.post<unknown>(url, body).pipe(
        timeout(InsightsApiService.TIMEOUT_MS),
        switchMap((raw) => {
          const parsed = normalizeResponse(raw);
          if (parsed) return of(parsed);
          return this.tryMockJson();
        }),
        catchError(() => this.tryMockJson()),
      );
    }

    return this.tryMockJson();
  }

  private tryMockJson(): Observable<InsightsApiResponse | null> {
    return this.http.get<unknown>(InsightsApiService.MOCK_PATH).pipe(
      timeout(InsightsApiService.TIMEOUT_MS),
      switchMap((raw) => of(normalizeResponse(raw))),
      catchError(() => of(null)),
    );
  }
}
