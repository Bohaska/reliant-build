var HeaderOperation = chrome.declarativeNetRequest.HeaderOperation;
const endorseRedirects = new Map();
const ENDORSE_REDIRECT_TTL_MS = 30000;
function pruneEndorseRedirects() {
    const now = Date.now();
    for (const [userClick, redirect] of endorseRedirects) {
        if (redirect.expiresAt <= now) {
            endorseRedirects.delete(userClick);
        }
    }
}
function getQueryValue(url, key) {
    try {
        return new URL(url).searchParams.get(key) || '';
    }
    catch (error) {
        return '';
    }
}
chrome.webRequest.onBeforeRedirect.addListener((details) => {
    if (!details.url.includes('/cgi-bin/endorse.cgi')) {
        return;
    }
    const userClick = getQueryValue(details.url, 'userclick');
    if (!userClick) {
        return;
    }
    pruneEndorseRedirects();
    endorseRedirects.set(userClick, {
        redirectUrl: details.redirectUrl || '',
        expiresAt: Date.now() + ENDORSE_REDIRECT_TTL_MS
    });
}, {
    urls: ['https://*.nationstates.net/cgi-bin/endorse.cgi*'],
    types: ['xmlhttprequest']
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'get-endorse-redirect') {
        pruneEndorseRedirects();
        const redirect = endorseRedirects.get(message.userClick);
        if (redirect) {
            endorseRedirects.delete(message.userClick);
        }
        sendResponse({ redirectUrl: redirect?.redirectUrl || '' });
        return;
    }
    if (message.userAgent === undefined)
        return;
    const RELIANT_VERSION = chrome.runtime.getManifest().version;
    const userAgent = `Reliant ${RELIANT_VERSION} / In Use By ${message.userAgent} / Developed By Haku`;
    const rule = {
        id: 1,
        priority: 1,
        action: {
            type: 'modifyHeaders',
            requestHeaders: [
                {
                    header: 'User-Agent',
                    operation: HeaderOperation.SET,
                    value: userAgent
                }
            ]
        },
        condition: {
            urlFilter: 'https://*.nationstates.net/*',
            resourceTypes: ['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object', 'xmlhttprequest', 'ping', 'csp_report', 'media', 'websocket', 'other']
        }
    };
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
        addRules: [rule]
    });
});
