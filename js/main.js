const RELIANT_VERSION = chrome.runtime.getManifest().version;
let freshlyAdmitted = false;
/*
 * Helpers
 */
function formatApiNation(nation) {
    let output = nation.replaceAll('@@', '');
    return `<a href='/nation=${output}'>${output}</a>`;
}
function formatApiRegion(region) {
    let output = region.replaceAll('%%', '');
    return `<a href='/region=${output}'>${output}</a>`;
}
function formatApiString(inputString) {
    return inputString.replace(/(@@.*?@@|%%.*?%%)/g, (match) => {
        if (match.startsWith('@@')) {
            return formatApiNation(match);
        }
        else if (match.startsWith('%%')) {
            return formatApiRegion(match);
        }
        return match;
    });
}
let reliantDateFormat = 0;
let reliantClickableTimesInitialized = false;
function pluralizedTimePart(n, unit) {
    if (!n)
        return '';
    return `${n} ${unit}${n !== 1 ? 's' : ''}`;
}
function timeAgo(unixTimestamp) {
    const now = Math.floor(Date.now() / 1000);
    const seconds = Math.abs(now - unixTimestamp);
    let newTime;
    if (seconds < 60) {
        newTime = 'seconds';
    }
    else if (seconds < 7200) {
        newTime = pluralizedTimePart(Math.floor(seconds / 60), 'minute');
    }
    else if (seconds < 86400) {
        newTime = pluralizedTimePart(Math.floor(seconds % 86400 / 3600), 'hour');
    }
    else if (seconds < 31536000) {
        newTime = pluralizedTimePart(Math.floor(seconds / 86400), 'day');
        if (seconds >= 86400 && seconds < 345600)
            newTime += ` ${pluralizedTimePart(Math.floor((seconds % 86400) / 3600), 'hour')}`;
    }
    else {
        newTime = `${pluralizedTimePart(Math.floor(seconds / 31536000), 'year')} ${pluralizedTimePart(Math.floor((seconds % 31536000) / 86400), 'day')}`;
    }
    if (unixTimestamp <= now)
        return `${newTime.charAt(0).toUpperCase()}${newTime.slice(1)} ago`;
    return `in ${newTime}`;
}
function formatReliantLocalTime(unixTimestamp) {
    return new Date(unixTimestamp * 1000).toLocaleString(undefined, { timeZoneName: 'short' });
}
function formatReliantServerTime(unixTimestamp) {
    return new Date(unixTimestamp * 1000).toLocaleString(undefined, {
        timeZone: 'UTC',
        timeZoneName: 'short'
    });
}
function formatReliantTimeElement(timeElement) {
    const unixTimestamp = Number(timeElement.dataset.epoch);
    if (!Number.isFinite(unixTimestamp))
        return timeElement.textContent || '';
    return formatReliantTime(unixTimestamp, timeElement.dataset.servertime);
}
function formatReliantTime(unixTimestamp, serverTime) {
    if (reliantDateFormat === 0)
        return timeAgo(unixTimestamp);
    if (reliantDateFormat === 1)
        return `${formatReliantLocalTime(unixTimestamp)} (local)`;
    return `${serverTime || formatReliantServerTime(unixTimestamp)} (server)`;
}
function updateReliantClickableTimes(root = document) {
    root.querySelectorAll('time.reliant-clickable-time').forEach((timeElement) => {
        const newTime = formatReliantTimeElement(timeElement);
        if (timeElement.textContent !== newTime)
            timeElement.textContent = newTime;
    });
}
function ensureReliantClickableTimes() {
    if (reliantClickableTimesInitialized)
        return;
    reliantClickableTimesInitialized = true;
    document.addEventListener('click', (event) => {
        const timeElement = event.target.closest('time.reliant-clickable-time');
        if (!timeElement)
            return;
        reliantDateFormat = reliantDateFormat >= 2 ? 0 : reliantDateFormat + 1;
        updateReliantClickableTimes();
    });
}
function formatReliantClickableTime(unixTimestamp) {
    const timestamp = Number(unixTimestamp);
    if (!Number.isFinite(timestamp))
        return '';
    ensureReliantClickableTimes();
    const datetime = new Date(timestamp * 1000).toISOString();
    const serverTime = formatReliantServerTime(timestamp);
    return `<time class="reliant-clickable-time" datetime="${datetime}" data-epoch="${timestamp}" data-servertime="${serverTime}" title="Click to change time display">${formatReliantTime(timestamp, serverTime)}</time>`;
}
function parseApiHappenings(xmlHappenings) {
    // Parse the XML string into a document
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlHappenings, "application/xml");
    // Extract all <TEXT> elements
    const textElements = xmlDoc.getElementsByTagName("TEXT");
    // Extract all <TIMESTAMP> elements
    const timestampElements = xmlDoc.getElementsByTagName("TIMESTAMP");
    // Convert the HTMLCollection to an array and extract the text content
    return {
        text: Array.from(textElements).map(elem => elem.textContent),
        timestamps: Array.from(timestampElements).map(elem => Number(elem.textContent))
    };
}
async function getStorageValue(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}
async function setStorageValue(key, value) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, () => {
            resolve();
        });
    });
}
async function setDefaultStorageValues() {
    const defaultValues = [
        { key: 'jumppoint', value: 'artificial_solar_system' },
        { key: 'roname', value: 'Reliant' },
        { key: 'blockedregions', value: [] },
        { key: 'dossierkeywords', value: [] },
        { key: 'endorsekeywords', value: [] },
        { key: 'prepswitchers', value: [] },
        { key: 'switchers', value: [] },
        { key: 'raiderjp', value: 'suspicious' },
        { key: 'operationmode', value: 'defending' },
        { key: 'occupationmode', value: false },
        { key: 'occupationsequence', value: 'ready' },
        { key: 'moveSoundVolume', value: 50 },
        { key: 'backgroundTint', value: { color: '#0d1117', pageAmount: 0, panelAmount: 0, panelBlur: 0 } },
    ];
    for (const { key, value } of defaultValues) {
        if (await getStorageValue(key) === undefined) {
            await setStorageValue(key, value);
        }
    }
}
async function dieIfNoUserAgent() {
    const userAgent = await getStorageValue('useragent');
    if (userAgent)
        return;
    const cancellationNotyf = new Notyf({
        duration: 0,
        position: {
            x: 'right',
            y: 'top',
        },
        dismissible: false,
    });
    Array.from(document.querySelectorAll('input'))
        .filter((input) => input.id !== 'reliant-settings')
        .forEach((input) => input.disabled = true);
    cancellationNotyf.error('Please set your "Main Nation" in the <a href="/page=blank/reliant=settings">settings.</a>');
    throw new Error('No User Agent');
}
function canonicalize(str) {
    return str.trim().toLowerCase().replace(/ /g, '_');
}
function getUrlParameters(url) {
    const reg = new RegExp('\/([A-Za-z0-9-]+?)=([A-Za-z0-9_.+]+)', 'g');
    let params = {};
    let match;
    while ((match = reg.exec(url)) !== null)
        params[match[1]] = match[2];
    return params;
}
function pretty(str) {
    return str.replace(/_/g, ' ').replace(/\w+\s*/g, (txt) => txt.charAt(0).toUpperCase()
        + txt.substr(1).toLowerCase());
}
function getLocalId(page) {
    const localId = document.querySelector('input[name=localid]');
    if (localId)
        chrome.storage.local.set({ 'localid': localId.value });
    else if (page) {
        const pageElement = document.createRange().createContextualFragment(page);
        const hiddenLocalId = pageElement.querySelector('input[name=localid]');
        if (hiddenLocalId)
            chrome.storage.local.set({ 'localid': hiddenLocalId.getAttribute('value') });
    }
    else
        return;
}
function getChk(page) {
    const chk = document.querySelector('input[name=chk]');
    if (chk)
        chrome.storage.local.set({ 'chk': chk.value });
    else if (page) {
        const chkRegex = new RegExp('<input type="hidden" name="chk" value="([A-Za-z0-9_-]+?)">');
        const match = chkRegex.exec(page);
        chrome.storage.local.set({ 'chk': match[1] });
    }
    else
        return;
}
let inQuery = false;
async function makeAjaxQuery(url, method, data, admit = false, includeResponse = false) {
    const userAgent = await new Promise(resolve => {
        chrome.storage.local.get('useragent', (result) => {
            resolve(result.useragent);
        });
    });
    if (inQuery)
        return;
    let startTime = Date.now();
    const userClick = String(Date.now());
    // Recommended by Eluvatar: https://forum.nationstates.net/viewtopic.php?p=30083979#p30083979
    const fixedUrl = `${url}?script=reliant_${RELIANT_VERSION}_by_Haku_in_use_by_${userAgent}&userclick=${userClick}`;
    let request;
    // redirect required if admitting to the WA
    if (!admit) {
        request = new Request(fixedUrl, {
            method: method,
            redirect: "manual",
            body: data ?? null,
            credentials: "include"
        });
    }
    else {
        request = new Request(fixedUrl, {
            method: method,
            redirect: "follow",
            body: data ?? null,
            credentials: "include"
        });
    }
    // Each button with class 'ajaxbutton' make a request to the NS webiste.
    // In order to abide by rule "4. Avoid Simultaneous Requests" we will keep all buttons
    // with this class disabled until we receive a complete response from the NS server.
    let ajaxButtons = document.querySelectorAll('.ajaxbutton');
    for (let i = 0; i != ajaxButtons.length; i++)
        ajaxButtons[i].disabled = true;
    inQuery = true;
    const response = await fetch(request);
    let ret = await response.text();
    const result = {
        text: ret,
        status: response.status,
        type: response.type,
        redirected: response.redirected,
        responseUrl: response.url,
        redirectLocation: response.headers.get('Location') || '',
        requestUserClick: userClick
    };
    // We've received a complete response from the NS server, so we can allow more user input
    for (let i = 0; i != ajaxButtons.length; i++)
        ajaxButtons[i].disabled = false;
    inQuery = false;
    if (document.querySelector('#load-time'))
        document.querySelector('#load-time').innerHTML =
            String(Date.now() - startTime) + ' ms';
    return includeResponse ? result : ret;
}
function redirectPage(url) {
    let ajaxButtons = document.querySelectorAll('.ajaxbutton');
    // Disable all buttons until the page is fully redirected, though this is likely unnecessary
    for (let i = 0; i != ajaxButtons.length; i++)
        ajaxButtons[i].disabled = true;
    window.location.href = url;
}
function getReliantKeyDisplay(key) {
    if (key === ' ')
        return 'Space';
    return key;
}
function parseReliantKeys(rawKeys, defaultKey) {
    const source = String(rawKeys ?? '').trim() || defaultKey;
    const normalized = source.toUpperCase();
    const parsed = normalized
        .split(',')
        .map((value) => value.trim().replace(/\bSPACE\b/g, ' ').replace(/\bCOMMA\b/g, ','))
        .filter((value) => value.length > 0);
    if (!parsed.length)
        return [defaultKey];
    return Array.from(new Set(parsed));
}
function getFirstReliantKey(rawKeys, defaultKey) {
    return parseReliantKeys(rawKeys, defaultKey)[0] || defaultKey;
}
function stripReliantKeyDisplay(value) {
    return value.replace(/\s+\[[^\]]+\]$/, '').trim();
}
function getReliantButtonLabel(button) {
    const buttonLabel = button instanceof HTMLInputElement ? button.value : button.textContent;
    return stripReliantKeyDisplay(button.dataset.reliantButtonLabel || buttonLabel || '');
}
function setReliantButtonLabel(button, label) {
    button.dataset.reliantButtonLabel = label;
    if (button instanceof HTMLInputElement)
        button.value = label;
    else
        button.textContent = label;
}
function ensureReliantKeyHintStyles() {
    if (document.querySelector('#reliant-key-hint-styles'))
        return;
    const style = document.createElement('style');
    style.id = 'reliant-key-hint-styles';
    style.textContent = `
.reliant-key-hint {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0.55em;
    bottom: 0;
    width: 1.55em;
    height: 1.55em;
    margin: auto 0;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.34);
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.22);
    color: var(--reliant-key-hint-color, rgba(255, 255, 255, 0.92));
    font: 700 0.82em/1 Verdana, sans-serif;
    pointer-events: none;
    vertical-align: middle;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 1px 0 rgba(0, 0, 0, 0.18);
}

.reliant-key-hint-wrapper {
    display: inline-flex;
    align-items: stretch;
    position: relative;
    margin-bottom: 10px;
    vertical-align: middle;
}

.reliant-key-hint-wrapper > input[type=button],
.reliant-key-hint-wrapper > button {
    margin-bottom: 0;
}

.reliant-button-has-key-hint {
    box-sizing: border-box;
    padding-right: 3.15em !important;
    text-align: center;
}
`;
    document.head.appendChild(style);
}
function removeReliantButtonKeyHint(button) {
    button.classList.remove('reliant-button-has-key-hint');
    button.style.minWidth = '';
    const wrapper = button.parentElement;
    if (wrapper?.classList.contains('reliant-key-hint-wrapper')) {
        wrapper.querySelector('.reliant-key-hint')?.remove();
        wrapper.insertAdjacentElement('beforebegin', button);
        wrapper.remove();
        return;
    }
    button.nextElementSibling?.classList.contains('reliant-key-hint') && button.nextElementSibling.remove();
}
function setReliantButtonKeyHint(button, keyDisplay) {
    ensureReliantKeyHintStyles();
    button.classList.remove('reliant-button-has-key-hint');
    button.style.minWidth = '';
    let wrapper = button.parentElement;
    if (!wrapper?.classList.contains('reliant-key-hint-wrapper')) {
        wrapper = document.createElement('span');
        wrapper.className = 'reliant-key-hint-wrapper';
        button.insertAdjacentElement('beforebegin', wrapper);
        wrapper.appendChild(button);
    }
    let keyHint = wrapper.querySelector('.reliant-key-hint');
    if (!keyHint) {
        keyHint = document.createElement('kbd');
        keyHint.className = 'reliant-key-hint';
        wrapper.appendChild(keyHint);
    }
    keyHint.textContent = keyDisplay;
    keyHint.title = `Keybind: ${keyDisplay}`;
    wrapper.style.setProperty('--reliant-key-hint-color', getComputedStyle(button).color);
    const buttonWidthWithoutHint = button.getBoundingClientRect().width;
    button.classList.add('reliant-button-has-key-hint');
    const keyHintWidth = keyHint.getBoundingClientRect().width;
    button.style.minWidth = `${Math.ceil(buttonWidthWithoutHint + keyHintWidth + 10)}px`;
}
async function applyReliantButtonKeyDisplays(bindings) {
    const keySettings = Array.from(new Set(bindings.map((binding) => binding.keySetting)));
    const storedKeys = await new Promise((resolve) => {
        chrome.storage.local.get(keySettings, resolve);
    });
    for (const binding of bindings) {
        const key = getFirstReliantKey(storedKeys[binding.keySetting], binding.defaultKey);
        const keyDisplay = getReliantKeyDisplay(key);
        const buttons = Array.from(document.querySelectorAll(binding.selector));
        for (const button of buttons) {
            const baseLabel = getReliantButtonLabel(button);
            setReliantButtonLabel(button, baseLabel);
            setReliantButtonKeyHint(button, keyDisplay);
        }
    }
}
function clearReliantButtonKeyDisplays(selectors) {
    const buttons = selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)));
    for (const button of buttons) {
        removeReliantButtonKeyHint(button);
    }
}
const urlParameters = getUrlParameters(document.URL);
if (urlParameters['page'] !== 'blank') {
    getLocalId();
    getChk();
}
/*
 * Keybind Handling
 */
function keyPress(e) {
    const textboxSelected = document.querySelector('input:focus, textarea:focus');
    if (e.ctrlKey || e.altKey)
        return;
    else if (textboxSelected)
        return;
    // ignore caps lock
    const pressedKey = e.key.toUpperCase();
    if (pressedKey in keys)
        keys[pressedKey]();
}
document.addEventListener('keyup', keyPress);
/*
 * Keybind Functionality
 */
let keys = {};
let pendingOccupationMoveKey = false;
function consumePendingOccupationMoveKey() {
    const pending = pendingOccupationMoveKey;
    pendingOccupationMoveKey = false;
    return pending;
}
function bindKeys(keySetting, defaultKey, handler) {
    chrome.storage.local.get(keySetting, (result) => {
        const boundKeys = parseReliantKeys(result[keySetting], defaultKey);
        for (const key of boundKeys)
            keys[key] = handler;
    });
}
bindKeys('movekey', 'X', async () => {
    const moveButton = document.querySelector('button[name=move_region]');
    if (moveButton)
        moveButton.click();
    else if (urlParameters['reliant'] === 'main') {
        const occupationMode = await getStorageValue('occupationmode') || false;
        if (occupationMode) {
            const chasingButton = document.querySelector('#chasing-button');
            if (inQuery || chasingButton.disabled) {
                pendingOccupationMoveKey = true;
                return;
            }
            pendingOccupationMoveKey = false;
            chasingButton.click();
        }
        else {
            // Normal mode - just trigger chasing button
            document.querySelector('#chasing-button').click();
        }
    }
    else if (urlParameters['region']) {
        const updateLocalIdButton = document.querySelector('.updatelocalid[data-clicked="0"]');
        if (updateLocalIdButton)
            updateLocalIdButton.click();
        else
            document.querySelector('#action-button').click();
    }
});
chrome.storage.local.get('jpkey', (result) => {
    chrome.storage.local.get('jumppoint', (jpresult) => {
        const jumpPoint = jpresult.jumppoint || 'artificial_solar_system';
        const jpKeys = parseReliantKeys(result.jpkey, 'V');
        for (const key of jpKeys) {
            keys[key] = () => {
                const moveButton = document.querySelector('button[name=move_region]');
                if (urlParameters['region'] === jumpPoint)
                    moveButton.click();
                else if (urlParameters['reliant'] === 'main')
                    document.querySelector('#move-to-jp').click();
                else
                    window.location.href = `/template-overall=none/region=${jumpPoint}`;
            };
        }
    });
});
bindKeys('updatepredictormovekey', 'J', () => {
    if (urlParameters['reliant'] !== 'main')
        return;
    const moveButton = document.querySelector('#move-to-update-predictor-region');
    if (moveButton?.dataset.updatePredictorTriggerActive === '1')
        moveButton.click();
});
bindKeys('mainpagekey', ' ', () => {
    window.location.href = '/template-overall=none/page=blank/reliant=main';
});
bindKeys('resignkey', '\'', () => {
    if (urlParameters['page'] === 'join_WA')
        document.querySelector('button[class="button primary icon approve big"]').click();
    else if (urlParameters['reliant'] === 'main') {
        chrome.storage.local.get('currentwa', (currentwaresult) => {
            if ((!freshlyAdmitted) && (currentwaresult.currentwa))
                document.querySelector('#resign').click();
            else if ((!freshlyAdmitted))
                document.querySelector('#admit').click();
        });
    }
});
bindKeys('dossierkey', 'M', () => {
    if (urlParameters['reliant'] === 'trackednations')
        document.querySelector('#clear-tracked-nations').click();
    else
        window.location.href = '/page=blank/reliant=trackednations';
});
bindKeys('dossiernationkey', 'N', () => {
    const dossierButton = document.querySelector('#reliant-track');
    if (dossierButton)
        dossierButton.click();
    else if (urlParameters['reliant'] === 'main') {
        let refreshButton = document.querySelector('#refresh-dossier');
        let dossierButton = document.querySelector('.dossier[data-clicked="0"]');
        if (!dossierButton)
            refreshButton.click();
        else
            dossierButton.click();
    }
});
bindKeys('endorsekey', 'Z', () => {
    const endorseButton = document.querySelector('button[class="endorse button icon wa"]');
    const crossEndorse = document.querySelector('.cross');
    if (endorseButton)
        endorseButton.click();
    else if (crossEndorse)
        crossEndorse.click();
    else if (urlParameters['reliant'] === 'main') {
        let refreshButton = document.querySelector('#refresh-endorse');
        let endorseButton = document.querySelector('.endorse[data-clicked="0"]');
        const lastWAUpdate = document.querySelector('#last-wa-update');
        if (lastWAUpdate.innerHTML === 'Seconds ago')
            document.querySelector('#copy-win').click();
        if (freshlyAdmitted)
            document.querySelector('#update-localid').click();
        else {
            if (!endorseButton)
                refreshButton.click();
            else
                endorseButton.click();
        }
    }
    else if (urlParameters['region']) {
        let endorseButton = document.querySelector('.endorse[data-clicked="0"]');
        let refreshButton = document.querySelector('#refresh-endorse');
        if (!endorseButton)
            refreshButton.click();
        else
            endorseButton.click();
    }
});
bindKeys('gcrkey', 'G', () => {
    window.location.href = '/page=ajax2/a=reports/view=world/filter=change';
});
// probably won't be used much
bindKeys('viewregionkey', 'D', () => {
    const regionButton = document.querySelector('.paneltext:first-of-type');
    if (regionButton)
        regionButton.click();
    else if (urlParameters['page'] === 'change_region')
        document.querySelector('.info > a').click();
    else if (urlParameters['reliant'] === 'main')
        document.querySelector('#open-region').click();
});
bindKeys('didiupdatekey', 'U', () => {
    if (urlParameters['reliant'] === 'main')
        document.querySelector('#check-if-updated').click();
    else
        window.location.href = '/page=ajax2/a=reports/view=self/filter=change';
});
bindKeys('delegatekey', 'A', () => {
    if (urlParameters['region']) {
        const delegateNation = canonicalize(document.querySelector('#regioncontent > p:nth-child(2) > a > span > span.nname').innerHTML);
        window.location.href = `https://www.nationstates.net/nation=${delegateNation}`;
        return;
    }
    // Copy Nation Link
    else if (urlParameters['page'] === 'un') {
        let nationLink = 'https://www.nationstates.net/nation=' + document.getElementById('loggedin')
            .getAttribute('data-nname');
        const copyText = document.createElement('textarea');
        copyText.value = nationLink;
        document.body.appendChild(copyText);
        copyText.select();
        document.execCommand('copy');
        document.body.removeChild(copyText);
    }
    else if (urlParameters['reliant'] === 'main')
        document.querySelector('#endorse-delegate').click();
});
bindKeys('worldactivitykey', 'F', () => {
    if (urlParameters['reliant'] !== 'main')
        window.location.href = '/page=activity/view=world/filter=move+member+endo';
    else
        document.querySelector('#update-world-happenings').click();
});
bindKeys('refreshkey', 'C', () => {
    if (urlParameters['reliant'] === 'main')
        document.querySelector('#update-region-status').click();
    else
        location.reload();
});
bindKeys('settingskey', '0', () => {
    window.location.href = '/page=blank/reliant=settings';
});
bindKeys('prepkey', 'P', () => {
    if (urlParameters['reliant'] === 'prep')
        document.querySelector('#prep-button').click();
    else
        window.location.href = '/template-overall=none/page=blank/reliant=prep';
});
/*
 * Miscellaneous
 */
const settingsParent = document.querySelector('.belspacer.belspacermain');
if (settingsParent) {
    // Settings Button
    let settingsDiv = document.createElement('div');
    settingsDiv.setAttribute('class', 'bel');
    let settingsButton = document.createElement('input');
    settingsButton.setAttribute('type', 'button');
    settingsButton.setAttribute('id', 'reliant-settings');
    settingsButton.setAttribute('class', 'ajaxbutton');
    setReliantButtonLabel(settingsButton, 'Reliant Settings');
    settingsDiv.appendChild(settingsButton);
    // Main Reliant Button
    let reliantButton = document.createElement('input');
    reliantButton.setAttribute('type', 'button');
    reliantButton.setAttribute('id', 'reliant-main');
    reliantButton.setAttribute('class', 'ajaxbutton');
    setReliantButtonLabel(reliantButton, 'Reliant');
    settingsDiv.appendChild(reliantButton);
    settingsParent.insertBefore(settingsDiv, settingsParent.firstChild);
    document.querySelector('#reliant-settings').addEventListener('click', (e) => {
        redirectPage('/page=blank/reliant=settings');
    });
    document.querySelector('#reliant-main').addEventListener('click', (e) => {
        redirectPage('/template-overall=none/page=blank/reliant=main');
    });
    // Prep Page
    let prepButton = document.createElement('input');
    prepButton.setAttribute('type', 'button');
    prepButton.setAttribute('id', 'reliant-prep');
    prepButton.setAttribute('class', 'ajaxbutton');
    setReliantButtonLabel(prepButton, 'Prep');
    settingsDiv.appendChild(prepButton);
    prepButton.addEventListener('click', (e) => {
        redirectPage('/template-overall=none/page=blank/reliant=prep');
    });
    void applyReliantButtonKeyDisplays([
        { selector: '#reliant-settings', keySetting: 'settingskey', defaultKey: '0' },
        { selector: '#reliant-main', keySetting: 'mainpagekey', defaultKey: ' ' },
        { selector: '#reliant-prep', keySetting: 'prepkey', defaultKey: 'P' },
    ]);
}
(async () => {
    await setDefaultStorageValues();
    const userAgent = await getStorageValue('useragent');
    await chrome.runtime.sendMessage({ userAgent: userAgent });
})();
