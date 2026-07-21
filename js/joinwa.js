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
    window.addEventListener('hashchange', () => {
        let a = document.querySelectorAll('a');
        for (let i = 0; i !== a.length; i++) {
            let link = a[i].href;
            if (link.indexOf('join_WA') !== -1) {
                const switcherRegex = new RegExp(`nation=([A-Za-z0-9_-]+)[?&]appid=([A-Za-z0-9_-]+)`, 'g');
                console.log(link);
                const match = switcherRegex.exec(link);
                const newSwitcher = {
                    name: match[1],
                    appid: match[2]
                };
                addSwitcher(newSwitcher);
            }
        }
    });
})();
