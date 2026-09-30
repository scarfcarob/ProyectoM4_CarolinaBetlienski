
import type { Timestamp } from 'firebase/firestore';

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    userId: string;
    createdAt: Timestamp | null;
    updatedAt?: Timestamp;
}

export interface NewTask {
    title: string;
    description: string;
}

export type UpdateTask = Partial<Pick<Task, 'title' | 'description' | 'completed'>>;