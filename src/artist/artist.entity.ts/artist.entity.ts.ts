import { ArtworkEntity } from 'src/artwork/artwork.entity.ts/artwork.entity.ts';
import { MovementEntity } from 'src/movement/movement.entity.ts+/movement.entity.ts+';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ArtistEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
 
    @Column()
    name: string;
 
    @Column()
    birthplace: string;
 
    @Column()
    birthdate: Date;
 
    @Column()
    image: string;

    @OneToMany(() => ArtworkEntity, artwork => artwork.artist)
    artworks: ArtworkEntity[];

    @ManyToMany(() => MovementEntity, movement => movement.artists)
    movements: MovementEntity[];
}