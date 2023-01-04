package network.contour.task.scheduler.impl;

import network.contour.task.scheduler.api.Scheduler;
import network.contour.task.scheduler.api.Task;
import network.contour.task.scheduler.api.TaskExecution;
import network.contour.task.scheduler.api.TaskFactory;

import java.util.*;

public class TaskFactoryImpl implements TaskFactory {
    @Override
    public Scheduler newScheduler() {
        //TODO change the return value to an instance of your intended implementation
        return new Scheduler() {
            /**
             * @param tasks      an iterable containing the {@link Task} to be completed
             * @param numWorkers the number of available workers
             * @return a list of {@link TaskExecution}
             */
            @Override
            public List<TaskExecution> estimate(Iterable<Task> tasks, int numWorkers) {
                Map<Integer, List<Task>> priorityOfTask = new TreeMap<>();
                for (Task task : tasks) {
                    int priority = getPriorityTask(task);
                    if (priorityOfTask.containsKey(priority)) {
                        priorityOfTask.get(priority).add(task);
                    } else {
                        List<Task> listTaskSamePriority = new ArrayList<>();
                        listTaskSamePriority.add(task);
                        priorityOfTask.put(priority, listTaskSamePriority);
                    }
                }
                int[] workers = new int[numWorkers];

                Arrays.fill(workers, 0);

                Map<Task, TaskExecution> results = new HashMap<>();

                for (Map.Entry<Integer, List<Task>> entry : priorityOfTask.entrySet()) {
                    List<Task> tasksGroupByPriority = entry.getValue();
                    //sort by effort descending
                    tasksGroupByPriority.sort(Comparator.comparingInt(Task::getEffort).reversed());
                    for (Task task : tasksGroupByPriority) {
                        int startTime = findStartTime(task.getRequirements(), results);
                        int worker = getWorker(workers, startTime);
                        TaskExecution execution = newExecution(task, worker, workers[worker - 1]);
                        workers[worker-1] = execution.getEnd();
                        results.put(task,execution);
                    }

                }
                return new ArrayList<>(results.values());
            }
        };
    }

    int findStartTime(List<Task> dependencies, Map<Task, TaskExecution> results) {
        int startTime = 0;
        for (Task task : dependencies) {
            int endTime = results.get(task).getEnd();
            if (endTime > startTime) startTime = endTime;
        }
        return startTime;
    }

    int getWorker(int[] workers, int startTime) {
        int index = 0;
        int value = Integer.MAX_VALUE;
        for (int i = 0; i < workers.length; i++) {
            int currentValue = workers[i];
            if (currentValue >= startTime) {
                if (currentValue < value) {
                    value = currentValue;
                    index = i;
                }
            }
        }
        return index + 1;
    }

    int getPriorityTask(Task task) {
        int priority = 1;
        for (Task dependencyTask : task.getRequirements()) {
            int dependencyTaskPriority = getPriorityTask(dependencyTask);
            if (dependencyTaskPriority >= priority) {
                priority=dependencyTaskPriority+1;
            }
        }
        return priority;
    }


    @Override
    public Task newTask(String name, int effort, List<Task> requirements) {
        return new TaskImpl(name, effort, requirements);
    }

    @Override
    public TaskExecution newExecution(Task task, int workerId, int start) {
        return new TaskExecutionImpl(task, workerId, start);
    }
}
