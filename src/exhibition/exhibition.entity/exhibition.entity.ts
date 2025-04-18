import { ArtworkEntity } from 'src/artwork/artwork.entity/artwork.entity';
import { MuseumEntity } from 'src/museum/museum.entity/museum.entity';
import { SponsorEntity } from 'src/sponsor/sponsor.entity.ts/sponsor.entity.ts';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExhibitionEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
 
    @Column()
    name: string;
 
    @Column()
    description: string;

    @ManyToOne(() => MuseumEntity, museum => museum.exhibitions)
    museum: MuseumEntity;

    @OneToMany(() => ArtworkEntity, artwork => artwork.exhibition)
    artworks: ArtworkEntity[];

    @OneToOne(() => SponsorEntity, sponsor => sponsor.exhibition)
    @JoinColumn()
    sponsor: SponsorEntity;

}