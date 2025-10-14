export interface ILoginSuccessResponse {
  sucesso: string;
  mensagem: string;
  token: string;
  usuario: {
    id: number;
    login: string;
  };
}
