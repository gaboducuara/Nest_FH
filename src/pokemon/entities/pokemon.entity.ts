
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
// para que pokemon sea un documento se tiene 
// que extender de 
@Schema()
export class Pokemon extends Document{
  @Prop({
    unique:true,
    index:true,
  })
  name: string;
  @Prop({
    unique:true,
    index:true,
  })
  no:number; //Numero de pokemon
}
//exportar el schema para que sea visible en la api
export const PokemonSchema = SchemaFactory.createForClass(Pokemon)
