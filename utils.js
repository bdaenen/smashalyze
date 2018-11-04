(function() {
    'use strict';
    let transformFunctions = require('transforms');
    let utils = {
        /**
         * @param input
         * @param output
         * @param config
         */
        drawToCanvas: function (input, output, config) {
            let ctxIn = input.getContext('2d');
            let ctxOut = output.getContext('2d');
            let imgData = ctxIn.getImageData(config.sx, config.sy, config.sw, config.sh);

            if (config.transform_func) {
                imgData = transformFunctions[config.transform_func](imgData, config.transform_params);
            }
            ctxOut.clearRect(0, 0, ctxOut.canvas.width, ctxOut.canvas.height);
            ctxOut.putImageData(imgData, 0, 0);
        }
    };

    exports(utils, 'utils');
}());
