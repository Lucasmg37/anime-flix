import ApiService from "./ApiService";

export default class AnimeService {

  static getAnimes(nome, categorias = [], page = 1) {
    return ApiService.get("Anime", {
      params: {
        nome,
        page,
        categorias
      }
    })
  };

  static getAnime(id) {
    return ApiService.get("Anime/" + id);
  }

  static getImages() {
    return ApiService.get("Capa/");
  }

  static getNew() {
    return ApiService.get("Anime/new/");
  }

  static getRecents() {
    return ApiService.get("Anime/recentsUser/");
  }


  static getTop(categoria = '') {
    return ApiService.get("Anime/topAnimes/" + categoria);
  }


}