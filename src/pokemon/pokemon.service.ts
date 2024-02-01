import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/Dto/pagination.Dto';

@Injectable()
export class PokemonService {
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon.save();
    } catch( error ) {
      this.handleException(error) //no puedes crear pokemon chequea db
    }
  }

  async findAll(paginationDto:PaginationDto) {

    const { limit = 20 , offset = 200 } = paginationDto;

    return await this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({
      no:1
    })
    .select('-__v')
  }

  async findOne(term: string) {
    let pokemon:Pokemon;

    // si NO ES UN NUMERO entonces busca por nombre
    pokemon = (!isNaN(+term) ? await this.pokemonModel.findOne({no:term}) 
    : await this.pokemonModel.findOne({name:term.toLocaleLowerCase().trim()}));
    // if (!isNaN(+term) ) {  //Si esto es un numero
    //   pokemon = await this.pokemonModel.findOne({no:term});
    // } else {
      //   pokemon = await this.pokemonModel.findOne({name:term.toLocaleLowerCase().trim()});
      // }
    // return pokemon;

    //verificacion por mongoID
    if(isValidObjectId( term )) pokemon = await this.pokemonModel.findById(term);
    //verificacion por name
    // if (!pokemon) pokemon = await this.pokemonModel.findOne({name:term.toLocaleLowerCase().trim()});
    //si el pokemon no existe
    if (!pokemon) throw new NotFoundException (`Pokemon with id, name or numero( no )"${term}" not found`); // el Id y nombre no ah sido encontrado
    // if (!pokemon) throw new BadRequestException(`Pokemon with id, name or no "${term}" not found`);
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    try {
      const pokemon = await this.findOne( term );
      if ( updatePokemonDto.name ) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
      // Verificar si hay otro Pokémon con el mismo nombre
      const existingPokemon = await this.pokemonModel.findOne({ name: updatePokemonDto.name });
      if (existingPokemon && existingPokemon.id !== pokemon.id)
      throw new BadRequestException(`Ya existe un Pokémon con el nombre "${updatePokemonDto.name}" en la base de datos.`);
      console.log(existingPokemon)

      await pokemon.updateOne( updatePokemonDto, {new: true});
      //sirve para exparsir las propiedades y luego sobre-escribirlas
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    
    } catch(error) {
      this.handleException( error   );
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne( id )
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete( id );
    const { deletedCount } = await this.pokemonModel.deleteOne({_id: id})
    if (deletedCount === 0) 
    throw new BadRequestException(`Pokemon with id "${id}" not found`);
    
    return {deletedCount};
  }
//Esta es un escepcion no controlada
  private handleException(error: any) {
    if(error.code === 11000) {
      throw new BadRequestException(`El numero( no ) de pokemon ya existe en db ${ JSON.stringify(error.keyValue)}`)
    }
    console.log(Error);
    throw new InternalServerErrorException('Can not update pokemon - Check server logs');
  }
}
// async update(term: string, updatePokemonDto: UpdatePokemonDto) {
//     try {
//         const pokemon = await this.findOne(term);

//         if (updatePokemonDto.name) {
//             updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
//         }

//         // Verificar si hay otro Pokémon con el mismo nombre
//         const existingPokemon = await this.pokemonModel.findOne({ name: updatePokemonDto.name });
//         if (existingPokemon && existingPokemon.id !== pokemon.id) {
//             throw new BadRequestException(`Ya existe un Pokémon con el nombre "${updatePokemonDto.name}" en la base de datos.`);
//         }

//         await pokemon.updateOne(updatePokemonDto, { new: true });

//         return { ...pokemon.toJSON(), ...updatePokemonDto };
//     } catch (error) {
//         if (error instanceof BadRequestException) {
//             throw error;
//         } else if (error.code === 11000) {
//             throw new BadRequestException(`El número (no) de Pokémon ya existe en la base de datos: ${JSON.stringify(error.keyValue)}`);
//         } else {
//             console.error(error);
//             throw new InternalServerErrorException('No se puede actualizar el Pokémon - Consulta los registros del servidor.');
//         }
//     }
// }

