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

const createListView = (target: HTMLTableElement, e: string[]) => {
    console.log("LOG: running createListView");
    target.innerHTML = ``
    const createTd = (e: string) => {
        const d = document.createElement("template")
        d.innerHTML = `
        <tr>
            <td>
                ${e}
            </td>
        </tr>
    `
        return d
    }
    const s = new Set(e)
    s.forEach(e => {
        target.append(
            createTd(e).content.cloneNode(true)
        )
    })
    if (s.size <= 0) {
        target.innerHTML = `
            <h2>add your website</h2>
        `
    }
}

const getCurrentUrl = async () => {
    const tabs = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    })
    const tab = tabs[0]
    if (!tab) {
        console.log("LOG: no tab was found");
        return ""
    }
    const url = tab?.url
    if (!url) {
        console.log("LOG: no url was found");
        return ""
    }
    return url
}

(async () => {
    console.log("LOG: running async init");

    const addButton = document.querySelector("#add") as HTMLButtonElement | null
    const removeButton = document.querySelector("#remove") as HTMLButtonElement | null
    const table = document.querySelector("table")

    if (table === null) {
        throw new Error("no target table found");
    }
    if (addButton === null) {
        throw new Error("add button not found");
    }
    if (removeButton === null) {
        throw new Error("remove button not found");
    }

    addButton.onclick = async (e) => {
        console.log("LOG: running addbutton.onclick event");
        const url = await getCurrentUrl()
        const urls = await getBlockedUrl()
        console.log(urls);
        const urlParts = url.split("/")
        if (urlParts[0] === "chrome-extension") {
            return
        }
        const websiteLink = urlParts[2]
        if (websiteLink === undefined) {
            return
        }
        setBlockUrl([...urls, websiteLink])
        createListView(table, await getBlockedUrl())
    }

    removeButton.onclick = async (e) => {
        console.log("LOG: running removeButton.onclock event");
    }

    createListView(table, await getBlockedUrl())
})()