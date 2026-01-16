// src/app/shared/mocks/usuarios.mock.ts

import { Usuario } from "@app/models/gestao-usuario.model";


export const USUARIOS_MOCK: Usuario[] = [
  {
    id: 1,
    nome: 'Emerson de Oliveira Barbosa',
    cpf: '123.456.789-00',
    contato: 'emerson@email.com',
    perfil: 'ADMIN'
  },
  {
    id: 2,
    nome: 'Gabriel Barbosa',
    cpf: '987.654.321-00',
    contato: 'gabriel@email.com',
    perfil: 'GESTOR'
  },
  {
    id: 3,
    nome: 'Ana Souza',
    cpf: '111.222.333-44',
    contato: '(21) 99999-8888',
    perfil: 'USUARIO'
  }
];
