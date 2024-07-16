import { acquireNdgrViewUrl } from "./acquire-ndgr-view-url.js";
import { parseWatchPage } from "./parse-watch-page.js";
import { ChunkedEntry, ChunkedEntry_ReadyForNext, ChunkedMessage } from "./pb/dwango/nicolive/chat/service/edge/payload_pb.js";
import { readNdgr } from "./read-ndgr.js";

const watchPageData = await parseWatchPage("kl1")
const ndgrViewUrl = await acquireNdgrViewUrl(watchPageData.temporaryMeasure.ndgrProgramCommentViewUri)

let readyForNext: ChunkedEntry_ReadyForNext | undefined
let isFirstTime = true
const alreadyKnowSegments = new Set<string>()
while (true) {
    let at
    if (readyForNext != null) {
        at = readyForNext.at.toString()
    } else if (isFirstTime) {
        at = "now"
        isFirstTime = false
    }
    readyForNext = undefined
    await readNdgr(ndgrViewUrl + "?at=" + at, ChunkedEntry, async entry => {
        switch (entry.entry.case) {
            case "next":
                if (readyForNext != null) throw new Error("duplicated ReadyForNext")
                readyForNext = entry.entry.value
                break
            case "segment":
                if (!alreadyKnowSegments.has(entry.entry.value.uri)) {
                    alreadyKnowSegments.add(entry.entry.value.uri)
                    await readNdgr(entry.entry.value.uri, ChunkedMessage, async entry => {
                        console.log(entry.toJson())
                    })
                }
                break
            default:
                // console.log(entry.toJson())
        }
    })

}