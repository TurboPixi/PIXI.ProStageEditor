/*
* Les stage rend les scenes
*/
class _stage extends PIXI.display.Stage {
    constructor() {
        super();
        this.ticker = PIXI.ticker.shared.add(this.masterUpdate, this);
        // TODO: PEUT ETRE MODIFIER POUR LES FABRIER AU BOOT, class direct [huds,screenMesage,mouse]
        this.CAGE_GUI     = new PIXI.Container(); // screen menue gui huds
        this.CAGE_MESSAGE = new PIXI.Container(); // screen message
        this.CAGE_MOUSE   = new PIXI.Container(); // store master mouse sprite and FX, toujours top
        this.LIGHTS = {ambientLight:{},PointLight_mouse:{}}; //, directionalLight: new PIXI.ContainerDirectionalLight() }; // the global configurable on sceneChange


    };
    

    set scene(scene){
        if(this._scene){
            this._scene.parent.removeChild(this._scene);
            this._scene = null;
        };
        if(scene){
            this.addChild(scene)//$camera.addChild(scene);
            this._scene = scene;
        };
    };
    get scene(){ return this._scene };

    initialize(){
        this.initialize_Layers();
        this.initialize_lights();
    };
    initialize_Layers(){
        this.addChild(this.CAGE_GUI, this.CAGE_MESSAGE, this.CAGE_MOUSE);
        this.addChild($camera); // camera can hold scene with projections
        this.CAGE_MOUSE.parentGroup = $displayGroup.group[4];
        this.addChild( // lights groups
            $displayGroup._spriteBlack_d,
            $displayGroup._layer_diffuseGroup,
            $displayGroup._layer_normalGroup,
            $displayGroup._layer_lightGroup,
            ...$displayGroup.layersGroup // displayGroups
        );
    };
    initialize_lights(){
       this.LIGHTS.ambientLight = $objs.newContainer_light('AmbientLight');
       this.LIGHTS.PointLight_mouse = $objs.newContainer_light('PointLight');
       this.addChild(...Object.values(this.LIGHTS) );
    };
    
    run() {
        try { this.goto(Scene_Boot, {}) } // option for loader scenes boot
        catch (e) { throw console.error(e.stack) };
    };

    // see http://pixijs.download/dev/docs/PIXI.prepare.html for gpu cache 
    goto (sceneClass, options) {
        // TODO: add FX transitions, maybe a callBack .onEnd, onStop...
        this.scene = null;
        
         // check if loaderKit asigned to class are loaded, if yes get the scene, if no , goto loader scene and load all kit and scene
        const sceneName = sceneClass.name || sceneClass;
        const loaderKit = $Loader.needLoaderKit(sceneName);
        // lots of scenes buffer constructor ready in memory, just need to start, userfull for maps
        const nextScene = loaderKit && new Scene_Loader(sceneClass.name, options, loaderKit) || $Loader.Scenes[sceneName];
        this.scene = nextScene;
        document.title = document.title+` =>[${nextScene.constructor.name}] `; 
        nextScene.start();
       
        
    };

    masterUpdate(delta) {
        try {
            this.updateMain(delta);
   
        } catch (e) {
            $app.nwjs.win.showDevTools();
            throw console.error(e.stack);
        };
    };

    updateMain(delta){
        $camera.update();
        this.scene && this.scene.update(delta);
    };
};

const $stage = new _stage();
$app.stage = $stage;
console.log1('$stage: ', $stage);
