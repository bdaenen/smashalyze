(function() {
    let utils = require('utils');
    let debug = require('debug');
    let tesseractConfig = require('tesseractConfig');

    /**
     * @param inputCanvas
     * @constructor BaseState
     * @type BaseState
     */
    function BaseState(inputCanvas, name) {
        this.config = {};
        this.name = name || 'base';
        this.container = null;
        this.inputCanvas = inputCanvas;
        this.tesseract = window.Tesseract.create({
            workerPath: tesseractConfig.workerPath,
            langPath: tesseractConfig.langPath,
            corePath: tesseractConfig.corePath,
        });
        this.tesseract = _.cloneDeep(window.Tesseract);
        this.operationCanvases = {};
        this._active = false;

        this.outputData = {};
        this.outputDataTemplate = {};
    }

    Object.defineProperty(BaseState.prototype, 'active', {
        get: function() {
            return this._active;
        },
        set: function(v) {
            if (!v && this._active) {
                Object.freeze(this.outputData);
            }
            else if (v && !this._active) {
                this.outputData = _.cloneDeep(this.outputDataTemplate);
                this._active = false;
            }
        }
    });

    let p = BaseState.prototype;

    /**
     * Detect whether this is the state that should be running or not.
     */
    p.detect = function(callback) {
        utils.drawToCanvas(this.inputCanvas, this.operationCanvases.detection, this.config.detection);

        const canvas = this.operationCanvases.detection;
        this.tesseract.recognize(canvas, tesseractConfig)
            .then(function(result){
                this.outputData.detection = result.text.trim();
                if (debug.logOCR) {
                    console.log('OCR:', state, 'detection' + ':', this.outputData.detection);
                }
                callback(this.outputData.detection === this.config.detection.comparison);
            }.bind(this));
    };

    /**
     * Initialize the state.
     */
    p.init = function(config) {
        if (name) {
            this.name = name;
        }
        this.config = config;

        /** @type {HTMLElement} */
        this.container = document.createElement('div');
        this.container.classList.add('state-container');
        this.container.dataset.state = this.name;
        this.container.innerHTML = '';
        //document.body.appendChild(this.container);

        let frag = document.createDocumentFragment();
        let canvas = document.createElement('canvas');
        canvas.id = this.name + '_detection';
        canvas.width = this.config.detection.sw;
        canvas.height = this.config.detection.sh;
        canvas.dataset.state = this.name;
        this.operationCanvases.detection = canvas;

        this.initConfigElements(frag);

        frag.appendChild(canvas);

        if (require('debug').drawCanvas) {
            this.container.appendChild(frag);
        }
    };

    /**
     * @param {HTMLElement} parentNode
     */
    p.initConfigElements = function(parentNode) {
        Object.keys(this.config).forEach(function (configKey) {
            this.outputDataTemplate[configKey] = [];
            if (configKey === 'detection') {
                this.outputDataTemplate[configKey] = '';
            }
            else {
                this.operationCanvases[configKey] = [];
                this.config[configKey].forEach(function(canvasConfig, i){
                    let canvas = document.createElement('canvas');
                    canvas.id = this.name + '_' + configKey + '_' + i;
                    canvas.width = canvasConfig.sw;
                    canvas.height = canvasConfig.sh;
                    canvas.dataset.sx = canvasConfig.sx;
                    canvas.dataset.sy = canvasConfig.sy;
                    canvas.dataset.transform_func = canvasConfig.transform_func;
                    canvas.dataset.transform_params = JSON.stringify(canvasConfig.transform_params);
                    this.operationCanvases[configKey].push(canvas);

                    parentNode.appendChild(canvas);
                }, this)
            }
        }, this);

        this.outputData = _.cloneDeep(this.outputDataTemplate);
    };

    /**
     *
     */
    p.render = function() {
        if (!this.active) {
            return;
        }
        Object.keys(this.operationCanvases).forEach(function(key) {
            if (key === 'detection') {
                return;
            }
            this.operationCanvases[key].forEach(function(canvas, i) {
                utils.drawToCanvas(this.inputCanvas, canvas, this.config[key][i]);
            }, this);
        }, this);
    };

    /**
     * @param callback
     */
    p.update = function(callback) {
        if (!this.active) {
            return;
        }
        let runningJobs = 0;

        Object.keys(this.config).forEach(function(key){
            if (key === 'detection') {
                return;
            }
            else {
                this.config[key].forEach(function(config, i){
                    const canvas = this.operationCanvases[key][i];
                    runningJobs++;
                    this.tesseract.recognize(canvas, tesseractConfig)
                        .then(function(result){
                            console.log(result.text.trim());
                            this.outputData[key][i] = result.text.trim();
                            if (debug.logOCR) {
                                console.log('OCR:', state, key, i + ':', this.outputData[key][i]);
                            }
                            runningJobs--;
                            if (!runningJobs && typeof callback === 'function') {
                                callback(this.outputData);
                            }
                        }.bind(this));
                }, this);
            }
        }, this);
    };

    console.log(p);

    BaseState.prototype = p;

    exports(BaseState, 'BaseState');
}());
