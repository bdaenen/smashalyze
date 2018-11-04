(function() {
    'use strict';

    let transformFunctions = {
        bw: function(imgData, params) {
            let data = imgData.data;

            for(let i = 0; i < data.length; i += 4) {
                let brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];

                // Alter this threshold and re-test with different src images.
                if (brightness > (params.threshold || 100)) {
                    brightness = 255;
                }
                else {
                    brightness = 0;
                }

                // red
                data[i] = brightness;
                // green
                data[i + 1] = brightness;
                // blue
                data[i + 2] = brightness;
            }

            return imgData;
        },
        black_text: function(imgData, params){
            params = params || {};
            let tolerance = params.tolerance || 100;
            let rgb = [];
            let sum;
            for (let i = 0; i < imgData.data.length; i += 4) {
                rgb[0] = imgData.data[i];
                rgb[1] = imgData.data[i+1];
                rgb[2] = imgData.data[i+2];
                sum = imgData.data[i] + imgData.data[i+1] + imgData.data[i+2];

                if (sum >= tolerance) {
                    imgData.data[i] = 255;
                    imgData.data[i+1] = 255;
                    imgData.data[i+2] = 255;
                }
            }
            return imgData;
        },
        white_text: function(imgData, params){
            params = params || {};
            let tolerance = params.tolerance || 0;
            let rgb = [];
            for (let i = 0; i < imgData.data.length; i += 4) {
                rgb[0] = imgData.data[i];
                rgb[1] = imgData.data[i+1];
                rgb[2] = imgData.data[i+2];
                if (Math.abs(rgb[0] - rgb[1]) > tolerance || Math.abs(rgb[1] - rgb[2]) > tolerance || Math.abs(rgb[2] - rgb[0]) > tolerance) {
                    imgData.data[i] = 17;
                    imgData.data[i+1] = 17;
                    imgData.data[i+2] = 17;
                }
            }
            return imgData;
        },
        white_text_grey_bg: function(imgData, params){
            params = params || {};
            let tolerance = params.tolerance || 100;
            let rgb = [];
            let sum;
            for (let i = 0; i < imgData.data.length; i += 4) {
                rgb[0] = imgData.data[i];
                rgb[1] = imgData.data[i+1];
                rgb[2] = imgData.data[i+2];
                sum = imgData.data[i] + imgData.data[i+1] + imgData.data[i+2];

                if (sum <= 740) {
                    imgData.data[i] = 0;
                    imgData.data[i+1] = 0;
                    imgData.data[i+2] = 0;
                }
            }
            return imgData;
        }
    };

    exports(transformFunctions, 'transforms');
}());
