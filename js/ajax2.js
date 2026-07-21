(() => {
    const getListItems = () => Array.from(document.querySelectorAll('li'));
    const getListItemImages = (item) => item.querySelectorAll('img');
    const resizeImage = (image) => {
        if (image) {
            image.style.width = '20px';
            image.style.height = '20px';
        }
    };
    const updateLinkHref = (link, regex) => {
        const match = regex.exec(link.href);
        if (match) {
            link.href = `/template-overall=none/${match[1]}`;
        }
        return link;
    };
    const processLinks = () => {
        const links = Array.from(document.querySelectorAll('a'));
        const itemRegex = /page=ajax2\/.+?\/((?:nation|region)=.+)/;
        links.forEach(link => updateLinkHref(link, itemRegex));
    };
    const processImages = () => {
        const items = getListItems();
        items.forEach(item => {
            const images = getListItemImages(item);
            images.forEach(resizeImage);
        });
    };
    if (urlParameters['page'] === 'ajax2') {
        processLinks();
        processImages();
    }
})();
