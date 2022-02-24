import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskRespository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
/**
 * Service that manage the database actions to get, create, update or delete a task
 */
export class TasksService {
  constructor(
    @InjectRepository(TaskRespository) private tasksRepository: TaskRespository,
  ) {}

  /**
   *  Method to get all the tasks from the database
   **  Output: Tasks[], an array of tasks
   */
  getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDTO, user);
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
  createTask(body: CreateTaskDTO, user: User): Promise<Task> {
    return this.tasksRepository.createTask(body, user);
  }

  /**
   * Find the task from database with the id specified
   * @param id Identifier of the task
   * @returns The task that you are looking for, or an empty array
   */
  async getTaskById(id: string, user: User): Promise<Task> {
    // Try to get a task
    const found = await this.tasksRepository.findOne({ where: { id, user } });

    // If not found, throw an error (404 not found)
    if (!found) {
      throw new NotFoundException(`Task with Id ${id} not found`);
    }

    // Otherwise, return the found task
    return found;
  }

  /**
   * Compares a temporal array of task with the original one to
   * determine if there was an deletion in the tasks
   * @param id The id of the task that wants to be deleted
   * @returns If there was an deletion of a task, or if not task with
   * that id was found
   */
  async deleteTaskById(id: string, user: User): Promise<string> {
    // Delete a task given his id
    const found = await this.tasksRepository.delete({ id, user });

    // If affected is equal to 0, that means that there is not
    // A task with that specific id
    if (found.affected == 0)
      throw new NotFoundException(`Task with ID ${id} not found`);

    return 'Deleted correcly';
  }

  /**
   * Method to updated the status of a task,
   * First find the task and then updated it.
   * @param body Has the id of the task and the new status
   * @returns A task updated, or not found if there are any task with that id
   */
  async updateTaskStatus(body: UpdateTaskDTO, user: User): Promise<Task> {
    const { id, status } = body;

    // Get the task to update it, if not found return an 404 error
    const taskToUpdate = await this.getTaskById(id, user);
    taskToUpdate.status = status;

    // Save the change of status
    await this.tasksRepository.save(taskToUpdate);

    return taskToUpdate;
  }
}
