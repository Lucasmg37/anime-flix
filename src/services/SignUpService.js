import ApiService from "./ApiService";

export default class SignUpService {

  static signUp(email, senha, nome) {
    return ApiService.post("Signup",
      {
        email,
        senha,
        nome
      })
  }

}