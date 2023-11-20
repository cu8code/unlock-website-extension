export type windowObj = {
    windowId: number,
    allowedWebsiteThatAreInBlockList: string[]
}

export const setWindowUnblockedUrlObj = async (i: windowObj[]) => {
    const s = new Set(i)
    i = Array.from(s)
    const l = (await chrome.storage.session.set({
        "unblockedUrl": i
    }))
}

export const getWindowUnblockedUrlObj = async (): Promise<windowObj[]> => {
    const l = (await chrome.storage.session.get("unblockedUrl"))["unblockedUrl"] as windowObj[] | null | undefined
    if (!l) {
        await setWindowUnblockedUrlObj([])
        return new Promise((r, e) => { r([]) })
    }
    return l
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

export type TempCash = {
    tabId: number,
    originalUrl: string
}

export const setTempCash = async (e: TempCash) => {
    let cash = await getTempCash()
    if (!cash) {
        cash = []
    }
    console.log(cash, e);
    cash.push(e)
    chrome.storage.session.set({
        "temp": cash
    })
}
export const getTempCash = async () => {
    return (await chrome.storage.session.get("temp"))["temp"] as TempCash[] | undefined | null
}

export const getUnBlockedID = async () => {
    return (await chrome.storage.session.get("blockedId"))["blockedId"] as number[] | undefined | null
}

export const setNewUnblockedID = async (id: number) => {
    let url = await getUnBlockedID()
    if (!url) {
        url = []
    }
    return chrome.storage.session.set({ "blockedId": [id, ...url] })
}

export const extractUrl = (e: string) => {
    const parts = e.split("/")
    const url = parts[2]
    return url
}