import ApiService from "./ApiService";

export default class EpisodeService {

  static getEpisodes(anime) {
    return ApiService.get("Episode", {
      params: {
        anime
      }
    })
  }

  static getNew() {
    return ApiService.get("Episode/new")
  }

  static saveAccessEpisode(id) {
    return ApiService.post("Episode/saveAccessEpisode/" + id)
  }

}