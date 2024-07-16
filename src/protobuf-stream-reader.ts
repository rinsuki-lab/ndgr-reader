export class ProtobufStreamReader {
    private buffer = new Uint8Array()

    constructor() {
    }

    addNewChunk(chunk: Uint8Array) {
        const oldBuffer = this.buffer
        this.buffer = new Uint8Array(chunk.byteLength + this.buffer.byteLength)
        this.buffer.set(oldBuffer)
        this.buffer.set(chunk, oldBuffer.byteLength)
    }

    readVarint() {
        let offset = 0
        let result = 0
        let i = 0
        while (true) {
            if (offset >= this.buffer.length) {
                return null // not enough data
            }
            const current = this.buffer[offset]
            result = result | (current & 0x7F) << i
            offset++
            i += 7
            if (!(current & 0x80)) {
                break
            }
        }
        return [offset, result] as const
    }

    unshiftChunk() {
        const varintResult = this.readVarint()
        if (varintResult == null) return
        const [offset, varint] = varintResult
        if (offset + varint > this.buffer.length) {
            // not enough data
            console.log(`needs ${offset + varint} bytes, but only ${this.buffer.length} bytes`)
            return
        }
        const message = this.buffer.subarray(offset, offset + varint)
        this.buffer = this.buffer.subarray(offset + varint)
        return message
    }
}