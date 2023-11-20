import {
  getBlockedUrl,
  setBlockUrl,
  getWindowUnblockedUrlObj,
  setWindowUnblockedUrlObj,
  setTempCash,
  getTempCash,
  getUnBlockedID,
  setNewUnblockedID,
  extractUrl
} from "../common/common.js"

const e = new Map<number, string>()

const resetDb = () => {
  setBlockUrl([])
}

const isTabUnblocked = async (tabId: number): Promise<boolean> => {
  console.log("LOG: running isInUnblocked on tabid", tabId);
  const tab = await chrome.tabs.get(tabId)
  
  if(tab.url?.split("/")[0] === "chrome-extension:"){
    console.log("FIRE");
    return true
  }
  let unBlockedWindowId = await getUnBlockedID()
  console.log(unBlockedWindowId);
  
  if (!unBlockedWindowId) {
    unBlockedWindowId = []
  }
  for (const id of unBlockedWindowId) {
    console.log("LOG:",id,tab.windowId);
    
    if (tab.windowId === id) {
      console.log("LOG: current window is unblocked",tab.url);
      return true
    }
  }
  if (!tab.url) {
    console.log("ERROR: no url property found")
    return true
  }
  const taburl = extractUrl(tab.url)
  for (const url of await getBlockedUrl()) {
    if (taburl === url) {
      return false
    }
  }
  return true
}

const main = async (id: number) => {
  const tab = await chrome.tabs.get(id)
  if (!(await isTabUnblocked(id))) {
    chrome.tabs.update(id, {
      url: "page/page.html"
    })
    const url = tab.url
    if (!url) {
      return
    }
    const tabUrl = extractUrl(url)
    if (!tabUrl) {
      return
    }
    setTempCash({
      tabId: id,
      originalUrl: url
    })
  }
}

chrome.runtime.onMessage.addListener(async (m, s, r) => {
  console.log("LOG:message revided", s.tab?.id);
  if (m === "ok") {
    const id = s.tab?.id
    const winId = s.tab?.windowId
    let temp = await getTempCash()
    if (!temp) {
      console.log("LOG: no temp");
      temp = []
    }
    if (!winId) {
      throw new Error("window id not found");
    }
    if (!id) {
      throw new Error("id not found")
    }
    for (const i of temp) {
      if (i.tabId === id) {
        chrome.tabs.update(id, {
          url: i.originalUrl
        })
        setNewUnblockedID(winId)
        console.log(await getUnBlockedID());
      }
    }
  }
})

chrome.tabs.onActivated.addListener(async (e) => {
  console.log("LOG: running chrome.tabs.onActivated.addListener")
  main(e.tabId)
})

chrome.tabs.onUpdated.addListener(async (e) => {
  console.log("LOG: running chrome.tabs.onUpdated.addListener")
  main(e)
})