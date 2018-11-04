(function() {
    /**
     * @var {BaseState} BaseState
     */
    let BaseState = require('BaseState');
    console.log(BaseState.prototype);

    /**
     * @param inputCanvas
     * @param name
     * @constructor MatchState
     */
    function MatchState(inputCanvas, name) {
        BaseState.call(this, inputCanvas, name || 'match');
        this.imgList = ['bayonetta_01.png','bayonetta_02.png','bayonetta_03.png','bayonetta_04.png','bayonetta_05.png','bayonetta_06.png','bayonetta_07.png','bayonetta_08.png','captain_01.png','captain_02.png','captain_03.png','captain_04.png','captain_05.png','captain_06.png','captain_07.png','captain_08.png','cloud_01.png','cloud_02.png','cloud_03.png','cloud_04.png','cloud_05.png','cloud_06.png','cloud_07.png','cloud_08.png','dedede_01.png','dedede_02.png','dedede_03.png','dedede_04.png','dedede_05.png','dedede_06.png','dedede_07.png','dedede_08.png','diddy_01.png','diddy_02.png','diddy_03.png','diddy_04.png','diddy_05.png','diddy_06.png','diddy_07.png','diddy_08.png','donkey_01.png','donkey_02.png','donkey_03.png','donkey_04.png','donkey_05.png','donkey_06.png','donkey_07.png','donkey_08.png','drmario_01.png','drmario_02.png','drmario_03.png','drmario_04.png','drmario_05.png','drmario_06.png','drmario_07.png','drmario_08.png','duckhunt_01.png','duckhunt_02.png','duckhunt_03.png','duckhunt_04.png','duckhunt_05.png','duckhunt_06.png','duckhunt_07.png','duckhunt_08.png','falco_01.png','falco_02.png','falco_03.png','falco_04.png','falco_05.png','falco_06.png','falco_07.png','falco_08.png','fox_01.png','fox_02.png','fox_03.png','fox_04.png','fox_05.png','fox_06.png','fox_07.png','fox_08.png','gamewatch_01.png','gamewatch_02.png','gamewatch_03.png','gamewatch_04.png','gamewatch_05.png','gamewatch_06.png','gamewatch_07.png','gamewatch_08.png','ganon_01.png','ganon_02.png','ganon_03.png','ganon_04.png','ganon_05.png','ganon_06.png','ganon_07.png','ganon_08.png','gekkouga_01.png','gekkouga_02.png','gekkouga_03.png','gekkouga_04.png','gekkouga_05.png','gekkouga_06.png','gekkouga_07.png','gekkouga_08.png','ike_01.png','ike_02.png','ike_03.png','ike_04.png','ike_05.png','ike_06.png','ike_07.png','ike_08.png','kamui_01.png','kamui_02.png','kamui_03.png','kamui_04.png','kamui_05.png','kamui_06.png','kamui_07.png','kamui_08.png','kirby_01.png','kirby_02.png','kirby_03.png','kirby_04.png','kirby_05.png','kirby_06.png','kirby_07.png','kirby_08.png','koopa_01.png','koopa_02.png','koopa_03.png','koopa_04.png','koopa_05.png','koopa_06.png','koopa_07.png','koopa_08.png','koopajr_01.png','koopajr_02.png','koopajr_03.png','koopajr_04.png','koopajr_05.png','koopajr_06.png','koopajr_07.png','koopajr_08.png','link_01.png','link_02.png','link_03.png','link_04.png','link_05.png','link_06.png','link_07.png','link_08.png','littlemac_01.png','littlemac_02.png','littlemac_03.png','littlemac_04.png','littlemac_05.png','littlemac_06.png','littlemac_07.png','littlemac_08.png','littlemac_09.png','littlemac_10.png','littlemac_11.png','littlemac_12.png','littlemac_13.png','littlemac_14.png','littlemac_15.png','littlemac_16.png','lizardon_01.png','lizardon_02.png','lizardon_03.png','lizardon_04.png','lizardon_05.png','lizardon_06.png','lizardon_07.png','lizardon_08.png','lucario_01.png','lucario_02.png','lucario_03.png','lucario_04.png','lucario_05.png','lucario_06.png','lucario_07.png','lucario_08.png','lucas_01.png','lucas_02.png','lucas_03.png','lucas_04.png','lucas_05.png','lucas_06.png','lucas_07.png','lucas_08.png','lucina_01.png','lucina_02.png','lucina_03.png','lucina_04.png','lucina_05.png','lucina_06.png','lucina_07.png','lucina_08.png','luigi_01.png','luigi_02.png','luigi_03.png','luigi_04.png','luigi_05.png','luigi_06.png','luigi_07.png','luigi_08.png','mario_01.png','mario_02.png','mario_03.png','mario_04.png','mario_05.png','mario_06.png','mario_07.png','mario_08.png','marth_01.png','marth_02.png','marth_03.png','marth_04.png','marth_05.png','marth_06.png','marth_07.png','marth_08.png','metaknight_01.png','metaknight_02.png','metaknight_03.png','metaknight_04.png','metaknight_05.png','metaknight_06.png','metaknight_07.png','metaknight_08.png','mewtwo_01.png','mewtwo_02.png','mewtwo_03.png','mewtwo_04.png','mewtwo_05.png','mewtwo_06.png','mewtwo_07.png','mewtwo_08.png','miiall_01.png','miiall_02.png','miifighter_01.png','miigunner_01.png','miiswordsman_01.png','murabito_01.png','murabito_02.png','murabito_03.png','murabito_04.png','murabito_05.png','murabito_06.png','murabito_07.png','murabito_08.png','ness_01.png','ness_02.png','ness_03.png','ness_04.png','ness_05.png','ness_06.png','ness_07.png','ness_08.png','pacman_01.png','pacman_02.png','pacman_03.png','pacman_04.png','pacman_05.png','pacman_06.png','pacman_07.png','pacman_08.png','palutena_01.png','palutena_02.png','palutena_03.png','palutena_04.png','palutena_05.png','palutena_06.png','palutena_07.png','palutena_08.png','peach_01.png','peach_02.png','peach_03.png','peach_04.png','peach_05.png','peach_06.png','peach_07.png','peach_08.png','pikachu_01.png','pikachu_02.png','pikachu_03.png','pikachu_04.png','pikachu_05.png','pikachu_06.png','pikachu_07.png','pikachu_08.png','pikmin_01.png','pikmin_02.png','pikmin_03.png','pikmin_04.png','pikmin_05.png','pikmin_06.png','pikmin_07.png','pikmin_08.png','pit_01.png','pit_02.png','pit_03.png','pit_04.png','pit_05.png','pit_06.png','pit_07.png','pit_08.png','pitb_01.png','pitb_02.png','pitb_03.png','pitb_04.png','pitb_05.png','pitb_06.png','pitb_07.png','pitb_08.png','purin_01.png','purin_02.png','purin_03.png','purin_04.png','purin_05.png','purin_06.png','purin_07.png','purin_08.png','reflet_01.png','reflet_02.png','reflet_03.png','reflet_04.png','reflet_05.png','reflet_06.png','reflet_07.png','reflet_08.png','robot_01.png','robot_02.png','robot_03.png','robot_04.png','robot_05.png','robot_06.png','robot_07.png','robot_08.png','rockman_01.png','rockman_02.png','rockman_03.png','rockman_04.png','rockman_05.png','rockman_06.png','rockman_07.png','rockman_08.png','rosetta_01.png','rosetta_02.png','rosetta_03.png','rosetta_04.png','rosetta_05.png','rosetta_06.png','rosetta_07.png','rosetta_08.png','roy_01.png','roy_02.png','roy_03.png','roy_04.png','roy_05.png','roy_06.png','roy_07.png','roy_08.png','ryu_01.png','ryu_02.png','ryu_03.png','ryu_04.png','ryu_05.png','ryu_06.png','ryu_07.png','ryu_08.png','samus_01.png','samus_02.png','samus_03.png','samus_04.png','samus_05.png','samus_06.png','samus_07.png','samus_08.png','sheik_01.png','sheik_02.png','sheik_03.png','sheik_04.png','sheik_05.png','sheik_06.png','sheik_07.png','sheik_08.png','shulk_01.png','shulk_02.png','shulk_03.png','shulk_04.png','shulk_05.png','shulk_06.png','shulk_07.png','shulk_08.png','sonic_01.png','sonic_02.png','sonic_03.png','sonic_04.png','sonic_05.png','sonic_06.png','sonic_07.png','sonic_08.png','szerosuit_01.png','szerosuit_02.png','szerosuit_03.png','szerosuit_04.png','szerosuit_05.png','szerosuit_06.png','szerosuit_07.png','szerosuit_08.png','toonlink_01.png','toonlink_02.png','toonlink_03.png','toonlink_04.png','toonlink_05.png','toonlink_06.png','toonlink_07.png','toonlink_08.png','wario_01.png','wario_02.png','wario_03.png','wario_04.png','wario_05.png','wario_06.png','wario_07.png','wario_08.png','wiifit_01.png','wiifit_02.png','wiifit_03.png','wiifit_04.png','wiifit_05.png','wiifit_06.png','wiifit_07.png','wiifit_08.png','yoshi_01.png','yoshi_02.png','yoshi_03.png','yoshi_04.png','yoshi_05.png','yoshi_06.png','yoshi_07.png','yoshi_08.png','zelda_01.png','zelda_02.png','zelda_03.png','zelda_04.png','zelda_05.png','zelda_06.png','zelda_08.png','zelda_07.png'];
    }

    MatchState.prototype = Object.create(BaseState.prototype);
    MatchState.prototype.constructor = MatchState;

    let p = MatchState.prototype;

    /**
     * We can't easily detect this one, so use it as the default.
     */
    p.detect = function(callback) {
        callback(true);
    };

    /**
     * Initialize the state.
     */
    p.init = function(config) {
        BaseState.prototype.init.call(this, config);

        let frag = document.createDocumentFragment();
        this.imgList.forEach(function(imgPath){
            let img = document.createElement('img');
            img.src = '../assets/stock/' + imgPath;
            frag.appendChild(img);
        });
        this.container.appendChild(frag);
    };

    /**
     *
     */
    p.render = function() {
        if (!this.active) {
            return;
        }

        BaseState.prototype.render.call(this);

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

    exports(MatchState, 'MatchState');
}());
