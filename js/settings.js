const pageContent = document.querySelector('#content');
pageContent.innerHTML = `
<h1>Reliant Settings</h1>
<form>
<fieldset>
<legend>Find My WA</legend>
<input type="button" class="ajaxbutton" id="find-wa" value="Find My WA">
<p id="find-wa-output"></p>
</fieldset>
<fieldset>
<legend>Clear Stored World Assembly Applications</legend>
<input class="button" type="button" id="clear-wa-apps" value="Clear WA Apps">
</fieldset>
<fieldset>
<p>This nation will be used to identify yourself in all requests to NationStates.</p>
<legend>Main Nation</legend>
<input type="text" id="new-main-nation">
<input class="button" type="button" id="set-main-nation" value="Set">
</fieldset>
<fieldset>
<legend>Jump Point</legend>
<input type="text" id="new-jump-point">
<input class="button" type="button" id="set-jump-point" value="Set">
<p>Current: <b id="current-jumppoint"></b></p>
</fieldset>
<fieldset>
<legend>Regional Officer Name</legend>
<input type="text" id="new-ro-name">
<input class="button" type="button" id="set-ro-name" value="Set">
<p>Current: <b id="current-roname"></b></p>
</fieldset>
<fieldset>
<legend>Blocked Regions</legend>
<p>Enter a list of region names, one per line. You will be blocked from chasing raiders into these regions.</p>
<p>Recommendations:
<pre>
beyond
phantom
probing_uranus
darkest_skies
fluffy_bunny
eta
the_crimson_empire
house_boucher
voidwolf
distorted_memories
stars_above
fort_mule
lightyears_away
stygian_abbey
viridian_sound
</pre>
</p>
<textarea id="blocked-regions"></textarea>
<input class="button" type="button" id="set-blocked-regions" value="Set">
<p>Current: <p><b id="current-blocked-regions"></b></p></p>
</fieldset>
<fieldset>
<legend>Dossier Inclusion</legend>
<p>Enter a list of keywords, one per line. Only raider nations with any of these keywords in their name will have
a dossier button on the main page. Useful for chasing specific teams. <b>Leave blank to show all raider nations.</b></p>
<p>
<textarea id="dossier-keywords"></textarea>
</p>
<input type="button" id="set-dossier-keywords" value="Set">
<p id="current-dossier-keywords"></p>
</fieldset>
<fieldset>
<legend>Endorse Inclusion</legend>
<p>Same as above, but for endorsing. <b>Leave blank to show all defender nations.</b></p>
<p>
<textarea id="endorse-keywords"></textarea>
</p>
<input type="button" id="set-endorse-keywords" value="Set">
</fieldset>
<fieldset>
<legend>Background</legend>
<input type="file" id="new-background-image">
<br/>
<img id="uploaded-background-image" style="max-width:60%;"></img>
<br/>
<input class="button" type="button" id="set-background-image" value="Set">
<input class="button" type="button" id="unset-background-image" value="Remove Background Image">
<p>
<label for="background-tint-color">Background Color</label>
<input type="color" id="background-tint-color" value="#0d1117">
</p>
<p>
<label for="background-tint-amount">Background Amount</label>
<input type="range" id="background-tint-amount" min="0" max="100" value="0">
<span id="background-tint-amount-output">0</span>%
</p>
<p>
<label for="panel-tint-amount">Panel Amount</label>
<input type="range" id="panel-tint-amount" min="0" max="100" value="0">
<span id="panel-tint-amount-output">0</span>%
</p>
<p>
<label for="panel-blur">Panel Blur</label>
<input type="range" id="panel-blur" min="0" max="24" value="0">
<span id="panel-blur-output">0</span>px
</p>
<input class="button" type="button" id="set-background-tint" value="Set Tint">
<p>Current: <b id="current-background-tint"></b></p>
</fieldset>
<fieldset>
<legend>Prepping</legend>
<p><strong>Password</strong></p>
<input type="password" id="my-password">
<input class="button" type="button" id="set-password" value="Set">
<p><strong>Switchers</strong></p>
<textarea id="switchers"></textarea>
<input class="button" type="button" id="set-switchers" value="Set">
</fieldset>
<fieldset id="max-happenings">
<legend>Max Happenings Count</legend>
<p>The number of happenings in these sections will not exceed this number. Used for saving screen space.</p>
<p>
<label>Endorse</label>
<input type="radio" name="max-happenings-section" value="endorsehappeningscount">
</p>
<p>
<label>Dossier</label>
<input type="radio" name="max-happenings-section" value="dossierhappeningscount">
</p>
<p>
<label>Region</label>
<input type="radio" name="max-happenings-section" value="regionhappeningscount">
</p>
<p>
<label>World</label>
<input type="radio" name="max-happenings-section" value="worldhappeningscount">
</p>
<p>
<label>Reports</label>
<input type="radio" name="max-happenings-section" value="reportscount"
</p>
<p><input type="number" id="max-happenings-count" min="1" max="20"></p>
<p><input class="button" type="button" id="set-max-happenings" value="Set"></p>
<p>
<label for="chase-happenings-timeout">Auto-hide chase happenings after (seconds):</label>
<input type="number" id="chase-happenings-timeout" min="1">
<input class="button" type="button" id="set-chase-happenings-timeout" value="Set">
</p>
</fieldset>
<fieldset>
<legend>Operation Mode</legend>
<p>Raiding doesn't do anything, like PRAF at update.</p>
<p>
<label for="operation-mode-defending">
<input type="radio" name="operation-mode" id="operation-mode-defending" value="defending">
Defending
</label>
</p>
<p>
<label for="operation-mode-raiding">
<input type="radio" name="operation-mode" id="operation-mode-raiding" value="raiding">
Raiding
</label>
</p>
<p>Current: <b id="current-operation-mode"></b></p>
</fieldset>
<fieldset>
<legend>Occupation Chasing Mode</legend>
<p>When enabled, the move key will step through a sequence: Chase → Update Localid → Update Region Status → Endorse Delegate. Each step requires a separate keypress.</p>
<input type="checkbox" id="occupation-mode-toggle">
<label for="occupation-mode-toggle">Enable Occupation Chasing Mode</label>
<p>Current: <b id="current-occupation-mode">Disabled</b></p>
</fieldset>
<fieldset>
<legend>Move Success Sound</legend>
<p>When enabled, a notification sound will play when you successfully move to a different region.</p>
<input type="checkbox" id="move-sound-toggle" checked>
<label for="move-sound-toggle">Play sound on successful region move</label>
<p>Current: <b id="current-move-sound-status">Enabled</b></p>
<p>Volume: <input type="range" id="move-sound-volume" min="0" max="100" value="50">
<span id="current-move-sound-volume">50</span>%</p>
</fieldset>
<fieldset>
<legend>Custom Move Success Sound</legend>
<p>Upload your own sound file to play when you successfully move to a different region.</p>
<input type="file" id="new-custom-sound" accept="audio/*">
<br/>
<audio id="uploaded-custom-sound" controls style="max-width:60%; margin: 10px 0;"></audio>
<br/>
<input class="button" type="button" id="test-custom-sound" value="Test Sound">
<input class="button" type="button" id="set-custom-sound" value="Set Custom Sound">
<input class="button" type="button" id="unset-custom-sound" value="Remove Custom Sound">
<p>Current: <b id="current-custom-sound-status">Default</b></p>
</fieldset>
<fieldset id="keys">
<legend>Change Keys</legend>
<p id="current-key"></p>
<p>
<label for="movekey">Move Key</label>
<input type="radio" name="key-to-change" value="movekey">
Current:
<b id="currentmovekey"></b>
</p>
<p>
<label for="jpkey">Jump Point Key</label>
<input type="radio" name="key-to-change" value="jpkey">
Current:
<b id="currentjpkey"></b>
</p>
<p>
<label for="updatepredictormovekey">Update Predictor Move Key</label>
<input type="radio" name="key-to-change" value="updatepredictormovekey">
Current:
<b id="currentupdatepredictormovekey"></b>
</p>
<p>
<label for="refreshkey">Refresh Key</label>
<input type="radio" name="key-to-change" value="refreshkey">
Current:
<b id="currentrefreshkey"></b>
</p>
<p>
<label for="mainpagekey">Main Page Key</label>
<input type="radio" name="key-to-change" value="mainpagekey">
Current:
<b id="currentmainpagekey"></b>
</p>
<p>
<label for="resignkey">Resign Key</label>
<input type="radio" name="key-to-change" value="resignkey">
Current:
<b id="currentresignkey"></b>
</p>
<p>
<label for="dossierkey">View/Clear Dossier Key</label>
<input type="radio" name="key-to-change" value="dossierkey">
Current:
<b id="currentdossierkey"></b>
</p>
<p>
<label for="dossiernationkey">Dossier Nation Key</label>
<input type="radio" name="key-to-change" value="dossiernationkey">
Current:
<b id="currentdossiernationkey"></b>
</p>
<p>
<label for="endorsekey">Endorse Key</label>
<input type="radio" name="key-to-change" value="endorsekey">
Current:
<b id="currentendorsekey"></b>
</p>
<p>
<label for="gcrkey">GCR Updating Key</label>
<input type="radio" name="key-to-change" value="gcrkey">
Current:
<b id="currentgcrkey"></b>
</p>
<p>
<label for="viewregionkey">View Region</label>
<input type="radio" name="key-to-change" value="viewregionkey">
Current:
<b id="currentviewregionkey"></b>
</p>
<p>
<label for="worldactivitykey">World Activity Key</label>
<input type="radio" name="key-to-change" value="worldactivitykey">
Current:
<b id="currentworldactivitykey"></b>
</p>
<p>
<label for="didiupdatekey">Did I Update? Key</label>
<input type="radio" name="key-to-change" value="didiupdatekey">
Current:
<b id="currentdidiupdatekey"></b>
</p>
<p>
<label for="delegatekey">Endorse Delegate Key</label>
<input type="radio" name="key-to-change" value="delegatekey">
Current:
<b id="currentdelegatekey"></b>
</p>
<p>
<label for="prepkey">Prep Key</label>
<input type="radio" name="key-to-change" value="prepkey">
Current:
<b id="currentprepkey"></b>
</p>
<p>
<label>Settings Key</label>
<input type="radio" name="key-to-change" value="settingskey">
Current:
<b id="currentsettingskey"></b>
</p>
<input type="text" id="new-key" maxlength="120">
<input class="button" type="button" id="set-key" value="Set">
</fieldset>
</form>
<p><strong>Login Landing Page</strong></p>
<input type="text" id="login-landing-page">
<input class="button" type="button" id="set-login-landing-page" value="Set">
<p>Current: <b id="current-login-landing-page"></b></p>
<h2>Current Prep Switcher Set</h2>
<p id="current-switcher-set"></p>
<h2>Currently Stored Applications</h2>
<p id="current-stored-applications"></p>
`;
let notyf = new Notyf({
    duration: 3000,
    position: {
        x: 'right',
        y: 'top'
    }
});
/*
 * Event Listeners
 */
document.querySelector('#set-main-nation').addEventListener('click', setUserAgent);
document.querySelector('#set-key').addEventListener('click', setKey);
document.querySelector('#set-jump-point').addEventListener('click', setJumpPoint);
document.querySelector('#set-ro-name').addEventListener('click', setRoName);
document.querySelector('#set-max-happenings').addEventListener('click', setMaxHappeningsCount);
document.querySelector('#set-chase-happenings-timeout').addEventListener('click', setChaseHappeningsTimeout);
document.querySelector('#set-switchers').addEventListener('click', setSwitchers);
document.querySelector('#set-login-landing-page').addEventListener('click', setLoginLandingPage);
document.querySelector('#set-password').addEventListener('click', setPassword);
document.querySelector('#clear-wa-apps').addEventListener('click', clearStoredWaApplications);
document.querySelector('#set-blocked-regions').addEventListener('click', setBlockedRegions);
document.querySelector('#set-dossier-keywords').addEventListener('click', setDossierKeywords);
document.querySelector('#set-endorse-keywords').addEventListener('click', setEndorseKeywords);
document.querySelector('#find-wa').addEventListener('click', findMyWa);
document.querySelector('#set-background-image').addEventListener('click', setBackgroundImage);
document.querySelector('#unset-background-image').addEventListener('click', unsetBackgroundImage);
document.querySelector('#new-background-image').addEventListener('change', loadBackgroundImage);
document.querySelector('#set-background-tint').addEventListener('click', setBackgroundTint);
document.querySelector('#background-tint-amount').addEventListener('input', updateBackgroundTintRangeDisplays);
document.querySelector('#panel-tint-amount').addEventListener('input', updateBackgroundTintRangeDisplays);
document.querySelector('#panel-blur').addEventListener('input', updateBackgroundTintRangeDisplays);
document.querySelectorAll('input[name="operation-mode"]').forEach((input) => {
    input.addEventListener('change', setOperationMode);
});
document.querySelector('#occupation-mode-toggle').addEventListener('change', toggleOccupationMode);
document.querySelector('#move-sound-toggle').addEventListener('change', toggleMoveSound);
document.querySelector('#move-sound-volume').addEventListener('input', setMoveSoundVolume);
document.querySelector('#new-custom-sound').addEventListener('change', loadCustomSound);
document.querySelector('#test-custom-sound').addEventListener('click', testCustomSound);
document.querySelector('#set-custom-sound').addEventListener('click', setCustomSound);
document.querySelector('#unset-custom-sound').addEventListener('click', unsetCustomSound);
/*
 * Handlers
 */
function setKey(e) {
    let keyToSet;
    const key = document.querySelector('#new-key').value.toUpperCase();
    const radioButtons = document.querySelector('#keys').querySelectorAll('input[type=radio]');
    for (let i = 0; i != radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            keyToSet = radioButtons[i].value;
            break;
        }
    }
    document.querySelector('#new-key').value = '';
    chrome.storage.local.set({ [keyToSet]: key });
    notyf.success(`Set function "${keyToSet}" to key ${key}`);
}
async function setUserAgent(e) {
    const newUserAgent = canonicalize(document.querySelector('#new-main-nation').value);
    await setStorageValue('useragent', newUserAgent);
    notyf.success(`Set identifier to ${newUserAgent}`);
}
function setJumpPoint(e) {
    const newJumpPoint = canonicalize(document.querySelector('#new-jump-point').value);
    chrome.storage.local.set({ 'jumppoint': newJumpPoint });
    notyf.success(`Set jump point to ${newJumpPoint}`);
}
function setRoName(e) {
    const newRoName = document.querySelector('#new-ro-name').value;
    chrome.storage.local.set({ 'roname': newRoName });
    notyf.success(`Set detag RO name to ${newRoName}`);
}
function setMaxHappeningsCount(e) {
    const maxHappeningsCount = document.querySelector('#max-happenings-count').value;
    const radioButtons = document.querySelector('#max-happenings').querySelectorAll('input[type=radio]');
    let happeningSetting;
    for (let i = 0; i != radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            happeningSetting = radioButtons[i].value;
            break;
        }
    }
    chrome.storage.local.set({ [happeningSetting]: maxHappeningsCount });
    notyf.success(`Set ${happeningSetting} to ${maxHappeningsCount}`);
}
function setChaseHappeningsTimeout(e) {
    const timeoutValue = Number(document.querySelector('#chase-happenings-timeout').value);
    if (timeoutValue) {
        chrome.storage.local.set({ 'ssetimeout': timeoutValue });
        notyf.success(`Set chase happenings auto-hide to ${timeoutValue} seconds`);
    }
}
function setSwitchers(e) {
    let switchers = document.querySelector('#switchers').value.split('\n');
    for (let i = 0; i != switchers.length; i++)
        switchers[i] = canonicalize(switchers[i]);
    chrome.storage.local.set({ 'prepswitchers': switchers });
    notyf.success(`Set list of ${switchers.length} switchers.`);
}
function setPassword(e) {
    const password = document.querySelector('#my-password').value;
    chrome.storage.local.set({ 'password': password });
    notyf.success(`Set password to ${password}`);
}
function normalizeLandingPage(value) {
    if (!value)
        return '';
    return value.trim().replace(/^\//, '').split('?')[0].trim();
}
function setLoginLandingPage(e) {
    const rawLandingPage = document.querySelector('#login-landing-page').value;
    const landingPage = normalizeLandingPage(rawLandingPage);
    if (!landingPage) {
        chrome.storage.local.remove('loginlandingpage');
        notyf.success('Cleared login landing page. Using default page=un.');
        return;
    }
    chrome.storage.local.set({ 'loginlandingpage': landingPage });
    notyf.success(`Set login landing page to ${landingPage}`);
}
function loadBackgroundImage(e) {
    var files = e.target.files;
    if (files && files.length) {
        var reader = new FileReader();
        reader.onload = function () {
            document.querySelector("#uploaded-background-image").src =
                reader.result;
        };
        reader.readAsDataURL(files[0]);
    }
}
function setBackgroundImage(e) {
    const image = document.querySelector('#uploaded-background-image');
    if (!image.complete || image.naturalWidth === 0)
        throw new Error("Image isn't loaded yet");
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx)
        throw new Error("Failed to get canvas context");
    ctx.drawImage(image, 0, 0);
    chrome.storage.local.set({ 'background': canvas.toDataURL('image/png') });
    notyf.success(`Set new background image`);
}
function unsetBackgroundImage(e) {
    chrome.storage.local.remove('background');
    notyf.success('Cleared background image.');
}
function getBackgroundTintInput() {
    return {
        color: document.querySelector('#background-tint-color').value,
        pageAmount: parseInt(document.querySelector('#background-tint-amount').value),
        panelAmount: parseInt(document.querySelector('#panel-tint-amount').value),
        panelBlur: parseInt(document.querySelector('#panel-blur').value),
    };
}
function updateBackgroundTintRangeDisplays() {
    document.querySelector('#background-tint-amount-output').textContent =
        document.querySelector('#background-tint-amount').value;
    document.querySelector('#panel-tint-amount-output').textContent =
        document.querySelector('#panel-tint-amount').value;
    document.querySelector('#panel-blur-output').textContent =
        document.querySelector('#panel-blur').value;
}
function describeBackgroundTint(backgroundTint) {
    const color = typeof backgroundTint?.color === 'string' ? backgroundTint.color : '#0d1117';
    const pageAmount = Number(backgroundTint?.pageAmount ?? 0);
    const panelAmount = Number(backgroundTint?.panelAmount ?? 0);
    const panelBlur = Number(backgroundTint?.panelBlur ?? 0);
    return `${color}, background ${pageAmount}%, panels ${panelAmount}%, blur ${panelBlur}px`;
}
function setBackgroundTintInputs(backgroundTint) {
    const color = typeof backgroundTint?.color === 'string' ? backgroundTint.color : '#0d1117';
    const pageAmount = Number(backgroundTint?.pageAmount ?? 0);
    const panelAmount = Number(backgroundTint?.panelAmount ?? 0);
    const panelBlur = Number(backgroundTint?.panelBlur ?? 0);
    document.querySelector('#background-tint-color').value = color;
    document.querySelector('#background-tint-amount').value = pageAmount.toString();
    document.querySelector('#panel-tint-amount').value = panelAmount.toString();
    document.querySelector('#panel-blur').value = panelBlur.toString();
    updateBackgroundTintRangeDisplays();
    document.querySelector('#current-background-tint').textContent = describeBackgroundTint({ color, pageAmount, panelAmount, panelBlur });
}
async function setBackgroundTint(e) {
    const backgroundTint = getBackgroundTintInput();
    await setStorageValue('backgroundTint', backgroundTint);
    setBackgroundTintInputs(backgroundTint);
    notyf.success('Set background tint.');
}
function loadCustomSound(e) {
    var files = e.target.files;
    if (files && files.length) {
        var reader = new FileReader();
        reader.onload = function () {
            document.querySelector("#uploaded-custom-sound").src =
                reader.result;
        };
        reader.readAsDataURL(files[0]);
    }
}
function setCustomSound(e) {
    const audio = document.querySelector('#uploaded-custom-sound');
    if (!audio.src)
        throw new Error("No audio file loaded");
    chrome.storage.local.set({ 'customMoveSound': audio.src });
    document.querySelector('#current-custom-sound-status').innerHTML = 'Custom';
    notyf.success(`Set custom move success sound`);
}
function unsetCustomSound(e) {
    chrome.storage.local.remove('customMoveSound');
    document.querySelector('#current-custom-sound-status').innerHTML = 'Default';
    document.querySelector('#uploaded-custom-sound').src = '';
    notyf.success('Removed custom sound. Using default sound.');
}
async function testCustomSound(e) {
    const audio = document.querySelector('#uploaded-custom-sound');
    if (!audio.src) {
        notyf.error('No audio file loaded to test');
        return;
    }
    try {
        const volumePercentage = parseInt(document.querySelector('#move-sound-volume').value);
        audio.volume = volumePercentage / 100;
        await audio.play();
        notyf.success('Playing test sound');
    }
    catch (error) {
        console.log('Failed to play test sound:', error);
        notyf.error('Failed to play test sound');
    }
}
function clearStoredWaApplications(e) {
    chrome.storage.local.set({ 'switchers': [] });
    notyf.success('Cleared all stored WA applications.');
}
function setBlockedRegions(e) {
    let blockedRegions = document.querySelector('#blocked-regions').
        value.split('\n');
    for (let i = 0; i !== blockedRegions.length; i++)
        blockedRegions[i] = canonicalize(blockedRegions[i]);
    chrome.storage.local.set({ 'blockedregions': blockedRegions });
    notyf.success(`Set blocked regions.`);
}
function setDossierKeywords(e) {
    let dossierKeywords = document.querySelector('#dossier-keywords')
        .value.split('\n');
    for (let i = 0; i !== dossierKeywords.length; i++)
        dossierKeywords[i] = dossierKeywords[i].toLowerCase();
    chrome.storage.local.set({ 'dossierkeywords': dossierKeywords });
    notyf.success(`Set dossier keywords.`);
}
function setEndorseKeywords(e) {
    let dossierKeywords = document.querySelector('#endorse-keywords')
        .value.split('\n');
    for (let i = 0; i !== dossierKeywords.length; i++)
        dossierKeywords[i] = dossierKeywords[i].toLowerCase();
    chrome.storage.local.set({ 'endorsekeywords': dossierKeywords });
    notyf.success(`Set endorse keywords.`);
}
async function setOperationMode(e) {
    const mode = e.target.value;
    await setStorageValue('operationmode', mode);
    document.querySelector('#current-operation-mode').innerHTML = mode;
    notyf.success(`Set operation mode to ${mode}`);
}
async function findMyWa(e) {
    // It wouldn't work using fetch/makeAjaxQuery, I seriously have no idea why - Haku
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/cgi-bin/api.cgi?wa=1&q=members', true);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const xmlDoc = xhr.responseXML;
            const membersElement = xmlDoc.querySelector('MEMBERS').textContent;
            if (!membersElement)
                return;
            const members = membersElement.split(',');
            const prepSwitchers = await getStorageValue('prepswitchers');
            let wa = members.find((member) => prepSwitchers.includes(member));
            const output = document.querySelector('#find-wa-output');
            output.innerHTML = wa ? `Found WA: ${wa}` : 'Could not find WA.';
        }
    };
    e.target.disabled = true;
    xhr.send();
}
async function toggleOccupationMode(e) {
    const isEnabled = e.target.checked;
    await setStorageValue('occupationmode', isEnabled);
    await setStorageValue('occupationsequence', 'Ready');
    await setStorageValue('chaseAssistStateV1', {
        sequence: 'Ready',
        step: 'idle',
        targetRegion: '',
    });
    document.querySelector('#current-occupation-mode').innerHTML = isEnabled ? 'Enabled' : 'Disabled';
    notyf.success(`Occupation mode ${isEnabled ? 'enabled' : 'disabled'}`);
}
async function toggleMoveSound(e) {
    const isEnabled = e.target.checked;
    await setStorageValue('moveSoundEnabled', isEnabled);
    document.querySelector('#current-move-sound-status').innerHTML = isEnabled ? 'Enabled' : 'Disabled';
    notyf.success(`Move sound ${isEnabled ? 'enabled' : 'disabled'}`);
}
async function setMoveSoundVolume(e) {
    const volume = parseInt(e.target.value);
    await setStorageValue('moveSoundVolume', volume);
    document.querySelector('#current-move-sound-volume').innerHTML = volume.toString();
    // notyf.success(`Move sound volume set to ${volume}%`);
}
chrome.storage.local.get(['prepswitchers', 'password', 'useragent', 'loginlandingpage'], (result) => {
    const currentSwitcherSet = document.querySelector('#current-switcher-set');
    const prepSwitchers = result.prepswitchers ?? [];
    const userAgent = result.useragent ?? '';
    const password = result.password || '';
    const landingPage = normalizeLandingPage(result.loginlandingpage) || 'page=un';
    function submitSwitcherLogin(switcherName) {
        const form = document.createElement('form');
        form.action = `/${landingPage}?script=reliant_${RELIANT_VERSION}_by_Haku_in_use_by_${userAgent}&userclick=${Date.now()}`;
        form.method = 'post';
        form.target = '_blank';
        form.style.display = 'none';
        const loggingInput = document.createElement('input');
        loggingInput.type = 'hidden';
        loggingInput.name = 'logging_in';
        loggingInput.value = '1';
        const nationInput = document.createElement('input');
        nationInput.type = 'hidden';
        nationInput.name = 'nation';
        nationInput.value = switcherName;
        const passwordInput = document.createElement('input');
        passwordInput.type = 'hidden';
        passwordInput.name = 'password';
        passwordInput.value = password;
        form.appendChild(loggingInput);
        form.appendChild(nationInput);
        form.appendChild(passwordInput);
        document.body.appendChild(form);
        form.submit();
        form.remove();
    }
    // Create a document fragment
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < prepSwitchers.length; i++) {
        const switcherName = prepSwitchers[i];
        // Create anchor element
        const anchor = document.createElement('a');
        anchor.href = `/${landingPage}?nation=${switcherName}&logging_in=1`;
        anchor.target = '_blank';
        anchor.textContent = switcherName;
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            submitSwitcherLogin(switcherName);
        });
        // Append anchor to the fragment
        fragment.appendChild(anchor);
        // Add a <br> element
        fragment.appendChild(document.createElement('br'));
    }
    // Append the fragment to the DOM once
    currentSwitcherSet.appendChild(fragment);
});
chrome.storage.local.get('switchers', (result) => {
    const currentApplications = document.querySelector('#current-stored-applications');
    const applications = result.switchers ?? []; // Assuming Switcher[] is inferred or defined elsewhere
    // Create a document fragment
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < applications.length; i++) {
        const application = applications[i];
        // Create a paragraph element
        const p = document.createElement('p');
        // Set its innerHTML to include the name and ID
        p.innerHTML = `Name: ${application.name}<br>ID: ${application.appid}`;
        // Append the paragraph to the fragment
        fragment.appendChild(p);
    }
    // Append the fragment to the DOM once
    currentApplications.appendChild(fragment);
});
/*
 * Initialization
 */
(async () => {
    await setDefaultStorageValues();
    async function getCurrentKey(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key, (result) => {
                resolve(result[key]);
            });
        });
    }
    async function displayCurrentKeys() {
        const currentKeys = await Promise.all([
            getCurrentKey('movekey'),
            getCurrentKey('jpkey'),
            getCurrentKey('updatepredictormovekey'),
            getCurrentKey('refreshkey'),
            getCurrentKey('mainpagekey'),
            getCurrentKey('resignkey'),
            getCurrentKey('dossierkey'),
            getCurrentKey('dossiernationkey'),
            getCurrentKey('endorsekey'),
            getCurrentKey('gcrkey'),
            getCurrentKey('viewregionkey'),
            getCurrentKey('worldactivitykey'),
            getCurrentKey('didiupdatekey'),
            getCurrentKey('delegatekey'),
            getCurrentKey('prepkey'),
            getCurrentKey('settingskey')
        ]);
        document.querySelector('#currentmovekey').innerHTML = currentKeys[0] || 'X';
        document.querySelector('#currentjpkey').innerHTML = currentKeys[1] || 'V';
        document.querySelector('#currentupdatepredictormovekey').innerHTML = currentKeys[2] || 'J';
        document.querySelector('#currentrefreshkey').innerHTML = currentKeys[3] || 'C';
        document.querySelector('#currentmainpagekey').innerHTML = currentKeys[4] || 'Space';
        document.querySelector('#currentresignkey').innerHTML = currentKeys[5] || "'";
        document.querySelector('#currentdossierkey').innerHTML = currentKeys[6] || 'M';
        document.querySelector('#currentdossiernationkey').innerHTML = currentKeys[7] || 'N';
        document.querySelector('#currentendorsekey').innerHTML = currentKeys[8] || 'Z';
        document.querySelector('#currentgcrkey').innerHTML = currentKeys[9] || 'G';
        document.querySelector('#currentviewregionkey').innerHTML = currentKeys[10] || 'D';
        document.querySelector('#currentworldactivitykey').innerHTML = currentKeys[11] || 'F';
        document.querySelector('#currentdidiupdatekey').innerHTML = currentKeys[12] || 'U';
        document.querySelector('#currentdelegatekey').innerHTML = currentKeys[13] || 'A';
        document.querySelector('#currentprepkey').innerHTML = currentKeys[14] || 'P';
        document.querySelector('#currentsettingskey').innerHTML = currentKeys[15] || '0';
    }
    async function displayCurrentSettings() {
        const currentSettings = await Promise.all([
            getCurrentKey('useragent'),
            getCurrentKey('jumppoint'),
            getCurrentKey('roname'),
            getCurrentKey('blockedregions'),
            getCurrentKey('dossierkeywords'),
            getCurrentKey('endorsekeywords'),
            getCurrentKey('operationmode'),
            getCurrentKey('occupationmode'),
            getCurrentKey('moveSoundEnabled'),
            getCurrentKey('moveSoundVolume'),
            getCurrentKey('customMoveSound'),
            getCurrentKey('loginlandingpage'),
            getCurrentKey('backgroundTint'),
            getCurrentKey('ssetimeout')
        ]);
        document.querySelector('#new-main-nation').value = currentSettings[0];
        document.querySelector('#current-jumppoint').innerHTML = currentSettings[1];
        document.querySelector('#current-roname').innerHTML = currentSettings[2];
        const blockedRegions = currentSettings[3] ?? [];
        const dossierKeywords = currentSettings[4] ?? [];
        const endorseKeywords = currentSettings[5] ?? [];
        const operationMode = currentSettings[6] || 'defending';
        const occupationMode = currentSettings[7] ?? false;
        const moveSoundEnabled = currentSettings[8] ?? false;
        const moveSoundVolume = currentSettings[9] ?? 50;
        const customMoveSound = currentSettings[10];
        const loginLandingPage = normalizeLandingPage(currentSettings[11]) || 'page=un';
        const backgroundTint = currentSettings[12] ?? {};
        const chaseHappeningsTimeout = currentSettings[13] ?? 10;
        const switcherSettings = await new Promise((resolve) => chrome.storage.local.get(['prepswitchers', 'switchers'], resolve));
        const switchers = switcherSettings.prepswitchers?.length ?
            switcherSettings.prepswitchers :
            (switcherSettings.switchers ?? []).map((switcher) => switcher.name);
        for (let i = 0; i !== blockedRegions.length; i++)
            document.querySelector('#current-blocked-regions').innerHTML += `${blockedRegions[i]}<br>`;
        for (let i = 0; i !== dossierKeywords.length; i++)
            document.querySelector('#current-dossier-keywords').innerHTML += `<b>${dossierKeywords[i]}</b><br>`;
        for (let i = 0; i !== endorseKeywords.length; i++)
            document.querySelector('#endorse-keywords').value += `${endorseKeywords[i]}\n`;
        document.querySelector(`#operation-mode-${operationMode}`).checked = true;
        document.querySelector('#current-operation-mode').innerHTML = operationMode;
        document.querySelector('#occupation-mode-toggle').checked = Boolean(occupationMode);
        document.querySelector('#current-occupation-mode').innerHTML = occupationMode ? 'Enabled' : 'Disabled';
        document.querySelector('#move-sound-toggle').checked = Boolean(moveSoundEnabled);
        document.querySelector('#current-move-sound-status').innerHTML = moveSoundEnabled ? 'Enabled' : 'Disabled';
        document.querySelector('#move-sound-volume').value = moveSoundVolume.toString();
        document.querySelector('#current-move-sound-volume').innerHTML = moveSoundVolume.toString();
        // Set custom sound status
        document.querySelector('#current-custom-sound-status').innerHTML = customMoveSound ? 'Custom' : 'Default';
        document.querySelector('#login-landing-page').value = loginLandingPage;
        document.querySelector('#current-login-landing-page').innerHTML = loginLandingPage;
        document.querySelector('#chase-happenings-timeout').value = chaseHappeningsTimeout.toString();
        document.querySelector('#switchers').value = switchers.join('\n');
        setBackgroundTintInputs(backgroundTint);
    }
    await displayCurrentKeys();
    await displayCurrentSettings();
})();
