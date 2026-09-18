
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { Task, NewTask, UpdateTask } from '../types/task';

const TASKS_COLLECTION = 'tasks';



export function subscribeToUserTasks(
    userId: string,
    onTasksChange: (tasks: Task[]) => void,
    onError: (error: Error) => void
): Unsubscribe {
    const tasksQuery = query(
        collection(db, TASKS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(
        tasksQuery,
        (snapshot) => {
            const tasks = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            })) as Task[];
            onTasksChange(tasks);
        },
        (error) => {
            onError(error);
        }
    );
}


export async function createTask(userId: string, newTask: NewTask): Promise<void> {
    await addDoc(collection(db, TASKS_COLLECTION), {
        ...newTask,
        userId,
        completed: false,
        createdAt: serverTimestamp(),
    });
}


export async function updateTask(taskId: string, updates: UpdateTask): Promise<void> {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskRef, updates);
}


export async function deleteTask(taskId: string): Promise<void> {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(taskRef);
}