/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRespository extends Repository<Task> {
  /**
   * Method to initialize the task variable based on the information of the post http request
   * @Input Body request with the format of the task
   * @returns Task in the correct format
   */
  async createTask(body: CreateTaskDTO): Promise<Task> {
    // Get parameters from the body
    const { title, description } = body;

    // Create the instance of the object
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    //Save in database and return the object
    await this.save(task);
    return task;
  }

  async getTasks(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
    // extract the data of the body request
    const { status, search } = filterDTO;

    // Create the query of all tasks
    const query = this.createQueryBuilder('task');

    // If there are condition in the search or the status, applied to the query
    if (status) query.andWhere('task.status = :status', { status });

    if (search)
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );

    // Execute the query and store all the tasks
    const tasks = await query.getMany();

    return tasks;
  }
}
