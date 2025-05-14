// 安装扩展时创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "saveToLater",
        title: "添加到稍后再看",
        contexts: ["page"]
    });
});

// 右键点击时保存页面
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "saveToLater") {
        saveLink(tab);
    }
});

// 点击扩展图标时保存页面
chrome.action.onClicked.addListener((tab) => {
    saveLink(tab);
});

// 处理来自内容脚本的消息
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!sender.tab) return;

    const tab = sender.tab;

    if (msg.type === "SAVE_CURRENT_PAGE") {
        saveLink(tab);
    }

    if (msg.type === "REMOVE_CURRENT_PAGE") {
        removeLink(tab);
    }

    if (msg.type === "CHECK_CURRENT_PAGE") {
        chrome.storage.local.get({ links: [] }, (result) => {
            const isSaved = result.links.some(item => item.url === tab.url);
            sendResponse({ saved: isSaved });
        });
        return true; // 必须加这句表示异步回调 sendResponse
    }
});

// 保存链接
function saveLink(tab) {
    const link = { title: tab.title, url: tab.url };
    chrome.storage.local.get({ links: [] }, (result) => {
        const links = result.links;
        if (!links.some(item => item.url === link.url)) {
            links.push(link);
            chrome.storage.local.set({ links });
        }
    });
}

// 删除链接
function removeLink(tab) {
    chrome.storage.local.get({ links: [] }, (result) => {
        const links = result.links.filter(item => item.url !== tab.url);
        chrome.storage.local.set({ links });
    });
}
