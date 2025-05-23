/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MuseumService } from './museum.service';
import { faker } from '@faker-js/faker';
import { MuseumEntity } from './museum.entity/museum.entity';

describe('MuseumService', () => {
  let service: MuseumService;
  let repository: Repository<MuseumEntity>;
  let museumsList: MuseumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MuseumService],
    }).compile();

    service = module.get<MuseumService>(MuseumService);
    repository = module.get<Repository<MuseumEntity>>(getRepositoryToken(MuseumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    museumsList = [];
    for(let i = 0; i < 5; i++){
        const museum: MuseumEntity = await repository.save({
        name: faker.company.name(), 
        description: faker.lorem.sentence(), 
        address: faker.location.streetAddress(), 
        city: faker.location.city(), 
        image: faker.image.url()})
        museumsList.push(museum);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all museums', async () => {
    const museums: MuseumEntity[] = await service.findAll();
    expect(museums).not.toBeNull();
    expect(museums).toHaveLength(museumsList.length);
  });

  it('findOne should return a museum by id', async () => {
    const storedMuseum: MuseumEntity = museumsList[0];
    const museum: MuseumEntity = await service.findOne(storedMuseum.id);
    expect(museum).not.toBeNull();
    expect(museum.name).toEqual(storedMuseum.name)
    expect(museum.description).toEqual(storedMuseum.description)
    expect(museum.address).toEqual(storedMuseum.address)
    expect(museum.city).toEqual(storedMuseum.city)
    expect(museum.image).toEqual(storedMuseum.image)
  });

  it('findOne should throw an exception for an invalid museum', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The museum with the given id was not found")
  });

  it('create should return a new museum', async () => {
    const museum: MuseumEntity = {
      id: "",
      name: faker.company.name(), 
      description: faker.lorem.sentence(), 
      address: faker.location.streetAddress(), 
      city: faker.location.city(), 
      image: faker.image.url(),
      exhibitions: [],
      artworks: []
    }

    const newMuseum: MuseumEntity = await service.create(museum);
    expect(newMuseum).not.toBeNull();

    const storedMuseum = await repository.findOne({where: {id: newMuseum.id}})
    expect(storedMuseum).not.toBeNull();
    if (storedMuseum) {
      expect(storedMuseum.name).toEqual(newMuseum.name)
      expect(storedMuseum.description).toEqual(newMuseum.description)
      expect(storedMuseum.address).toEqual(newMuseum.address)
      expect(storedMuseum.city).toEqual(newMuseum.city)
      expect(storedMuseum.image).toEqual(newMuseum.image)
    }
  });

  it('update should modify a museum', async () => {
    const museum: MuseumEntity = museumsList[0];
    museum.name = "New name";
    museum.address = "New address";
  
    const updatedMuseum: MuseumEntity = await service.update(museum.id, museum);
    expect(updatedMuseum).not.toBeNull();
  
    const storedMuseum = await repository.findOne({ where: { id: museum.id } })
    expect(storedMuseum).not.toBeNull();
    if (storedMuseum) {
      expect(storedMuseum.name).toEqual(museum.name)
      expect(storedMuseum.address).toEqual(museum.address)
    }
  });

  it('update should throw an exception for an invalid museum', async () => {
    let museum: MuseumEntity = museumsList[0];
    museum = {
      ...museum,
      name: "New name",
      address: "New address"
    }
    await expect(() => service.update("0", museum)).rejects.toHaveProperty("message", "The museum with the given id was not found")
  });

  it('delete should remove a museum', async () => {
    const museum: MuseumEntity = museumsList[0];
    await service.remove(museum.id);
  
    const storedMuseum = await repository.findOne({ where: { id: museum.id } })
    expect(storedMuseum).toBeNull();
  });

  it('delete should throw an exception for an invalid museum', async () => {
    await expect(() => service.remove("0")).rejects.toHaveProperty("message", "The museum with the given id was not found")
  });
});