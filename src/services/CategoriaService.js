import ApiService from "./ApiService";

export default class CategoriaService {

  static getCategorias() {
    return ApiService.get("Categoria")
  }

  static getTopGlobal(numbers) {
    return ApiService.get("Categoria/getTopGlobal/" + numbers)
  }

}