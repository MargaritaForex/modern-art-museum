import { ArtistEntity } from 'src/artist/artist.entity.ts/artist.entity.ts';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MovementEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
 
    @Column()
    name: string;
 
    @Column()
    description: string;
   
    @Column()
    countryOfOrigin: string;

    @ManyToMany(() => ArtistEntity, artist => artist.movements)
    @JoinTable()
    artists: ArtistEntity[];
}