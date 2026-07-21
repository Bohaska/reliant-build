(() => {
    function addSwitcher(newSwitcher) {
        chrome.storage.local.get(['switchers', 'prepswitchers'], (result) => {
            let switchers = [];
            if (typeof result.switchers !== 'undefined')
                switchers = result.switchers;
            if (!(switchers.some(switcher => switcher.name === newSwitcher.name))) {
                switchers.push(newSwitcher);
                chrome.storage.local.set({ 'switchers': orderSwitchersByPrepList(switchers, result.prepswitchers ?? []) });
            }
        });
    }
    if (urlParameters['page'] === 'join_WA') {
        const switcherRegex = new RegExp(`nation=([A-Za-z0-9_-]+)[?&]appid=([A-Za-z0-9_-]+)`, 'g');
        const match = switcherRegex.exec(document.URL);
        const newSwitcher = {
            name: match[1],
            appid: match[2]
        };
        addSwitcher(newSwitcher);
    }
})();
