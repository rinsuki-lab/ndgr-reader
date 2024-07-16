import z from "zod"
const zAcquireNdgrViewUrl = z.object({
    view: z.string()
})

export async function acquireNdgrViewUrl(url: string) {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch comment view url: HTTP ${response.status} ${response.statusText}`)
    const json = await response.json()
    return zAcquireNdgrViewUrl.parse(json).view
}