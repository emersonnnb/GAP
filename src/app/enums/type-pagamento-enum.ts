export enum TypePagamentoEnum {
  DINHEIRO = 1,
  PIX = 2,
  CARTAO_DEBITO = 3,
  CARTAO_CREDITO = 4,
}
export type PagamentoEnumType = `${TypePagamentoEnum}`;

export enum TypePagamentoMessageEnum {
  DINHEIRO = "Dinheiro",
  PIX = "Pix",
  CARTAO_DEBITO = "Cartão de Débito",
  CARTAO_CREDITO = "Cartão de Crédito",
}

export const typePagamentoMap: Record<TypePagamentoEnum, TypePagamentoMessageEnum> = { 
  [TypePagamentoEnum.DINHEIRO]: TypePagamentoMessageEnum.DINHEIRO,
  [TypePagamentoEnum.PIX]: TypePagamentoMessageEnum.PIX,
  [TypePagamentoEnum.CARTAO_DEBITO]: TypePagamentoMessageEnum.CARTAO_DEBITO,
  [TypePagamentoEnum.CARTAO_CREDITO]: TypePagamentoMessageEnum.CARTAO_CREDITO,
};
