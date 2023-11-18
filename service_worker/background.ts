import { getBlockedUrl, setBlockUrl, getUnblockedUrl } from "../common/common.js"

const e = new Map<number, string>()
const u: number[] = []

const resetDb = () => {
  setBlockUrl([])
}

const extractUrl = (e: string) => {
  const parts = e.split("/")
  const url = parts[2]
  return url
}

const isInUnblocked = async (tabId: number): Promise<boolean> => {
  console.log("LOG: running isInUnblocked on tabid", tabId);

  const unblockedObj = await getUnblockedUrl()
  console.log("DEBUG:", unblockedObj);

  const tab = await chrome.tabs.get(tabId)
  console.log("LOG: running chrome.tabs.onActivated.addListener")
  for (const i of unblockedObj) {
    if (tab.windowId === i.windowId) {
      const url = tab.url
      if (!url) {
        throw new Error("url not found");
      }
      for (const ur of i.allowedWebsite) {
        const u = extractUrl(url)
        if (!u) {
          throw new Error("invalid value of u");
        }
        if (ur === u) {
          console.log("LOG: skip tab", e);
          return true
        }
      }
    }
  }
  return false
}

const main = async (id: number) => {
  const tab = await chrome.tabs.get(id)
  const url = tab.url
  if (url === undefined) {
    return
  }
  const urlParts = url.split("/")
  const website = urlParts[2]
  if (urlParts[0] === "chrome-extension:") {
    return
  }
  console.log("LOG: spliting the current URL", urlParts);
  if (website === undefined) {
    return
  }
  for (const siteName of await getBlockedUrl()) {
    if (siteName === website) {
      chrome.tabs.update(id, {
        url: "./page/page.html",
      })
      e.set(id, url)
      return
    }
  }
}

chrome.runtime.onMessage.addListener(async (m, s, r) => {
  console.log("LOG:message revided", s.tab?.id);

  if (m === "ok") {
    const id = s.tab?.id
    const winId = s.tab?.windowId
    if (!winId) {
      throw new Error("window id not found");
    }
    if (!id) {
      throw new Error("id not found")
    }
    const url = e.get(id)
    if (!url) {
      throw new Error("id dose not exist in db");
    }
    chrome.tabs.update(id, {
      url: url
    })
    u.push(winId)
    e.delete(id)
  }
})

chrome.tabs.onActivated.addListener(async (e) => {
  const unblockedObj = await getUnblockedUrl()
  console.log("LOG: running chrome.tabs.onActivated.addListener")
  if (await isInUnblocked(e.tabId)) {
    console.log("LOG: skiping current tab", e);
    return
  }
  main(e.tabId)
})

chrome.tabs.onUpdated.addListener(async (e) => {
  console.log("LOG: running chrome.tabs.onUpdated.addListener")
  if (await isInUnblocked(e)) {
    console.log("LOG: skiping current tab", e)
    return
  }
  main(e)
})