export enum StatusEnum {
  ATIVO = 'A',
  INATIVO = 'I'
}

export type StatusType = `${StatusEnum}`;

export enum StatusMessageEnum {
  ATIVO = 'Ativo',
  INATIVO = 'Inativo'
}

export const statusMap: Record<StatusEnum, StatusMessageEnum> = {
  [StatusEnum.ATIVO]: StatusMessageEnum.ATIVO,
  [StatusEnum.INATIVO]: StatusMessageEnum.INATIVO
};
