/*:
// PLUGIN □────────────────────────────────□ Scene_Title □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Scene_Boot
* V.1.0
* License:© M.I.T

└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:

*/
class Scene_Map1 extends _Scene_Base {
    constructor(sceneData,className) {
        super(sceneData,className);
        this.name = className;
        this.audio = {bgm:null,bgs:null};
    };


    // prepare and set event for map 1
    start(){ //TODO: on pourrait l'appelelr preload ? prepare ? load bg + obj sprite , et mettre renderable true dans un ready()
    //TODO: la camera apply la converiton 2.5d, voir pour preconvetir chaque sprite dans les constructor FIXME:
        super.start();
        this.setupObjs();
        this.setupLights();
        this.setupPlayer();
        this.setupCamera();
        this.setupObjetInteractive(); // creer les listeners des objet click pour la map
        this.setupEventCases(); // setup interactivity for events case in map1?
        this.setupAudio();
        //$camera.moveToTarget($player);
       //$stage.goto();
       
    };

    setupObjs(){
        $objs.createSpritesObjsFrom(this.name); //create objs from className json
        $objs.list_s.length && this.addChild(...$objs.list_s);
    };

    setupLights(){
        //const dataValues = $Loader.DataScenes[this.name]._lights.ambientLight;
        //$stage.LIGHTS.ambientLight.asignValues(dataValues, true);
    }

    setupPlayer(){
        this.addChild($player.spine);
        this.addChild($player2.spine);
        // TODO: stoker le case id de transfer dans $player
        const toID = $player._nextTransferID || 0;
        const toCase = $objs.cases_s[0]; // target case
        if( toCase ){
            $player.p.position.copy(toCase.position);
            $player.p.zIndex = $player.s.y;
            $player.inCase = toCase.dataObj; //TODO: add from arg, utiliser pour transferer d'une map a lautre, le id de la procahien case.
        };
        $player2.moveToPlayer();
        
    }

    setupCamera(){
       $camera.moveToTarget($player.spine.position);
    };

    // Events initialisator and hack optimiser
    // setup hack or change context in current map base on global variable
    setupEventCases(){
        // TODO: METTRE LES ID CASE UNIQUE ?
        if(!$gameVariables._wallMaisonDroiteDetuits){
            // empeche la case id id 8 detre selectionner
            console.log('TODO:: ', 'caseSousMurMaison');
            /*$objs.getCase_FromName('caseSousMurMaison').conditionInteractive = () => { 
                return $gameVariables._wallMaisonDroiteDetuits 
            };*/
        };
    }

    // active les interactions sur cette map ? , les interaction exist deja
    setupObjetInteractive(){
       // $huds.setInteractive(true);
    };

    /** setup the audio from this map */
    setupAudio(){
        const bgm = $audio._sounds.setuniman__cozy_0_16.play();
        bgm.loop = true;
        bgm.speed = 0.95;
        this.audio.bgm = bgm;
    };

    update(delta){
       super.update();
    if(!this._runned){
     this._runned = true;
    
     
    }
    };

    end(){
        
    };
};
