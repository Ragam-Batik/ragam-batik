const UrlParser = {
    parseActiveUrlWithCombiner() {
        const url = window.location.hash.slice(1).toLowerCase();
        const splittedUrl = this._urlSplitter(url);

        let combinedUrl = `/${splittedUrl[0] || ''}`;

        if (splittedUrl.length > 1) {
            if (splittedUrl[0] === 'hasilsearch') {
                combinedUrl += '/:keyword';
            } else if (splittedUrl[0] === 'hasilscan') {
                combinedUrl += '/:id';
            } else {
                combinedUrl += '/:id';
            }
        }

        if (splittedUrl.length > 2) {
            combinedUrl += `/${splittedUrl[2]}`;
        }

        if (combinedUrl === '/') {
            return '/';
        }

        return combinedUrl.replace(/\/\//g, '/');
    },

    parseActiveUrlWithoutCombiner() {
        const url = window.location.hash.slice(1); 
        const splittedUrl = url.split('/').filter(s => s !== '');

        return {
            resource: splittedUrl[0] || null,
            id: splittedUrl[1] || null, 
            verb: splittedUrl[2] || null,
        };
    },

    _urlSplitter(url) {
        return url.split('/').filter(s => s !== '');
    },
};

export default UrlParser;