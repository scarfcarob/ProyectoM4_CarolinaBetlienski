
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import type { Task, NewTask, UpdateTask } from '../types/task';
import * as tasksService from '../services/tasksService';

export function useTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- reset intencional al cerrar sesión, no es un cálculo derivable en render
            setTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = tasksService.subscribeToUserTasks(
            user.uid,
            (updatedTasks) => {
                setTasks(updatedTasks);
                setLoading(false);
                setError(null);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user]);

    async function addTask(newTask: NewTask) {
        if (!user) return;
        await tasksService.createTask(user.uid, newTask);
    }

    async function editTask(taskId: string, updates: UpdateTask) {
        await tasksService.updateTask(taskId, updates);
    }

    async function removeTask(taskId: string) {
        await tasksService.deleteTask(taskId);
    }

    return { tasks, loading, error, addTask, editTask, removeTask };
}