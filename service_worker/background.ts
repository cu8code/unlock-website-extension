const e = new Map<number, string>()
const u: number[] = []

const getBlockedUrl = async (): Promise<string[]> => {
  const l = (await chrome.storage.local.get("url"))["url"] as string[] | null | undefined
  if (!l) {
    setBlockUrl([])
    return new Promise((r, e) => { r([]) })
  }
  return l
}

const setBlockUrl = async (e: string[]) => {
  const s = new Set<string>(e)
  e = Array.from(s)
  await chrome.storage.local.set({
    "url": e
  })
}

const resetDb = () => {
  setBlockUrl([])
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
    if(!winId){
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

chrome.tabs.onActivated.addListener((e) => {
  console.log("LOG: running chrome.tabs.onActivated.addListener")
  for(const i of u){
    if(i === e.windowId){
      console.log("LOG: skip tab",e.tabId);
      return
    }
  }
  main(e.tabId)
})

chrome.tabs.onUpdated.addListener(async (e) => {
  console.log("LOG: running chrome.tabs.onUpdated.addListener")
  const tab = await chrome.tabs.get(e)
  for(const i of u){
    if(i === tab.windowId){
      console.log("LOG: skip tab",e);
      return
    }
  }
  main(e)
})