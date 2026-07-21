(async () => {
    await dieIfNoUserAgent();
    const nationTitle = document.querySelector('.newtitlename');
    const crossButton = document.createElement('input');
    crossButton.setAttribute('type', 'button');
    setReliantButtonLabel(crossButton, 'Set Cross');
    crossButton.setAttribute('class', 'button');
    nationTitle.appendChild(crossButton);
    function refreshNationKeyDisplays() {
        void applyReliantButtonKeyDisplays([
            { selector: '.cross', keySetting: 'endorsekey', defaultKey: 'Z' },
            { selector: '#reliant-track', keySetting: 'dossiernationkey', defaultKey: 'N' },
        ]);
    }
    async function getNationEndorsements(nationName) {
        const regex = /^.+nation=(.+)$/g;
        return Array.from(document.querySelectorAll('.unbox .nlink'))
            .map((element) => element.href)
            .map((href) => href.match(regex)[0].replace(regex, '$1'));
    }
    async function setCrossClick(e) {
        const nationName = urlParameters['nation'];
        let endorsingNations = await getNationEndorsements(nationName);
        endorsingNations.reverse();
        const sidePanel = document.querySelector('#panel');
        const endorsementList = document.createElement('ul');
        for (let i = 0; i !== endorsingNations.length; i++) {
            const listItem = document.createElement('li');
            const endorseButton = document.createElement('input');
            endorseButton.setAttribute('type', 'button');
            endorseButton.setAttribute('class', 'ajaxbutton cross');
            setReliantButtonLabel(endorseButton, `Endorse ${pretty(endorsingNations[i])}`);
            function onEndorseClick(e) {
                chrome.storage.local.get('localid', async (result) => {
                    const localId = result.localid;
                    let formData = new FormData();
                    formData.set('nation', endorsingNations[i]);
                    formData.set('localid', localId);
                    formData.set('action', 'endorse');
                    await makeAjaxQuery('/cgi-bin/endorse.cgi', 'POST', formData);
                });
                const button = e.target;
                removeReliantButtonKeyHint(button);
                button.remove();
            }
            endorseButton.addEventListener('click', onEndorseClick);
            listItem.appendChild(endorseButton);
            endorsementList.appendChild(listItem);
        }
        sidePanel.appendChild(endorsementList);
        refreshNationKeyDisplays();
    }
    crossButton.addEventListener('click', setCrossClick);
    const nationName = canonicalize(document.querySelector('#content > div.lineundercover > div.newnonflagstuff > div.newtitlebox > div.newtitlename > a').textContent);
    console.log(nationName);
    // Replace add to dossier button
    // Remove it first
    const dossierButton = document.querySelector('button[value=add]');
    if (!dossierButton) {
        return;
    }
    dossierButton.parentElement.removeChild(dossierButton);
    // Get tracked nations
    const trackedNations = await getStorageValue('trackednations') || [];
    // Add a new button
    const trackButton = document.createElement('input');
    trackButton.setAttribute('type', 'button');
    setReliantButtonLabel(trackButton, 'Track');
    trackButton.setAttribute('class', 'button');
    trackButton.setAttribute('id', 'reliant-track');
    const stopTrackingButton = document.createElement('input');
    stopTrackingButton.setAttribute('type', 'button');
    setReliantButtonLabel(stopTrackingButton, 'Stop Tracking');
    stopTrackingButton.setAttribute('class', 'button');
    // Add the button to the page
    async function buttonListener(e) {
        // Fetch fresh tracked nations to avoid race conditions with multiple tabs
        const currentTrackedNations = await getStorageValue('trackednations') || [];
        const button = e.target;
        if (getReliantButtonLabel(button) === 'Track') {
            if (!currentTrackedNations.includes(nationName)) {
                currentTrackedNations.push(nationName);
                await setStorageValue('trackednations', currentTrackedNations);
            }
            setReliantButtonLabel(button, 'Stop Tracking');
        }
        else {
            const index = currentTrackedNations.indexOf(nationName);
            if (index !== -1) {
                currentTrackedNations.splice(index, 1);
                await setStorageValue('trackednations', currentTrackedNations);
            }
            setReliantButtonLabel(button, 'Track');
        }
        refreshNationKeyDisplays();
    }
    stopTrackingButton.addEventListener('click', buttonListener);
    trackButton.addEventListener('click', buttonListener);
    if (trackedNations.includes(nationName)) {
        document.querySelector('#composebutton').parentElement.appendChild(stopTrackingButton);
    }
    else {
        document.querySelector('#composebutton').parentElement.appendChild(trackButton);
    }
    refreshNationKeyDisplays();
})();
