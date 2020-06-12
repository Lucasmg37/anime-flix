import ApiService from "./ApiService";

export default class LinkService {

    static getLinks(episode) {
        return ApiService.get("Link", {
            params: {
                episode
            }
        })
    };

    static savePositionView(link, position) {
        return ApiService.post("Link/saveProgress", {
            link,
            position
        })
    };

}