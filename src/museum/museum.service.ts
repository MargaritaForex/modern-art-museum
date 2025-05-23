import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MuseumEntity } from './museum.entity/museum.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class MuseumService {

    constructor(
        @InjectRepository(MuseumEntity)
        private readonly museumRepository: Repository<MuseumEntity>
    ){}

    async findAll(): Promise<MuseumEntity[]> {
        return await this.museumRepository.find({ relations: ["artworks", "exhibitions"] });
    }

    async findOne(id: string): Promise<MuseumEntity> {
        const museum = await this.museumRepository.findOne({where: {id}, relations: ["artworks", "exhibitions"] });
        if (!museum) {
            throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
        }
        return museum;
    }

    async create(museum: MuseumEntity): Promise<MuseumEntity> {
        return await this.museumRepository.save(museum);
    }

    async update(id: string, museum: MuseumEntity): Promise<MuseumEntity> {
        const persistedMuseum = await this.museumRepository.findOne({where:{id}});
        if (!persistedMuseum) {
            throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
        }
        return await this.museumRepository.save({...persistedMuseum, ...museum});
    }

    async remove(id: string): Promise<void> {
        const museum = await this.museumRepository.findOne({where:{id}});
        if (!museum)
          throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.museumRepository.remove(museum);
    }
}
