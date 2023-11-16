
const _getBlockedUrl = async (): Promise<string[]> => {
  const l = (await chrome.storage.local.get("url"))["url"] as string[] | null | undefined
  if (!l) {
    setBlockUrl([])
    return new Promise((r, e) => { r([]) })
  }
  return l
}


const main  = async (id: number) => {
  const tab = await chrome.tabs.get(id)
  const url = tab.url
  if(url === undefined){
    return
  }
  const urlParts = url.split("/")
  const website = urlParts[2]
  if(urlParts[0] === "chrome-extension:"){
    return
  }
  console.log("LOG: spliting the current URL",urlParts);
  if(website === undefined){
    return
  }
  for(const siteName of await _getBlockedUrl()){
    if(siteName === website){
      chrome.tabs.update(id,{
        url: "./page/page.html",
      })
      return
    }
  }
}

chrome.tabs.onActivated.addListener((e) => {
  console.log("LOG: running chrome.tabs.onActivated.addListener")
  main(e.tabId)
})
chrome.tabs.onUpdated.addListener((e) =>{
  console.log("LOG: running chrome.tabs.onUpdated.addListener")
  main(e)
})