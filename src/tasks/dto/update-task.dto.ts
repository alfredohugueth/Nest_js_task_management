/* eslint-disable prettier/prettier */

import { TaskStatus } from '../tasks.model';

export class UpdateTaskDTO {
  id: string;
  status: TaskStatus;

  constructor(id: string, status: TaskStatus) {
    this.id = id;
    this.status = status;
  }
}
