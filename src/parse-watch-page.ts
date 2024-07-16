import { JSDOM } from "jsdom"
import z from "zod"
import { fetchWrapper } from "./fetch-wrapper.js"

const zWatchPageEmbeddedData = z.object({
    temporaryMeasure: z.object({
        ndgrProgramCommentViewUri: z.string(),
    })
})

export async function parseWatchPage(liveId: string) {
    if (!/^kl[0-9]+$/.test(liveId)) throw new Error("invalid liveId")
    const watchPageResponse = await fetchWrapper("https://live.nicovideo.jp/rekari/" + liveId)
    if (!watchPageResponse.ok) throw new Error(`Failed to fetch watch page: HTTP ${watchPageResponse.status} ${watchPageResponse.statusText}`)
    const watchPageText = await watchPageResponse.text()
    const watchPageDOM = new JSDOM(watchPageText)
    const watchPageEmbeddedDataElm = watchPageDOM.window.document.getElementById("embedded-data")
    if (watchPageEmbeddedDataElm == null) throw new Error("Failed to find embedded-data from watch page")
    if (watchPageEmbeddedDataElm.dataset.props == null) throw new Error("Failed to find props from embedded-data")
    const watchPageEmbeddedData = JSON.parse(watchPageEmbeddedDataElm.dataset.props)
    return zWatchPageEmbeddedData.parse(watchPageEmbeddedData)
}