import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  placa: string;

  @Column()
  chassi: string;

  @Column()
  renavam: string;

  @Column()
  modelo: string;

  @Column()
  marca: string;

  @Column()
  ano: number;
}
