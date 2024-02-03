import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema
    }),
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    //Estableciendo conexion a la base de datos
    MongooseModule.forRoot( 'mongodb+srv://NestApiRest_pokemondb:HSChCFw6Vg8xFp1a@cluster0.hy1eh0u.mongodb.net/nest-pokemon' ),
    
    PokemonModule,
    
    CommonModule,
    
    SeedModule
  ],
})
export class AppModule {}
