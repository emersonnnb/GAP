export enum ConfirmationMessages {
  EXCLUDE_RECORD = 'A exclusão do registro é irreversível. Deseja prosseguir com a operação?',
  EXIT_FORM_CHANGED = 'Você perderá seus dados se sair sem salvar. Deseja sair?'
}

export enum AffirmationMessages {
  FILTER_REQUIRED = 'Pelo menos um filtro deve ser selecionado.',
  TEXT_FILTER_REQUIRE_MIN_LENGTH = 'O campo deve possuir ao menos 3 caracteres para efetuar a pesquisa.',
  SAVE_SUCCESS = 'Dados salvos com sucesso.',
  EXCLUDE_SUCCESS = 'Dados removidos com sucesso.',
  SYSTEM_UNAVAILABLE = 'Sistema indisponível no momento.',
  SYSTEM_ERROR = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
  NOT_FOUND = 'Registro não encontrado',
  BAD_REQUEST = 'Dados inválidos.',
  DELETE_BAD_REQUEST = 'Ocorreu um erro ao tentar excluir os dados.',
  FORBIDDEN = 'Usuário não tem permissão para acessar esses dados.',
  PROCESSING_FAILURE = 'Falha ao processar a requisição.',
  REQUIRED_FIELDS_NOT_FILLED = 'Campos obrigatórios não preenchidos.',
  REQUIRED_MINIMUM_ITEM = 'É necessário o cadastro de ao menos um item.'
}

export enum ValidationMessages {
  INVALID_EMAIL = 'O e-mail digitado é inválido.',
  ONLY_AWORD = 'O campo não permite apenas uma palavra.',
  ONLY_NUMBERS = 'O campo não permite apenas caracteres numéricos.',
  ONLY_SPECIAL_CHARACTERS = 'O campo não permite apenas caracteres especiais.',
  ONLY_SPECIAL_CHARACTERS_AND_NUMBERS = 'O campo não permite apenas caracteres especiais e numéricos.',
  ONLY_CHARACTER = 'O campo não permite apenas um caractere.',
  DEFAULT = 'O campo não é válido.',
  REQUIRED = 'Campo obrigatório.',
  MIN_LENGTH = 'O campo deve conter no mínimo 3 caracteres.',
  MAX_LENGTH = 'O campo deve conter no máximo 200 caracteres.',
  INVALID_FORM = 'Existem dados inválidos no formulário.',
  INVALID_NAME = 'O campo contém caracteres inválidos.'
}
