(async () => {
    const pageContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Reliant - Prep</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="background-repeat: no-repeat; background-size: cover; background-position: center center; background-attachment: fixed;">
<div id="container">
    <div id="group-1">
        <div id="switchers-prepped-container">
            <span class="header"><span class="ns-heading-icon icon-users"></span>Switchers Prepped</span>
            <div class="information">
                <span id="current-switcher-number"></span>
                /
                <span id="max-switchers"></span>
            </div>
        </div>
        <div id="status-container">
            <span class="header"><span class="ns-heading-icon icon-status"></span>Status</span>
            <span class="information" id="status">N/A</span>
        </div>
        <div id="current-switcher-container">
            <div class="buttonblock">
                <input class="ajaxbutton" type="button" id="update" value="Update">
            </div>
            <span class="header"><span class="ns-heading-icon icon-login"></span>Current Switcher</span>
            <span class="information" id="current-switcher">N/A</span>
        </div>
        <div id="prep-button-container">
            <span class="header"><span class="ns-heading-icon icon-wa"></span>Prep</span>
            <input class="ajaxbutton nation-action-button" type="button" id="prep-button" value="Login to Next Switcher">
            <input class="ajaxbutton nation-action-button button-destructive" type="button" id="clear-application-button" value="Clear Stored Application" style="display: none;">
        </div>
    </div>
</div>
</body>
</html>`;
    document.open();
    document.write(pageContent);
    document.close();
    chrome.storage.local.get(['background', 'backgroundTint'], async (result) => {
        applyBackgroundCustomization(result.background, result.backgroundTint);
    });
    function clampNumber(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    function hexToRgb(hex) {
        const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!match)
            return null;
        return {
            r: parseInt(match[1], 16),
            g: parseInt(match[2], 16),
            b: parseInt(match[3], 16),
        };
    }
    function mixColors(base, tint, amount) {
        const baseRgb = hexToRgb(base);
        const tintRgb = hexToRgb(tint);
        if (!baseRgb || !tintRgb)
            return base;
        const ratio = clampNumber(amount, 0, 100) / 100;
        const r = Math.round(baseRgb.r + (tintRgb.r - baseRgb.r) * ratio);
        const g = Math.round(baseRgb.g + (tintRgb.g - baseRgb.g) * ratio);
        const b = Math.round(baseRgb.b + (tintRgb.b - baseRgb.b) * ratio);
        return `rgb(${r}, ${g}, ${b})`;
    }
    function rgba(hex, opacity) {
        const color = hexToRgb(hex);
        if (!color)
            return hex;
        return `rgba(${color.r}, ${color.g}, ${color.b}, ${clampNumber(opacity, 0, 100) / 100})`;
    }
    function applyBackgroundCustomization(background, backgroundTint) {
        const body = document.querySelector('body');
        const configuredColor = typeof backgroundTint?.color === 'string' ? backgroundTint.color : '#0d1117';
        const tintColor = background !== undefined ? '#0d1117' : configuredColor;
        const pageTintAmount = Number(backgroundTint?.pageAmount ?? 0);
        const panelTintAmount = Number(backgroundTint?.panelAmount ?? 0);
        const panelBlur = clampNumber(Number(backgroundTint?.panelBlur ?? 0), 0, 24);
        const imageOverlayOpacity = 1 - (clampNumber(pageTintAmount, 0, 100) / 100);
        const imageOverlayRgb = { r: 13, g: 17, b: 23 };
        body.style.setProperty('--reliant-panel-backdrop-filter', panelBlur > 0 ? `blur(${panelBlur}px)` : 'none');
        body.style.backgroundColor = mixColors('#0d1117', tintColor, pageTintAmount);
        body.style.setProperty('--reliant-border-color', mixColors('#30363d', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-border-muted-color', mixColors('#21262d', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-panel-background', mixColors('#161b22', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-information-background', mixColors('#0d1117', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-input-background', mixColors('#0d1117', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-button-background', mixColors('#21262d', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-button-hover-background', mixColors('#30363d', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-button-hover-border', mixColors('#8b949e', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-disabled-background', mixColors('#21262d', tintColor, panelTintAmount));
        if (background !== undefined) {
            const panelOpacity = 100 - clampNumber(panelTintAmount, 0, 100);
            body.style.setProperty('--reliant-border-color', rgba('#30363d', panelOpacity));
            body.style.setProperty('--reliant-border-muted-color', rgba('#21262d', panelOpacity));
            body.style.setProperty('--reliant-panel-background', rgba('#161b22', panelOpacity));
            body.style.setProperty('--reliant-information-background', rgba('#0d1117', panelOpacity));
            body.style.setProperty('--reliant-input-background', rgba('#0d1117', panelOpacity));
            body.style.setProperty('--reliant-button-background', rgba('#21262d', panelOpacity));
            body.style.setProperty('--reliant-button-hover-background', rgba('#30363d', panelOpacity));
            body.style.setProperty('--reliant-button-hover-border', rgba('#8b949e', panelOpacity));
            body.style.setProperty('--reliant-disabled-background', rgba('#21262d', panelOpacity));
            body.style.backgroundRepeat = 'no-repeat';
            body.style.backgroundSize = 'cover';
            body.style.backgroundPosition = 'center center';
            body.style.backgroundAttachment = 'fixed';
            body.style.backgroundImage =
                `linear-gradient(rgba(${imageOverlayRgb.r}, ${imageOverlayRgb.g}, ${imageOverlayRgb.b}, ${imageOverlayOpacity}), rgba(${imageOverlayRgb.r}, ${imageOverlayRgb.g}, ${imageOverlayRgb.b}, ${imageOverlayOpacity})), url("${background}")`;
        }
    }
    await dieIfNoUserAgent();
    /*
     * Event Handlers
     */
    function hasStoredApplication(nation, storedApplications) {
        const canonicalNation = canonicalize(nation);
        return storedApplications.some((application) => canonicalize(application.name) === canonicalNation);
    }
    async function getStoredApplications() {
        return new Promise((resolve) => {
            chrome.storage.local.get('switchers', (result) => resolve(result.switchers ?? []));
        });
    }
    async function currentSwitcherHasStoredApplication() {
        const currentSwitcher = document.querySelector('#current-switcher').innerHTML;
        return hasStoredApplication(currentSwitcher, await getStoredApplications());
    }
    function getCurrentSwitcher() {
        return document.querySelector('#current-switcher').innerHTML;
    }
    function hasCurrentSwitcher() {
        const currentSwitcher = getCurrentSwitcher();
        return currentSwitcher !== 'N/A' && currentSwitcher.trim() !== '';
    }
    function showClearApplicationButton(show) {
        document.querySelector('#clear-application-button').style.display = show ? '' : 'none';
    }
    function refreshPrepKeyDisplays() {
        void applyReliantButtonKeyDisplays([
            { selector: '#prep-button', keySetting: 'prepkey', defaultKey: 'P' },
        ]);
    }
    function finishPrepping() {
        document.querySelector('#status').innerHTML = 'Finished.';
        const prepButton = document.querySelector('#prep-button');
        setReliantButtonLabel(prepButton, 'Finished');
        prepButton.disabled = true;
        showClearApplicationButton(false);
        refreshPrepKeyDisplays();
    }
    async function updateSwitchersToPrep() {
        const result = await new Promise((resolve) => {
            chrome.storage.local.get(['prepswitchers', 'switchers'], resolve);
        });
        const storedApplications = result.switchers ?? [];
        switchers = (result.prepswitchers ?? [])
            .filter((switcher) => !hasStoredApplication(switcher, storedApplications));
        document.querySelector('#max-switchers').innerHTML = String(switchers.length);
    }
    async function updateCurrentSwitcher(e) {
        await updateSwitchersToPrep();
        const response = await makeAjaxQuery('/page=un', 'GET');
        const responseElement = document.createRange().createContextualFragment(response);
        const nationNameRegex = new RegExp('data-nname="([A-Za-z0-9_-]+?)"');
        const nationName = nationNameRegex.exec(response)[1];
        document.querySelector('#current-switcher').innerHTML = nationName;
        const currentSwitcherIndex = switchers.findIndex((switcher) => canonicalize(switcher) === canonicalize(nationName));
        document.querySelector('#current-switcher-number').innerHTML =
            currentSwitcherIndex === -1 ? '0' : String(currentSwitcherIndex + 1);
        if (currentSwitcherIndex === -1) {
            document.querySelector('#status').innerHTML = `${nationName} already has a stored application.`;
            setReliantButtonLabel(document.querySelector('#prep-button'), 'Login to Next Switcher');
            showClearApplicationButton(true);
        }
        else {
            setReliantButtonLabel(document.querySelector('#prep-button'), 'Apply');
            showClearApplicationButton(false);
        }
        refreshPrepKeyDisplays();
        chrome.storage.local.set({ 'chk': responseElement.querySelector('input[name=chk]').value });
    }
    function prepButton(e) {
        const prepButton = document.querySelector('#prep-button');
        let formData = new FormData();
        chrome.storage.local.get('chk', async (result) => {
            const currentPrepButtonLabel = getReliantButtonLabel(e.target);
            if (currentPrepButtonLabel === 'Apply') {
                await updateSwitchersToPrep();
                const currentSwitcher = getCurrentSwitcher();
                if (!hasCurrentSwitcher()) {
                    document.querySelector('#status').innerHTML = 'Log in to a switcher first.';
                    setReliantButtonLabel(prepButton, 'Login to Next Switcher');
                    refreshPrepKeyDisplays();
                    return;
                }
                if (await currentSwitcherHasStoredApplication()) {
                    document.querySelector('#status').innerHTML = `${currentSwitcher} already has a stored application.`;
                    setReliantButtonLabel(prepButton, 'Login to Next Switcher');
                    showClearApplicationButton(true);
                    refreshPrepKeyDisplays();
                    return;
                }
                formData.set('action', 'join_UN');
                formData.set('chk', result.chk);
                formData.set('submit', '1');
                let response = await makeAjaxQuery('/page=UN_status', 'POST', formData);
                if (response.indexOf('Your application to join the World Assembly has been received') !== -1) {
                    document.querySelector('#status').innerHTML = `Applied on ${document.querySelector('#current-switcher').innerHTML}`;
                    setReliantButtonLabel(prepButton, 'Update Localid');
                }
                else if (response.indexOf('Your World Assembly invitation email, sent to') !== -1) {
                    document.querySelector('#status').innerHTML = 'WA email already sent. Resend.';
                    setReliantButtonLabel(prepButton, 'Reapply');
                }
                else {
                    document.querySelector('#status').innerHTML = `Failed to apply on ${document.querySelector('#current-switcher').innerHTML}`;
                    setReliantButtonLabel(prepButton, 'Update Localid');
                }
            }
            else if (currentPrepButtonLabel === 'Update Localid') {
                let response = await makeAjaxQuery('/page=upload_flag', 'GET');
                getLocalId(response);
                document.querySelector('#status').innerHTML = 'Updated localid';
                setReliantButtonLabel(prepButton, 'Move to JP');
            }
            else if (currentPrepButtonLabel === 'Move to JP') {
                chrome.storage.local.get(['localid', 'jumppoint'], async (result) => {
                    const localId = result.localid;
                    const moveRegion = result.jumppoint;
                    formData.set('localid', localId);
                    formData.set('region_name', moveRegion);
                    formData.set('move_region', '1');
                    formData.set('confirm_move', '1');
                    let response = await makeAjaxQuery('/page=change_region', 'POST', formData);
                    if (response.indexOf('This request failed a security check.') !== -1)
                        document.querySelector('#status').innerHTML = `Failed to move to ${moveRegion}.`;
                    else {
                        document.querySelector('#status').innerHTML = `Moved to ${moveRegion}`;
                        setReliantButtonLabel(prepButton, 'Login to Next Switcher');
                        refreshPrepKeyDisplays();
                    }
                });
            }
            else if (currentPrepButtonLabel === 'Reapply') {
                let response = await makeAjaxQuery(`/page=UN_status/action=join_UN?chk=${result.chk}&amp;resend=1`, 'GET');
                if (response.indexOf('Your application to join the World Assembly has been received') !== -1) {
                    document.querySelector('#status').innerHTML = `Applied on ${document.querySelector('#current-switcher').innerHTML}`;
                }
                setReliantButtonLabel(prepButton, 'Update Localid');
            }
            else if (currentPrepButtonLabel === 'Login to Next Switcher') {
                chrome.storage.local.get('password', async (result) => {
                    await updateSwitchersToPrep();
                    const currentSwitcher = getCurrentSwitcher();
                    const currentSwitcherIndex = hasCurrentSwitcher() ?
                        switchers.findIndex((switcher) => canonicalize(switcher) === canonicalize(currentSwitcher)) :
                        -1;
                    const nextNation = currentSwitcherIndex === -1 ?
                        switchers[0] :
                        switchers[currentSwitcherIndex + 1];
                    if (typeof nextNation === 'undefined') {
                        finishPrepping();
                        return;
                    }
                    document.querySelector('#current-switcher-number').innerHTML =
                        String(switchers.findIndex((switcher) => canonicalize(switcher) === canonicalize(nextNation)) + 1);
                    document.querySelector('#current-switcher').innerHTML = nextNation;
                    // let response = await makeAjaxQuery(`/page=un?nation=${nextNation}&password=${result.password}&logging_in=1`,
                    //     'GET');
                    const formData = new FormData();
                    formData.set('nation', nextNation);
                    formData.set('password', result.password);
                    formData.set('logging_in', '1');
                    let response = await makeAjaxQuery('/page=un', 'POST', formData);
                    getChk(response);
                    showClearApplicationButton(false);
                    setReliantButtonLabel(prepButton, 'Apply');
                    refreshPrepKeyDisplays();
                });
            }
            refreshPrepKeyDisplays();
        });
    }
    async function clearStoredApplication(e) {
        const clearButton = e.target;
        const currentSwitcher = document.querySelector('#current-switcher').innerHTML;
        const applications = await getStoredApplications();
        const filteredApplications = applications
            .filter((application) => canonicalize(application.name) !== canonicalize(currentSwitcher));
        await chrome.storage.local.set({ 'switchers': filteredApplications });
        await updateSwitchersToPrep();
        document.querySelector('#status').innerHTML = `Cleared stored application for ${currentSwitcher}.`;
        clearButton.style.display = 'none';
        setReliantButtonLabel(document.querySelector('#prep-button'), 'Apply');
        refreshPrepKeyDisplays();
    }
    /*
     * Event Listeners
     */
    document.querySelector('#update').addEventListener('click', updateCurrentSwitcher);
    document.querySelector('#prep-button').addEventListener('click', prepButton);
    document.querySelector('#clear-application-button').addEventListener('click', clearStoredApplication);
    document.addEventListener('keyup', keyPress);
    refreshPrepKeyDisplays();
    /*
     * Initialization
     */
    let switchers;
    await updateSwitchersToPrep();
})();
