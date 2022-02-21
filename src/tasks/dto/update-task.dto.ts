/* eslint-disable prettier/prettier */

import { BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../tasks.model';

export class UpdateTaskDTO {
  id: string;
  status: TaskStatus;

  validStatus: TaskStatus[] = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];
  constructor(id: string, status: TaskStatus) {
    //Check if the status is valid
    if (!this.validStatus.includes(status))
      throw new BadRequestException(
        'The status has to be one of this 3 arguments: 1. DONE, 2. IN_PROGRESS, 3. OPEN',
      );
    this.status = status;
    this.id = id;
  }
}
