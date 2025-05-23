/* eslint-disable prettier/prettier */

import { ArtworkEntity } from 'src/artwork/artwork.entity/artwork.entity';
import { ExhibitionEntity } from 'src/exhibition/exhibition.entity/exhibition.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MuseumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  image: string;

  @OneToMany(() => ExhibitionEntity, exhibition => exhibition.museum)
  exhibitions: ExhibitionEntity[];

  @OneToMany(() => ArtworkEntity, artwork => artwork.museum)
  artworks: ArtworkEntity[];
}
