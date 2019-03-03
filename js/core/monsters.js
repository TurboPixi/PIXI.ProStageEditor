// ┌-----------------------------------------------------------------------------┐
// GLOBAL $dataMonsters: _dataMonsters
// manage data when creat new monster or load csv
//└------------------------------------------------------------------------------┘
class _dataMonstersJson {
    constructor() {
        // base for monster
        this.id = [];
        this.id[1] = { //data2\Characteres\monster\m1\m1.png
            _powers:['green'], // heritage orbs forces
            _weakness:['red'], // heritage orbs faiblesse
            _name:"Salviarum Divinurum",
            _desc:"日陰に生息する多年生の植物の種, 日陰に生息する多年 日陰に生息する多年生の植物の種 生の植物の種",
            evo:{},// store base,rate,flat states per level from initializeFromData
            capacity:{// les capaciter possible en heritage
                attack:100,
                defense:100,
                headTackle:40,
                wineWrap:40,
            },
            items:{ // les items possible en heritage
                1:[20,3], // 20% chance d'ehriter items 1 * 3
                32:[80,2],
            },
        }
    };

    /**@description compute parsed data from load csv evo states */
    initializeFromData(scv){
        const data = scv.data;
        const _id  = data[0].indexOf('id' );
        const _hp  = data[0].indexOf('hp' );
        const _mp  = data[0].indexOf('mp' );
        const _atk = data[0].indexOf('atk');
        const _def = data[0].indexOf('def');
        const _sta = data[0].indexOf('sta');
        const _lck = data[0].indexOf('lck');
        for (let id=1, l=data.length; id<l; id++) {
            const values = data[id];
            const hp = {base:values[_hp],rate:values[_hp+1],flat:values[_hp+2]}
            const mp = {base:values[_mp],rate:values[_mp+1],flat:values[_mp+2]}
            const atk = {base:values[_atk],rate:values[_atk+1],flat:values[_atk+2]}
            const def = {base:values[_def],rate:values[_def+1],flat:values[_def+2]}
            const sta = {base:values[_sta],rate:values[_sta+1],flat:values[_sta+2]}
            const lck = {base:values[_lck],rate:values[_lck+1],flat:values[_lck+2]}
            if(!this.id[id]){this.id[id] = {}};
            this.id[id].evo = {hp,mp,atk,def,def,sta,lck};              
        };
    };

    /**@description generate a random data monsters for map */
    generateDataForMap(id,lv){
        const data = this.id[id];
        const hp = data.evo.hp;
        const states = {
            hp:hp.base * (1 + (lv - 1) * hp.rate) + (hp.flat * (lv - 1)),
        };
        return {id,lv,states};
    }
};
$dataMonsters = new _dataMonstersJson();
console.log1('$dataMonsters: ', $dataMonsters);

/**@description create new random data monster for battle */
// let data = new _dataMonsters(1,1);
class _dataMonsters {
    constructor(id,lv) {
        this.data = $dataMonsters.id[id];
        this._dataId = id;
        this._level = lv;
        this.states = {};
        this.capacity = [];
        this.items = [];
        this.initializeStates();
        this.initializeCapacity(); // heritage des capaciter
        this.initializeItems(); // heritage des items
    };

    initializeStates(){
        for (const key in this.data.evo) {
            const brf = this.data.evo[key];
            const value =  brf.base * (1 + (this._level - 1) * brf.rate) + (brf.flat * (this._level - 1));
            this.states[key] = {value, max:value};
        }
    };

    initializeCapacity(){
        for (const key in this.data.capacity) {
            if(this.capacity.length>6){return}; // maximum de 6 capaciter heriter par monstre
            // chance heritage dune capciter
            const percent = this.data.capacity[key];
            if(percent===100){
                this.capacity.push(key);
            }else{
                const ran = Math.random()*100;
                if(ran<percent){this.capacity.push(key)};
            }
        }
    };

    initializeItems(){
        for (const key in this.data.items) {
            // chance heritage items
            const percent = this.data.items[key][0];
            const loop = this.data.items[key][1];
            for (let i=0; i<loop; i++) {
                const ran = Math.random()*100;
                if(ran<percent){this.items.push(key)};
            };
        }
    };

};

// ┌------------------------------------------------------------------------------┐
// GLOBAL $monsters: _monsters
// create new monster battler
//└------------------------------------------------------------------------------┘
class _monsters {
    constructor(monsterDataID,level,battleID) {
        this.database = $Loader.Data2['m'+monsterDataID];
        this.stats = $dataMonsters.id[monsterDataID]; //TODO: SCV CHEATS
        this._id = monsterDataID; // monster data id
        this._lv = level; // monster level
        this._bID = battleID; // battle id order
        
        this.sprite = null;
        this.initialised = false; // when combats start, initialise sprites monster from data
        this.initialize();
    };
    get x( ){ return this.sprite.x     };
    get y( ){ return this.sprite.y     };
    set x(x){ return this.sprite.x = x };
    set y(y){ return this.sprite.y = y };
    set z(z){ return this.sprite.zIndex = z };
    get w( ){ return this.sprite.width     };
    get h( ){ return this.sprite.height     };
    get isReverse( ){ return this.sprite.scale._x<0     };

    initialize() {
        const cage = $objs.newContainer_dataBase(this.database,'idle',true) // (database,skin)
        cage.parentGroup = $displayGroup.group[1];
        cage.proj._affine = 2;
        cage.s.hackAttachmentGroups("_n", PIXI.lights.normalGroup, PIXI.lights.diffuseGroup); // (nameSuffix, group)
       
        this.sprite = cage;
        const spine = cage.s;
        spine.stateData.defaultMix = 0.1;
        spine.state.setAnimation(0, "apear", false).timeScale = (Math.random()*0.6)+0.6;
        spine.state.addAnimation(0, "idle", true);
        spine.scale.set(0.2,0.2);
        // player layers hackAttachmentGroups set spine.n
        // interactiviy
        cage.interactive = true;
        cage.hitArea = cage.getLocalBounds(); // empeche interaction avec mesh presision
        cage.on ('pointerover' , this.pointer_inMonster  ,this );
        cage.on ('pointerout'  , this.pointer_outMonster ,this );
        cage.on ('pointerdown' , this.pointer_dwMonster  ,this );
        cage.on ('pointerup'   , this.pointer_upMonster  ,this );
    };
    

    pointer_inMonster (e) {
        const c = e.currentTarget;
        const f = new PIXI.filters.OutlineFilter (4, 0xff0000, 5);
        c.slots_d.forEach(spineSprite => { spineSprite._filters = [f] });
        //this.moveArrowTo(c);
        //this.moveMathBox(c);
        this.needReversePlayer(c);
        $combats.selectedMonster = this; // asign la selection du monstre general
        
    };
  
    pointer_outMonster(e) {
        const c = e.currentTarget;
        c.slots_d.forEach(spineSprite => {
            spineSprite._filters = null;
        });
       // const cage_dsb = $huds.combats.sprites.cage_dsb;
       // cage_dsb.renderable = false;
    };
    
    pointer_dwMonster(e) {
        const c = e.currentTarget;
        const clickLeft_   = e.data.button === 0;
        const _clickRight  = e.data.button === 2;
        const click_Middle = e.data.button === 1;
        if(clickLeft_){
            $player.spine.d.state.setAnimation(3, "preparAtk", false);
            this.tweenHoldClick && this.tweenHoldClick.kill();
            $huds.combats.sprites.carw.position.y = c.y-(c.height);
            const cHitLow = Math.random(); //critical green hit, start to be green after 1+chl
            const cHitEnd = 1*0.5; // % duration green hit
            const carw = $huds.combats.sprites.carw; // arrow
            this.tweenHoldClick = TweenMax.to(carw.position, 2+cHitLow+cHitEnd, {
                y:c.y-(c.height-40),
                ease: Expo.easeOut,
                onComplete: () => {
                    TweenMax.to($huds.combats.sprites.carw.position, 1, {y:c.y-c.height, ease: Elastic.easeOut.config(1.2, 0.1) });
                    //this.StartRoll();
                },
                onUpdate: () => {
                    const t = this.tweenHoldClick._time;
                    if(t>1){this.startHit = true;}
                    if(this.startHit){
                        t>(1+cHitLow)&&t<(1+cHitLow+cHitEnd)? carw.tint = 0x00ff00 : carw.tint = 0xff0000;
                    }
    
                }
            });
        }else
        if(_clickRight){
            $camera.moveToTarget(this.sprite,3);

        }


    };

    pointer_upMonster(e) {
        const c = e.currentTarget;
        if(this.tweenHoldClick){
            if(!this.startHit){
                this.tweenHoldClick.reverse();
                $player.spine.d.state.setEmptyAnimation(3,0.2);
                const carw = $huds.combats.sprites.carw; // arrow
                carw.tint = 0xffffff;
            }else{
                const carw = $huds.combats.sprites.carw; // arrow
                this.tweenHoldClick.kill();
                const doubleHit = carw.tint === 0x00ff00; // green
          
                $player.spine.d.state.setAnimation(3, "atk1", false);
                doubleHit && $player.spine.d.state.addAnimation(3, "atk2", false);
                $player.spine.d.state.addAnimation(3, "backAfterAtk", false);
                $player.spine.d.state.addEmptyAnimation(3,1);
                
                //TODO: // RENDU ICI , creer des events spines pour des animations coerente, refactoriser players js et les listener ?
                $player.spine.zIndex = c.y+1;
                TweenMax.to($player, 0.8, {
                    x:c.x-this.w/1.5,
                    y:c.y,
                    ease: Expo.easeOut,
                    onComplete: () => {
                        carw.tint = 0xffffff;

                    },
                });
            }
        }
    };

    moveArrowTo(target){
        TweenMax.to($huds.combats.sprites.carw.position, 0.4, {
            x:target.x, y:target.y-target.height,
            ease: Expo.easeOut,
        });
    };

    moveMathBox(target){
        const cage_dsb = $huds.combats.sprites.cage_dsb;
        cage_dsb.renderable = true;
        const pw = ($player.spine.width/2);
        const rX = + (target.x>$player.x) && cage_dsb.width*2 || -cage_dsb.width;
        TweenMax.to($huds.combats.sprites.cage_dsb.position, 1, {
            x:$player.x-rX, y:$player.y,
            ease: Elastic.easeOut.config(0.8, 0.4),
        });
    }

    // on utilise "reversX_withoutEvent" car l'ani revers de base appelle un events $player._dirX qui fuck tout
    needReversePlayer (target) {
        const needR = ($player._dirX === 6 && target.x<$player.x) || ($player._dirX === 4 && target.x>$player.x);
        if (needR) {
            $player.reversX();
            $player.spine.d.state.setAnimation(3, "reversX_withoutEvent", false);
            $player.spine.d.state.addEmptyAnimation(3,0.2);
        }
    };

    playHit(){
        const ran = Math.random()>0.5 && 1 || 0;
        this.sprite.d.state.setAnimation(1,`hit${ran}`, false);
        this.sprite.d.state.addEmptyAnimation(1,1);
    }
};


