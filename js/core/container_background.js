
/*:
// PLUGIN □────────────────────────────────□CONTAINER BACKGROUND MANAGER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @module manage container and sprite from pixijs
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

/** @memberof Container_Base */
class Container_Background extends Container_Base {
    // note: les bg peut etre decouper en arrays[[1,2,3],[1,2,3]] pour textures packer, et textureName pourrai etre diferent version , season !?
    constructor(dataObj) {
        super(dataObj);
        //this.createBases(dataObj);
        //this.asignDataValues(dataObj.dataValues, true);
        //this.addChild(this.d,this.n);
    };
    // getters for ContainerTiles

    createBases (dataObj = this.dataObj) {
        // TODO: les bg pourrai etre parfoi decouper en arrays dans textures packer
        const textureName = dataObj.b.dataName;
        const td = dataObj.dataBase.textures   [textureName];
        const tn = dataObj.dataBase.textures_n [textureName+'_n'];
        const d = new PIXI.projection.Sprite2d(td);
        const n = new PIXI.projection.Sprite2d(tn);
        this.Sprites = {d,n};
        this.addChild(d,n);
    };

    affines (value) {
        this.affine = 0;
    };
};

//END CLASS
    
    