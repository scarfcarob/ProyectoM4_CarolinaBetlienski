
import { describe, it, expect } from 'vitest';
import { formatDate } from '../../src/utils/formatDate';

describe('formatDate', () => {
  it('formatea un objeto con toDate() (como un Timestamp de Firestore)', () => {
    const fakeTimestamp = {
      toDate: () => new Date('2026-01-15T10:00:00Z'),
    } as unknown as import('firebase/firestore').Timestamp;

    const result = formatDate(fakeTimestamp);

    expect(result).toBe('15/01/2026');
  });

  it('formatea un objeto Date común', () => {
    const result = formatDate(new Date('2026-03-20T10:00:00Z'));
    expect(result).toBe('20/03/2026');
  });

  it('devuelve string vacío si el valor es null', () => {
    expect(formatDate(null)).toBe('');
  });

  it('devuelve string vacío si el valor es undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });

  it('devuelve string vacío si la fecha es inválida', () => {
    expect(formatDate('esto-no-es-una-fecha')).toBe('');
  });
});