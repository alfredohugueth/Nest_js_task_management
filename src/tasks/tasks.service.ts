import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
/**
 * Service that manage the database actions to get, create, update or delete a task
 */
export class TasksService {
  // It's private for manage all the actions in this service
  private tasks: Task[] = [];

  /**
   *  Method to get all the tasks from the database
   **  Output: Tasks[], an array of tasks
   */
  getAllTasks(): Task[] {
    return this.tasks;
  }

  /**
   * Method to create a task in database
   * @input {
   **    id : string,
   **    title: string,
   **    description: string,
   **    status: OPEN or IN_PROGRESS or DONE
}
   * @returns The same Task created
   */
  createTask(task: Task): Task {
    this.tasks.push(task);
    return task;
  }

  /**
   * Method to initialize the task variable based on the information of the post http request
   * @Input Body request with the format of the task
   * @returns Task in the correct format
   */
  getTaskParametersFromRequest(body: CreateTaskDTO): Task {
    // Get parameters from the body
    const { title, description } = body;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.DONE,
    };
    return task;
  }

  /**
   * Find the task from database with the id specified
   * @param id Identifier of the task
   * @returns The task that you are looking for, or an empty array
   */
  getTaskById(id: string) {
    return this.tasks.find((task) => task.id === id);
  }

  /**
   * Compares a temporal array of task with the original one to
   * determine if there was an deletion in the tasks
   * @param id The id of the task that wants to be deleted
   * @returns If there was an deletion of a task, or if not task with
   * that id was found
   */
  deleteTaskById(id: string): string {
    // Create a temporal array to verify that a task was deleted
    const temporal_tasks = [...this.tasks];
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return this.tasks.length == temporal_tasks.length
      ? 'Not Found'
      : 'Deleted correcly';
  }

  /**
   * Method to updated the status of a task,
   * First find the task and then updated it.
   * @param body Has the id of the task and the new status
   * @returns A task updated, or not found if there are any task with that id
   */
  updateTaskStatus(body: UpdateTaskDTO): Task | string {
    const { id, status } = body;
    const taskToUpdate = this.getTaskById(id);
    if (!taskToUpdate) return 'Not found';
    taskToUpdate.status = status;
    return taskToUpdate;
  }

  getTasksWithFilters(filterDTO: GetTasksFilterDTO) {
    const { status, search } = filterDTO;

    // Define a temporal array with all the tasks
    let tasks = this.getAllTasks();

    // Find if there is any task with the status parameter
    if (status) {
      tasks = tasks.filter((task) => task.status == status);
    }

    // Find if there are any task with the search parameters
    // In the title or description
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
      });
    }

    return tasks;
  }
}
