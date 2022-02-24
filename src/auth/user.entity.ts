/* eslint-disable prettier/prettier */
import { Task } from 'src/tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @OneToMany((__type) => Task, (task) => task.user, { eager: true })
  tasks: Task[]; // Eager true will fetch automatically the tasks when consulting an user
}
