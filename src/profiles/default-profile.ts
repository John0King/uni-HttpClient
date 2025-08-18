import { UniDownloadHttpClientHandler, UniRequestHttpClientHandler, UniUploadHttpClientHandler } from "../handlers/uni-handler";
import type { HandlerProfiles } from "../options";

export let defaultProfile :HandlerProfiles = {
    request: new UniRequestHttpClientHandler(),
    upload: new UniUploadHttpClientHandler(),
    download: new UniDownloadHttpClientHandler()
}
