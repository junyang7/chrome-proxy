import Store from "@/tool/store.js";

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create(
        {
            url: 'index.html'
        }
    );
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'reset') {
        reset().then(() => {
            sendResponse(
                {
                    status: 'success'
                }
            );
        }).catch((err) => {
            sendResponse(
                {
                    status: 'error',
                    message: err.message
                }
            );
        });
        return true;
    }
});
chrome.runtime.onInstalled.addListener(() => {
    reset();
});

function reset() {
    return new Promise((resolve, reject) => {
        Store.getList().then((rule_list) => {
            if (!rule_list) {
                resolve();
                return;
            }
            let pac = `function FindProxyForURL(url, host) {\n`;
            for (let rule of rule_list) {
                if (rule.state !== 1) {
                    continue;
                }
                pac += `    if (shExpMatch(host, "${rule.pattern}")) {\n`;
                pac += `        return "PROXY ${rule.server}";\n`;
                pac += `    }\n`
            }
            pac += `    return "DIRECT";\n`;
            pac += `}\n`;
            chrome.proxy.settings.set(
                {
                    value: {
                        mode: 'pac_script',
                        pacScript: {
                            data: pac,
                            mandatory: true
                        }
                    },
                    scope: 'regular'
                },
                function () {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve();
                    }
                }
            );
        }).catch((err) => {
            reject(err);
        });
    });
}
