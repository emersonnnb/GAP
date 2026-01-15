export interface Usuario {
    id: number;
    nome: string;
    cpf: string;
    contato: string;
    perfil: 'ADMIN' | 'GESTOR' | 'USUARIO';
  }
  