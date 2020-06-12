import ApiService from "./ApiService";

export default class UserService {

  static getUser() {
    return ApiService.get("Usuario")
  };

}