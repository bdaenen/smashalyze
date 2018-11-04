(function() {
    let videoCanvas = document.createElement('canvas');
    let videoCtx = videoCanvas.getContext('2d');
    let video = document.getElementById('video');
    let states = [];
    let assembledData = {};

    let stateConfigs = {
        character_select: {
            detection: {
                sx: 1122,
                sy: 40,
                sw: 60,
                sh: 37,
                comparison: 'Off'
            },
            stocks: [{
                sx: 850,
                sy: 35,
                sw: 100,
                sh: 40,
                transform_func: 'white_text',
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
            ]/*,
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
            ]*/
        },
        match: {
            detection: {
                sx: 0,
                sy: 0,
                sw: 0,
                sh: 0,
                transform_func: 'bw',
                transform_params: {tolerance: 0},
                comparison: 'Stage Select'
            },
            // Todo: map these on a 4-player match and collapse on datamap
            stocks: [{
                sx: 292,
                sy: 676,
                sw: 22,
                sh: 22,
                deltaX: 5
              },
              {
                sx: 771,
                sy: 676,
                sw: 22,
                sh: 22,
                deltaX: 5
            }]
        }
    };

    let baseResolution = {
        x: 1280,
        y: 720
    };
    let resolutionScale = 1;
    let current_state = null;

    let MatchState = require('MatchState');
    let BaseState = require('BaseState');

    /** @var {MatchState} **/
    let matchState = new MatchState(videoCanvas);
    /** @var {CharacterSelectState} **/
    let characterSelectState = new BaseState(videoCanvas, 'character_select');

    states = [matchState, characterSelectState];

    states.forEach(function(state) {
        state.init(stateConfigs[state.name]);
    });

    console.log(states);

  // set canvas size = video size when known
    video.addEventListener('loadedmetadata', function() {
        videoCanvas.width = video.videoWidth;
        videoCanvas.height = video.videoHeight;
        if (require('debug').drawCanvas) {
          document.body.appendChild(videoCanvas);
        }
    });

    video.addEventListener('play', function() {
        let $this = this; //cache
        (function loop() {
            if (!$this.paused && !$this.ended) {
                videoCtx.drawImage($this, 0, 0, video.videoWidth, video.videoHeight, 0, 0, video.videoWidth, video.videoHeight);
                setTimeout(loop, 1000 / 10); // drawing at 10fps
            }
        })();
    });

    function stateUpdateLoop () {
        if (!video.paused && !video.ended) {
            states.forEach(function (state) {
                state.render();
                state.update(function(data){
                  assembledData[state.name] = assembledData[state.name] || {};
                  assembledData[state.name] = _.cloneDeep(data);
                });
            });
        }
        setTimeout(stateUpdateLoop, 2500);
    }

    stateUpdateLoop();

    setTimeout(function stateUpdate() {
        if (!video.paused && !video.ended) {
            states.forEach(function(state) {
                state.detect(function(active) {
                    state.active = active;
                    if (active) {
                        document.getElementById('state').innerText = state.name;
                        if (state === characterSelectState) {
                            // submitData();
                            assembledData = {};
                        }
                    }
                });
            });
        }
        setTimeout(stateUpdate, 4000);
    }, 4000);
}());
