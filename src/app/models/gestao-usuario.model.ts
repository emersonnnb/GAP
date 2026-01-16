import { StatusEnum } from "@app/shared/enums/status.enum";

export interface Usuario {
    id: number;
    nome: string;
    cpf: string;
    contato: string;
    status: StatusEnum;
    perfil: 'ADMIN' | 'GESTOR' | 'USUARIO';
  }
  