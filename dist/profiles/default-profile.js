import { UniDownloadHttpClientHandler, UniRequestHttpClientHandler, UniUploadHttpClientHandler } from "../handlers/uni-handler";
export let defaultProfile = {
    request: new UniRequestHttpClientHandler(),
    upload: new UniUploadHttpClientHandler(),
    download: new UniDownloadHttpClientHandler()
};
//# sourceMappingURL=default-profile.js.map