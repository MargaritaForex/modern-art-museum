import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtworkEntity } from 'src/artwork/artwork.entity/artwork.entity';
import { MuseumEntity } from 'src/museum/museum.entity/museum.entity';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class MuseumArtworkService {
   constructor(
       @InjectRepository(MuseumEntity)
       private readonly museumRepository: Repository<MuseumEntity>,
   
       @InjectRepository(ArtworkEntity)
       private readonly artworkRepository: Repository<ArtworkEntity>
   ) {}

   async addArtworkMuseum(museumId: string, artworkId: string): Promise<MuseumEntity> {
       const artwork = await this.artworkRepository.findOne({where: {id: artworkId}});
       if (!artwork)
         throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);
     
       const museum = await this.museumRepository.findOne({where: {id: museumId}, relations: ["artworks", "exhibitions"]})
       if (!museum)
         throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
   
       museum.artworks = [...museum.artworks, artwork];
       return await this.museumRepository.save(museum);
     }
   
   async findArtworkByMuseumIdArtworkId(museumId: string, artworkId: string): Promise<ArtworkEntity> {
       const artwork = await this.artworkRepository.findOne({where: {id: artworkId}});
       if (!artwork)
         throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND)
      
       const museum = await this.museumRepository.findOne({where: {id: museumId}, relations: ["artworks"]});
       if (!museum)
         throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND)
  
       const museumArtwork = museum.artworks.find(e => e.id === artwork.id);
  
       if (!museumArtwork)
         throw new BusinessLogicException("The artwork with the given id is not associated to the museum", BusinessError.PRECONDITION_FAILED)
  
       return museumArtwork;
   }
   
   async findArtworksByMuseumId(museumId: string): Promise<ArtworkEntity[]> {
       const museum = await this.museumRepository.findOne({where: {id: museumId}, relations: ["artworks"]});
       if (!museum)
         throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND)
      
       return museum.artworks;
   }
   
   async associateArtworksMuseum(museumId: string, artworks: ArtworkEntity[]): Promise<MuseumEntity> {
       const museum = await this.museumRepository.findOne({where: {id: museumId}, relations: ["artworks"]});
   
       if (!museum)
         throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND)
   
       for (let i = 0; i < artworks.length; i++) {
         const artwork = await this.artworkRepository.findOne({where: {id: artworks[i].id}});
         if (!artwork)
           throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND)
       }
   
       museum.artworks = artworks;
       return await this.museumRepository.save(museum);
     }
   
   async deleteArtworkMuseum(museumId: string, artworkId: string){
       const artwork = await this.artworkRepository.findOne({where: {id: artworkId}});
       if (!artwork)
         throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND)
   
       const museum = await this.museumRepository.findOne({where: {id: museumId}, relations: ["artworks"]});
       if (!museum)
         throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND)
   
       const museumArtwork = museum.artworks.find(e => e.id === artwork.id);
   
       if (!museumArtwork)
           throw new BusinessLogicException("The artwork with the given id is not associated to the museum", BusinessError.PRECONDITION_FAILED)

       museum.artworks = museum.artworks.filter(e => e.id !== artworkId);
       await this.museumRepository.save(museum);
   }  
}
