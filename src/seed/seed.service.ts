import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  // D esta forma traes una api a la base de datos
  private readonly axios: AxiosInstance = axios;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http:AxiosAdapter
  ) {}

  async executeSeed() {
    // Diferentes formas de insertar datos
    //Promesas
    try {
      await this.pokemonModel.deleteMany({})
      const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
      const pokemonToInsert:{ name:string , no:Number }[]=[]
      
      data.results.forEach(async ({ name, url }) => {
        const segments = url.split('/');
        const no: number = +segments[segments.length - 2]
        pokemonToInsert.push({name, no})
      })
      await this.pokemonModel.insertMany(pokemonToInsert)
      return 'Seed Executed'
    } catch (error) {
      this.handleException(error);
    }
  }
  private handleException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`El numero( no ) de pokemon ya existe en db ${JSON.stringify(error.keyValue)}`)
    }
    console.log(Error);
    throw new InternalServerErrorException('Can not update pokemon - Check server logs');
  }
}
