import { fetchWrapper } from "./fetch-wrapper.js";
import { ProtobufStreamReader } from "./protobuf-stream-reader.js";

type ParsableProtoType<T> = {
    fromBinary(binary: Uint8Array): T
}

export async function readNdgr<T>(url: string, protoType: ParsableProtoType<T>, chunkCallback: (chunk: T) => Promise<void>): Promise<void> {
    console.log("reading", url)
    const ndgrNow = await fetchWrapper(url)
    if (!ndgrNow.ok) throw new Error(`Failed to fetch ${url}: HTTP ${ndgrNow.status} ${ndgrNow.statusText}`)
    const ndgrBody = ndgrNow.body!.getReader()
    const protobufReader = new ProtobufStreamReader()

    while (true) {
        const { value, done } = await ndgrBody.read()
        if (done) {
            break
        }
        console.log("read", value.length)
        protobufReader.addNewChunk(value)
        while (true) {
            const chunk = protobufReader.unshiftChunk()
            if (chunk == null) {
                break
            }
            // for debug
            // console.log(Array.from(chunk).map(x => x.toString(16).padStart(2, "0")).join(""))
            await chunkCallback(protoType.fromBinary(chunk))
        }
    }
}