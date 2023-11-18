export type unblockedUrl = {
    windowId: number,
    allowedWebsite: string[]
}

export const setUnblockedUrl = async (i: unblockedUrl[]) => {
    const s = new Set(i)
    i = Array.from(s)
    const l = (await chrome.storage.session.set({
        "unblockedUrl": i
    }))
}

export const getBlockedUrl = async (): Promise<string[]> => {
    const l = (await chrome.storage.local.get("url"))["url"] as string[] | null | undefined
    if (!l) {
        setBlockUrl([])
        return new Promise((r, e) => { r([]) })
    }
    return l
}

export const setBlockUrl = async (e: string[]) => {
    const s = new Set<string>(e)
    e = Array.from(s)
    await chrome.storage.local.set({
        "url": e
    })
}
export const getUnblockedUrl = async (): Promise<unblockedUrl[]> => {
    const l = (await chrome.storage.session.get("unblockedUrl"))["unblockedUrl"] as unblockedUrl[] | null | undefined
    if (!l) {
        setUnblockedUrl([])
        return new Promise((r, e) => { r([]) })
    }
    return l
}