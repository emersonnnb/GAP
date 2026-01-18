import { StatusEnum } from '@app/shared/enums/status.enum';

export interface UsuarioModel {
  id: number;
  nome: string;
  cpf: string;
  contato: string;
  status: StatusEnum;
  perfil: 'ADMIN' | 'GESTOR' | 'USUARIO';
  senha: string;
}

export interface ClienteModel {
  id: number;
  nome: string;
  cpf: string;
  contato: string;
  email: string;
  convenio: StatusEnum;
  vl_debito: number;
  saldo: number;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string;  
}


export interface CepModel {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service?: string;
}
