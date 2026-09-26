
import type { Timestamp } from 'firebase/firestore';

type DateLike = Timestamp | Date | string | number | null | undefined;

function hasToDate(value: unknown): value is { toDate: () => Date } {
    return (
        typeof value === 'object' &&
        value !== null &&
        'toDate' in value &&
        typeof (value as { toDate: unknown }).toDate === 'function'
    );
}

export function formatDate(value: DateLike): string {
    if (!value) return '';

    let date: Date;
    if (hasToDate(value)) {
        date = value.toDate();
    } else if (value instanceof Date) {
        date = value;
    } else {
        date = new Date(value);
    }

    if (isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
}