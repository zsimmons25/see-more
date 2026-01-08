  import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

  @Entity('products')
  export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    brand: string;

    @Column()
    manufacturer: string;

    @Column()
    price: number;

    @Column({ nullable: true })
    image: string;

    @Column()
    category: string;
    
    @Column('text')
    description: string;
  }