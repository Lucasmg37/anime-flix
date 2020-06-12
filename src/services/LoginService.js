import ApiService from "./ApiService";

export default class LoginService {
  static login(email, senha) {
    return ApiService.post("Login", {
      email,
      senha
    })
  }

}