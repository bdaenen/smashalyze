(function() {
  var videoCanvas = document.getElementById('canvas');
  var videoCtx = videoCanvas.getContext('2d');
  var video = document.getElementById('video');
  var ocrEnabled = false;
  var tesseractJobs = {};
  var tesseractInterval = 4000;
  var stateDetectionInterval = 1000;
  var debug = {
    drawCanvas: true,
    logOCR: false,
    logState: false
  };

  var canvases = {};
  var ocrOutput = {};
  window.ocrOutput = ocrOutput;
  var transformFunctions = {
    black_text: function(imgData, params){
      params = params || {};
      var tolerance = params.tolerance || 100;
      var rgb = [];
      var sum;
      for (var i = 0; i < imgData.data.length; i += 4) {
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
      var tolerance = params.tolerance || 0;
      var rgb = [];
      for (var i = 0; i < imgData.data.length; i += 4) {
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
      var tolerance = params.tolerance || 100;
      var rgb = [];
      var sum;
      for (var i = 0; i < imgData.data.length; i += 4) {
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
  var stateDetectConfigs = {
    character_select: {
      sx: 1122,
      sy: 40,
      sw: 60,
      sh: 37,
      comparison: 'Off'
    },
    stage_select: {
      sx: 195,
      sy: 50,
      sw: 214,
      sh: 38,
      transform_func: 'white_text_grey_bg',
      transform_params: {tolerance: 0},
      comparison: 'Stage Select'
    }
  };

  var stateDetectCanvases = {};
  var canvasConfigs = {
    character_select: {
      stocks: [{
        sx: 850,
        sy: 35,
        sw: 100,
        sh: 40,
        transform_func: 'black_text',
        transform_params: {tolerance: 0}
      }],
      tags: [
        {
          sx: 90,
          sy: 640,
          sw: 195,
          sh: 30,
          transform_func: 'black_text',
          transform_params: {tolerance: 100}
        },
        {
          sx: 392,
          sy: 640,
          sw: 195,
          sh: 30,
          transform_func: 'black_text',
          transform_params: {tolerance: 100}
        },
        {
          sx: 694,
          sy: 640,
          sw: 195,
          sh: 30,
          transform_func: 'black_text',
          transform_params: {tolerance: 100}
        },
        {
          sx: 996,
          sy: 640,
          sw: 195,
          sh: 30,
          transform_func: 'black_text',
          transform_params: {tolerance: 100}
        }
      ],
      character_names: [
        {
          sx: 25,
          sy: 565,
          sw: 285,
          sh: 50,
          transform_func: 'white_text',
          transform_params: {tolerance: 0}
        },
        {
          sx: 342,
          sy: 565,
          sw: 285,
          sh: 50,
          transform_func: 'white_text',
          transform_params: {tolerance: 0}
        },
        {
          sx: 659,
          sy: 565,
          sw: 285,
          sh: 50,
          transform_func: 'white_text',
          transform_params: {tolerance: 0}
        },
        {
          sx: 976,
          sy: 565,
          sw: 285,
          sh: 50,
          transform_func: 'white_text',
          transform_params: {tolerance: 0}
        }
      ]
    },
    // TODO: make 2 stage select zones, one for each size.
    // Pick the one closest to a stage name on fuzzy matching.
    stage_select: {
      stage: [{
        sx: 117,
        sy: 465,
        sw: 440,
        sh: 110,
        transform_func: 'white_text',
        transform_params: {tolerance: 0}
      }]
    }
  };
  var STATE_CHARACTER_SELECT = 'character_select';
  var STATE_STAGE_SELECT = 'stage_select';
  var STATE_MATCH = 'match';
  var STATE_SCORE = 'score';
  var resolutionScale = 1;
  var current_state = null;
  var resolution = {
    x: 1280,
    y: 720
  };
  var tesseractConfig = {
    lang: 'eng'/*,
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'*/
  };

  var tagCanvas = {
    1: document.getElementById('tag_1'),
    2: document.getElementById('tag_2'),
    3: document.getElementById('tag_3'),
    4: document.getElementById('tag_4')
  };

  var tagSpans = {
    1: document.getElementById('tag_1_text'),
    2: document.getElementById('tag_2_text'),
    3: document.getElementById('tag_3_text'),
    4: document.getElementById('tag_4_text')
  };

  var charCanvas = {
    1: document.getElementById('character_1'),
    2: document.getElementById('character_2'),
    3: document.getElementById('character_3'),
    4: document.getElementById('character_4')
  };
  var charSpans = {
    1: document.getElementById('character_1_text'),
    2: document.getElementById('character_2_text'),
    3: document.getElementById('character_3_text'),
    4: document.getElementById('character_4_text')
  };

  // TODO: properly split up in different "modes" so we can keep track of what state the game is in.
  // TODO: when a match ends, combine the collected data into a proper match and send it off to the API.
  // TODO: make resolution scaleable. Everything is now made for 1280x720 footage.
  // TODO: allow for definable zones?
  Object.keys(stateDetectConfigs).forEach(function(state) {
    var canvas = document.createElement('canvas');
    var config = stateDetectConfigs[state];

    canvas.id = state + '_detection';
    canvas.width = config.sw;
    canvas.height = config.sh;
    canvas.dataset.state = state;
    stateDetectCanvases[state] = canvas;
    if (debug.drawCanvas) {
      document.body.appendChild(canvas);
    }
  });

  Object.keys(canvasConfigs).forEach(function(state){
    Object.keys(canvasConfigs[state]).forEach(function(type){
      canvasConfigs[state][type].forEach(function(config){
        canvases[state] = canvases[state] || {};
        canvases[state][type] = canvases[state][type] || [];
        ocrOutput[state] = ocrOutput[state] || {};
        ocrOutput[state][type] = ocrOutput[state][type] || [];

        var canvas = document.createElement('canvas');
        canvas.id = state + '_' + type + '_' + canvases[state][type].length;
        canvas.width = config.sw;
        canvas.height = config.sh;
        canvas.dataset.state = state;
        canvas.dataset.type = type;
        canvas.dataset.number = canvasConfigs[state][type].length;
        canvases[state][type].push(canvas);
        if (debug.drawCanvas) {
          document.body.appendChild(canvas);
        }
      });
    });
  });

// set canvas size = video size when known
  video.addEventListener('loadedmetadata', function() {
    videoCanvas.width = video.videoWidth;
    videoCanvas.height = video.videoHeight;
  });

  video.addEventListener('play', function() {
    var $this = this; //cache
    (function loop() {
      if (!$this.paused && !$this.ended) {
        videoCtx.drawImage($this, 0, 0, video.videoWidth, video.videoHeight, 0, 0, video.videoWidth, video.videoHeight);
        var src = cv.imread(videoCanvas);
        var dst1 = new cv.Mat(src.rows, src.cols, src.type());
        var dst2 = new cv.Mat(src.rows, src.cols, src.type());
        var ksize = new cv.Size(2, 2);
        var anchor = new cv.Point(-1, -1);
        var M = cv.Mat.ones(1, 1, cv.CV_8U);
        /*var blackLower = new cv.Mat(src.rows, src.cols, src.type(), [0, 0, 0, 0]);
        var blackHigher = new cv.Mat(src.rows, src.cols, src.type(), [100, 100, 100, 255]);
        var white = new cv.Mat(src.rows, src.cols, src.type(), [255, 255, 255, 255]);
        cv.inRange(src, white, white, dst1);
        cv.inRange(src, blackLower, blackHigher, dst2);*/
        cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
        cv.threshold(src, src, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);
        //cv.Canny(src, src, 50, 100, 3, false);
        cv.bitwise_not(src, src);
        cv.erode(src, src, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
        cv.dilate(src, src, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());


// You can try more different parameters
        cv.imshow(videoCanvas, src);
        //cv.imshow('black', dst2);
        //cv.imshow('white', dst1);
        src.delete();/*white.delete(); blackLower.delete(); blackHigher.delete();*/ dst1.delete(); dst2.delete();

        Object.keys(stateDetectConfigs).forEach(function(state) {
          drawToCanvas(stateDetectCanvases[state], stateDetectConfigs[state]);
        });

        if (current_state) {
          Object.keys(canvasConfigs[current_state]).forEach(function (type) {
            canvasConfigs[current_state][type].forEach(function(config, i){
              drawToCanvas(canvases[current_state][type][i], config);
            })
          });
        }

        ocrEnabled = true;
        setTimeout(loop, 1000 / 2); // drawing at 2fps
      }
    })();
  });

  setTimeout(function ocrState(){
    if (ocrEnabled) {
      Object.keys(stateDetectConfigs).forEach(function (state) {
        Tesseract2.recognize(stateDetectCanvases[state], tesseractConfig)
          .then(function(result){
            //console.warn(result.text.trim(), state);
            if (result.text.trim().toLowerCase() === stateDetectConfigs[state].comparison.toLowerCase()) {
              if (current_state !== state) {
                current_state = state;
                console.warn('STATE:', current_state);
                Tesseract._queue.length = 0;
                if (current_state === 'stage_select') {
                  tesseractInterval = 250;
                }
              }
            }
            if (debug.logOCR) {
              console.log('OCR:', state, 'state', result.text.trim().toLowerCase());
            }
            if (debug.logState) {
              console.warn('STATE:', current_state);
            }
          });
      });
    }
    setTimeout(ocrState, stateDetectionInterval);
  }, stateDetectionInterval);

  setTimeout(function callOcr(){
    if (ocrEnabled && current_state) {
      Object.keys(canvasConfigs[current_state]).forEach(function(type){
        canvasConfigs[current_state][type].forEach(function(config, i){
          const state = current_state;
          const canvas = canvases[state][type][i];
          Tesseract.recognize(canvas, tesseractConfig)
            .then(function(result){
              ocrOutput[state][type][i] = result.text.trim();
              if (debug.logOCR) {
                console.log('OCR:', state, type, i + ':', ocrOutput[state][type][i]);
              }
            });
        });
      });
    }

    setTimeout(callOcr, tesseractInterval);
  }, tesseractInterval);

  function drawToCanvas(canvas, config) {
    var ctx = canvas.getContext('2d');
    var imgData = videoCtx.getImageData(config.sx, config.sy, config.sw, config.sh);
    if (config.transform_func) {
      imgData = transformFunctions[config.transform_func](imgData, config.transform_params);
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.putImageData(imgData, 0, 0);
  }

}());
