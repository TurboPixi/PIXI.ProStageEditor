
/*:
// PLUGIN □────────────────────────────────□CONTAINER BASE MANAGER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @module manage container and sprite from pixijs
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/
//

/** @memberof PIXI.Container */
class Container_Base extends PIXI.projection.Container2d {
    constructor(dataObj) {
        super();
        this.dataObj = dataObj;
        this.Sprites = {};
        this.createBases();
        this.asignDataObjValues();
    };
    // getters
    get d() { return this.Sprites.d };
    get n() { return this.Sprites.n };
    get isRegistered() { return this.dataObj._registered };

    createBases (dataObj = this.dataObj) {
        const dataBase = dataObj.dataBase;
        const textureName = dataObj.b.textureName;
        // si pas de textureName, utiliser baseTextures: thumbs
        if(!textureName){
            const d = new PIXI.Sprite(dataBase.baseTextures[0]); // thumbs [0]
            this.Sprites.d = d;
            this.addChild(d);
        }else{

        }
    };

    // dispatch values asigment
    asignDataObjValues(dataObj = this.dataObj) {
        this.asignValues(dataObj.p);
        if(!this.dataObj.s){
            this.d && this.asignValues.call(this.d, dataObj.d);
            this.n && this.asignValues.call(this.n, dataObj.n);
        };
        this.asignValues(dataObj.a); // animatedSprite
        this.asignValues(dataObj.s); // SprineSprites
    };

    getDataValues () {
        return this.dataObj.dataValues = this.dataObj.getDataValuesFrom(this);
    };


    asignValues (data) {
        data && Object.keys(data).forEach(key => {
            const value = data[key];
            switch (key) {
                case "position":case "scale":case "skew":case "pivot":case "anchor":
                    this[key].set(...value);
                break;
                case "setDark": case "setLight":
                    if(this.color){ this.color[key](...value) };
                break;
                case "parentGroup": // if parentGroup, also asign diffuseGroup,normalGroup to childs
                    if(Number.isFinite(value)){
                        this.parentGroup = $displayGroup.group[value];
                        this.asignChildParentGroups(this.dataObj.dataBase.isNormal);
                    };
                break;
                case "color":
                    value?this.convertToHeaven():this.destroyHeaven();
                break;
                case "zIndex":
                    this.zIndex = +data.position[1];
                break;
                case "defaultColor": // for cases, change color
                    this.defaultColor = value;
                    this.setCaseColorType(value);
                break;
                case "defaultCaseEventType": // for cases, change color
                    this.defaultCaseEventType = value;
                    this.setCaseEventType(value);
                break;
                //ANIMATIONS
                case "autoPlay": // for cases, change color
                    this.autoPlay = value;
                    this.autoPlay && this.play && this.play();
                break;
                //spine
                case "defaultAnimation": // for cases, change color
                    this.s.state.setAnimation(0, value, true);
                break;
                case "timeScale": // for cases, change color
                    this.s.state.tracks[0].timeScale = value;
                break;
                case "startTime": // update animation to specific time
                    this.s.startTime = value;
                    this.s.update(value);
                break;
                default:
                    this[key] = value;
                break;
            };
        });
    };


    //auto add default parentGroup for 'tileSheet', 'animationSheet'
    asignChildParentGroups (normal) {
        this.d.parentGroup = normal? PIXI.lights.diffuseGroup : null;
        this.n.parentGroup = normal? PIXI.lights.normalGroup : null;
    };

    // default background not affined
    affines (value) {
        this.proj.affine = this.dataObj.dataValues.p.affine;
    };

};//END CLASS