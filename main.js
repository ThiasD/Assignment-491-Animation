function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game, spritesheet) {
    Entity.call(this, game, 0, 400);
    this.spritesheet = spritesheet;
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    // ctx.fillStyle = "SaddleBrown";
    // ctx.fillRect(0,500,800,300);
    ctx.drawImage(this.spritesheet, 0, 0);
    Entity.prototype.draw.call(this);
}

function Floor(game, spritesheet, xPosition, yPosition, /*length, height,*/ move){
    this.x = xPosition;
    this.y = yPosition;
    //this.speed = 150;
    //this.moving = move;
    // this.length = length;
    // this.height = height;
    Entity.call(this, game, this.x, this.y);
    this.spritesheet = spritesheet;
    this.ctx = game.ctx;
}

Floor.prototype = new Entity();
Floor.prototype.constructor = Floor;

Floor.prototype.update = function () {
    // if(this.moving === true) {
    //     this.x += this.game.clockTick * this.speed;
    //     if (this.x > 800) this.x = -230;
    //     Entity.prototype.update.call();
    // }
}

Floor.prototype.draw = function (ctx) {
    // var that = this;
    // int size = length / ;
    // for( int i = 0 ; i < length ; i += )
    ctx.drawImage(this.spritesheet, 
                    this.x, this.y);
    Entity.prototype.draw.call(this);
}


// function Background(game, spritesheet) {
//     this.x = 0;
//     this.y = 0;
//     Entity.call(this, game, this.x, this.y);
//     this.radius = 200;
//     this.spritesheet = spritesheet;
//     this.game = game;
//     this.ctx = game.ctx;
// };

// Background.prototype.draw = function () {
//     this.ctx.drawImage(this.spritesheet,
//                    this.x, this.y);
//     Entity.prototype.draw(this);
// };

// Background.prototype.update = function () {
// };

function Dog(game) {
                                                    //      spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
    this.runAnimation = new Animation(ASSET_MANAGER.getAsset("./img/Dog.png"), 285, 0, 93, 75, 0.1, 6, true, false);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/Dog.png"), 230, 195, 105, 110, 0.5, 2, true, false);
    this.dashAnimation = new Animation(ASSET_MANAGER.getAsset("./img/Dog.png"), 0, 90, 174, 100, 0.4, 3, true, false);
    this.jumping = false;
    this.radius = 100;
    this.ground = 440;
    this.speed = 150;
    Entity.call(this, game, 0, 440);
}

Dog.prototype = new Entity();
Dog.prototype.constructor = Dog;

Dog.prototype.update = function () {
    // if (this.game.space) this.jumping = true;
    // if (this.jumping) {
    //     if (this.jumpAnimation.isDone()) {
    //         this.jumpAnimation.elapsedTime = 0;
    //         this.jumping = false;
    //     }
    //     var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
    //     var totalHeight = 200;

    //     if (jumpDistance > 0.5)
    //         jumpDistance = 1 - jumpDistance;

    //     //var height = jumpDistance * 2 * totalHeight;
    //     var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
    //     this.y = this.ground - height;
    // }
    // Entity.prototype.update.call(this);

    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) {
        this.x = -230;
        this.y = 440;
    }
    if (this.x > 250 && this.x < 450) this.y -= this.game.clockTick * (this.speed * 2);

    if(this.x > 470 && this.y <= 168) {
        this.y += this.game.clockTick * (this.speed * 2);
    } 
    else if (this.y >= 168 && this.x > 500){
        this.x += this.game.clockTick * (this.speed * 3.5);
    }
    // if(this.x > 500){
    //     this.x += this.game.clockTick * (this.speed * 5);
    // }

    Entity.prototype.update.call(this);
}

Dog.prototype.draw = function (ctx) {
    if (this.x <= 230) {
        this.runAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    else if (this.x > 500 && this.y >= 168){
        this.dashAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } 
    else {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }

    // if( this.x > 500){
    //     this.dashAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    // } else {
    //     this.runAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    // }
    Entity.prototype.draw.call(this);
}


function Ephraim(game, spriteSheet, x, y) {
    //      spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
    this.spriteSheet = ASSET_MANAGER.getAsset("./img/FE/spritesheet.png");
    this.attackAnimation = new Animation(spriteSheet, 0, 0, 60, 79, 0.1, 22, true, false);
    Entity.call(this, game, x, y);
}

Ephraim.prototype = new Entity();
Ephraim.prototype.constructor = Dog;

Ephraim.prototype.update = function () {
    //Ephraim.prototype.update.call(this);
}

Ephraim.prototype.draw = function (ctx) {
    this.attackAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
    Entity.prototype.draw.call(this);
}




function Tana(game, spriteSheet, x, y) {
    //      spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
    this.spriteSheet = ASSET_MANAGER.getAsset("./img/FE/tana_pegasusknight_lance.gif");
    this.attackAnimation = new Animation(spriteSheet, 0, 350, 71, 100, 0.3, 7, true, );
    Entity.call(this, game, x, y);
}

Tana.prototype = new Entity();
Tana.prototype.constructor = Dog;

Tana.prototype.update = function () {
    //Ephraim.prototype.update.call(this);
}

Tana.prototype.draw = function (ctx) {
    this.attackAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
    Entity.prototype.draw.call(this);
}




// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/Dog.png");
ASSET_MANAGER.queueDownload("./img/background2.png");
ASSET_MANAGER.queueDownload("./img/smallPlatform.png");
ASSET_MANAGER.queueDownload("./img/spike.png")
ASSET_MANAGER.queueDownload("./img/FE/attackSprite.png");
ASSET_MANAGER.queueDownload("./img/FE/tana_pegasusknight_lance.gif");


ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
//    var bg = new Background(gameEngine/*, ASSET_MANAGER.getAsset("./img/bakcground2.png")*/);
    var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/background2.png"));

     // Floor lengths are 191. 187 makes it look like a consistent repeat. This is the "Floor" of the prototype
    // Need to find out a "length" parameter that can repeat this floor asset a number of times until "length" is achieved
    var f1 = new Floor(gameEngine, ASSET_MANAGER.getAsset("./img/smallPlatform.png"), 0, 500, false);
    var f2 = new Floor(gameEngine, ASSET_MANAGER.getAsset("./img/smallPlatform.png"), 187, 500, false);
    var f3 = new Floor(gameEngine, ASSET_MANAGER.getAsset("./img/smallPlatform.png"), 374, 500, false);
    var f4 = new Floor(gameEngine, ASSET_MANAGER.getAsset("./img/smallPlatform.png"), 561, 500, false);
    var f5 = new Floor(gameEngine, ASSET_MANAGER.getAsset("./img/smallPlatform.png"), 748, 500, false);
    var f6 = new Floor(gameEngine, ASSET_MANAGER.getAsset("./img/smallPlatform.png"), 935, 500, false);

    var f7 = new Floor (gameEngine, ASSET_MANAGER.getAsset("./img/smallPlatform.png"), 465, 250, false);
    //var f7 = new Floor (gameEngine, ASSET_MANAGER.getAsset("./img/spike.png"), 465, 250, false);

    var eph = new Ephraim(gameEngine, ASSET_MANAGER.getAsset("./img/FE/attackSprite.png"), 100, 150);
    var tana = new Tana(gameEngine, ASSET_MANAGER.getAsset("./img/FE/tana_pegasusknight_lance.gif"), 200, 0);

    var dog = new Dog(gameEngine);

    // gameEngine.init(ctx);
    // gameEngine.start();
    
    gameEngine.addEntity(bg);

    gameEngine.addEntity(f1);
    gameEngine.addEntity(f2);
    gameEngine.addEntity(f3);
    gameEngine.addEntity(f4);
    gameEngine.addEntity(f5);
    gameEngine.addEntity(f6);
    gameEngine.addEntity(f7);

    gameEngine.addEntity(eph);
    gameEngine.addEntity(tana);
    // gameEngine.init(ctx);
    // gameEngine.start();

    gameEngine.addEntity(dog);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
