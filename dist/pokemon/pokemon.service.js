"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pokemon_entity_1 = require("./entities/pokemon.entity");
let PokemonService = class PokemonService {
    constructor(pokemonModel, configService) {
        this.pokemonModel = pokemonModel;
        this.configService = configService;
        this.defaultLimit = configService.get('defaultLimit');
    }
    async create(createPokemonDto) {
        createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
        try {
            const pokemon = await this.pokemonModel.create(createPokemonDto);
            return pokemon.save();
        }
        catch (error) {
            this.handleException(error);
        }
    }
    async findAll(paginationDto) {
        const { limit = this.defaultLimit, offset = 0 } = paginationDto;
        return await this.pokemonModel.find()
            .limit(limit)
            .skip(offset)
            .sort({
            no: 1
        })
            .select('-__v');
    }
    async findOne(term) {
        let pokemon;
        pokemon = (!isNaN(+term) ? await this.pokemonModel.findOne({ no: term })
            : await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() }));
        if ((0, mongoose_2.isValidObjectId)(term))
            pokemon = await this.pokemonModel.findById(term);
        if (!pokemon)
            throw new common_1.NotFoundException(`Pokemon with id, name or numero( no )"${term}" not found`);
        return pokemon;
    }
    async update(term, updatePokemonDto) {
        try {
            const pokemon = await this.findOne(term);
            if (updatePokemonDto.name)
                updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
            const existingPokemon = await this.pokemonModel.findOne({ name: updatePokemonDto.name });
            if (existingPokemon && existingPokemon.id !== pokemon.id)
                throw new common_1.BadRequestException(`Ya existe un Pokémon con el nombre "${updatePokemonDto.name}" en la base de datos.`);
            console.log(existingPokemon);
            await pokemon.updateOne(updatePokemonDto, { new: true });
            return { ...pokemon.toJSON(), ...updatePokemonDto };
        }
        catch (error) {
            this.handleException(error);
        }
    }
    async remove(id) {
        const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
        if (deletedCount === 0)
            throw new common_1.BadRequestException(`Pokemon with id "${id}" not found`);
        return { deletedCount };
    }
    handleException(error) {
        if (error.code === 11000) {
            throw new common_1.BadRequestException(`El numero( no ) de pokemon ya existe en db ${JSON.stringify(error.keyValue)}`);
        }
        console.log(Error);
        throw new common_1.InternalServerErrorException('Can not update pokemon - Check server logs');
    }
};
exports.PokemonService = PokemonService;
exports.PokemonService = PokemonService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pokemon_entity_1.Pokemon.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], PokemonService);
//# sourceMappingURL=pokemon.service.js.map