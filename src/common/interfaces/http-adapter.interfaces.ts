//implementacion de una clase http adapter 
//para que los servicios puedan retornar una respuesta http
export interface HttpAdapter {
  get<T>(url: string): Promise<T>;
}
