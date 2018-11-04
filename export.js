(function() {
    window.exports = function(valueToExport, key) {
        !window.Smashalyze && (window.Smashalyze = {});
        window.Smashalyze[key] = valueToExport;
    };

    window.require = function(key) {
        return window.Smashalyze[key];
    };

    let debug = {
        drawCanvas: false,
        logOCR: false,
        logState: false
    };

    exports(debug, 'debug');

    let tesseractConfig = {
        lang: 'eng',
        workerPath: 'lib/'/*,
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'*/
    };

    exports(tesseractConfig, 'tesseractConfig');
}());
