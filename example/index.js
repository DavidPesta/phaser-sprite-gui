// Generated by CoffeeScript 1.10.0
(function() {
  "use strict";
  var Phaser, bg, caption, cursors, droid, guis, hearts, jumpButton, jumpTimer, mixin, pack, player, rocks, score;

  Phaser = this.Phaser;

  mixin = Phaser.Utils.mixin;

  bg = void 0;

  caption = void 0;

  cursors = void 0;

  droid = void 0;

  guis = [];

  hearts = void 0;

  jumpButton = void 0;

  jumpTimer = 0;

  pack = void 0;

  player = void 0;

  rocks = void 0;

  score = 0;

  window.GAME = new Phaser.Game({
    antialias: false,
    height: 600,
    renderer: Phaser.CANVAS,
    scaleMode: Phaser.ScaleManager.NO_SCALE,
    width: 600,
    state: {
      init: function() {
        var game;
        game = this.game;
        game.forceSingleUpdate = false;
        game.time.desiredFps = 30;
      },
      preload: function() {
        this.load.baseURL = "example/assets/";
        this.load.spritesheet("droid", "droid.png", 32, 32);
        this.load.spritesheet("dude", "dude.png", 32, 48);
        this.load.image("background");
        this.load.image("firstaid");
        this.load.image("heart");
        this.load.image("rock");
      },
      create: function() {
        var arcade;
        arcade = this.physics.arcade;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas, true);
        arcade.checkCollision = {
          up: false,
          down: true,
          left: false,
          right: false
        };
        arcade.gravity.set(0, 500);
        this.createBg();
        this.createPlayer();
        this.createDroid();
        this.createRocks();
        this.createPack();
        this.createHearts();
        this.createCaption();
        player.bringToTop();
        droid.bringToTop();
        caption.bringToTop();
        this.addInput();
        guis.push(new Phaser.SpriteGUI(bg, {
          width: 300,
          name: "tileSprite"
        }, {
          include: ["key", "name", "x", "y", "position", "tilePosition", "tileScale"]
        }));
        guis.push(new Phaser.SpriteGUI(player, {
          width: 300,
          name: "sprite"
        }));
        guis.push(new Phaser.SpriteGUI(pack, {
          width: 300,
          name: "spriteWithInput"
        }));
      },
      update: function() {
        var arcade, world;
        world = this.game.world;
        arcade = this.physics.arcade;
        arcade.collide(player, rocks);
        arcade.collide(player, droid, function() {
          return score += 1;
        });
        this.updatePlayer();
        world.wrap(droid, droid.width);
        caption.text = "Score: " + score + " • [R]estart";
      },
      shutdown: function() {
        var gui, j, len;
        for (j = 0, len = guis.length; j < len; j++) {
          gui = guis[j];
          gui.destroy();
        }
      },
      addInput: function() {
        var game, keyboard;
        game = this.game;
        keyboard = this.input.keyboard;
        cursors = keyboard.createCursorKeys();
        jumpButton = keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        keyboard.addKey(Phaser.KeyCode.R).onUp.add(game.state.restart, game.state);
      },
      createBg: function() {
        bg = this.add.tileSprite(0, 0, this.game.width, this.game.height, "background");
        bg.alpha = 0.5;
        bg.name = "tileSprite";
        bg.tilePosition.x = this.rnd.between(0, 120);
        return bg;
      },
      createCaption: function() {
        return caption = this.add.text(5, 5, "", {
          fill: "white",
          font: "bold 24px monospace"
        });
      },
      createDroid: function() {
        var physics, world;
        physics = this.physics, world = this.world;
        droid = this.add.sprite(world.randomX, world.height * 0.5, "droid");
        droid.name = "droid";
        physics.enable(droid);
        mixin({
          allowGravity: false,
          bounce: {
            x: 0.5,
            y: 0.5
          },
          mass: 2,
          maxVelocity: {
            x: 100,
            y: 100
          },
          velocity: {
            x: 50,
            y: 0
          }
        }, droid.body);
        droid.body.setSize(droid.width, droid.height / 2, 0, droid.height / 2);
        droid.animations.add("!", [0, 1, 2, 3], 5, true);
        droid.animations.play("!");
        return droid;
      },
      createHearts: function() {
        hearts = this.add.emitter(0, 0, 1).setAlpha(0, 1, 1000, "Quad.easeInOut", true).setRotation(0, 0).setScale(0, 1, 0, 1, 1000, "Quad.easeInOut", true).setXSpeed(0, 0).setYSpeed(-100, -50).makeParticles("heart");
        hearts.gravity = -500;
        return hearts;
      },
      createPack: function() {
        var world;
        world = this.world;
        pack = this.add.sprite(world.randomX, world.randomY, "firstaid");
        pack.name = "pack";
        pack.inputEnabled = true;
        pack.input.useHandCursor = true;
        pack.input.enableDrag();
        return pack;
      },
      createPlayer: function() {
        player = this.add.sprite(32, 32, "dude");
        player.name = "player";
        this.camera.follow(player);
        this.physics.enable(player);
        mixin({
          bounce: {
            x: 0.5,
            y: 0.25
          },
          collideWorldBounds: true,
          drag: {
            x: 250,
            y: 0
          },
          maxVelocity: {
            x: 250,
            y: 1000
          }
        }, player.body);
        player.body.setSize(8, 32, 12, 16);
        player.animations.add("left", [0, 1, 2, 3], 10, true);
        player.animations.add("turn", [4], 20, true);
        player.animations.add("right", [5, 6, 7, 8], 10, true);
        return player;
      },
      createRocks: function() {
        var i, physics, r, world;
        physics = this.physics, world = this.world;
        rocks = this.add.group();
        r = void 0;
        i = 4;
        while (i-- > 0) {
          r = this.add.sprite(world.randomX, (1 - (i * 0.25)) * world.height, "rock");
          r.anchor.set(0.5);
          physics.enable(r);
          r.body.moves = false;
          r.body.immovable = true;
          rocks.add(r);
        }
        return rocks;
      },
      updatePlayer: function() {
        var animations, maxVelocity, onFloor, ref, time, velocity, world;
        ref = this.game, time = ref.time, world = ref.world;
        maxVelocity = player.body.maxVelocity;
        velocity = player.body.velocity;
        animations = player.animations;
        onFloor = player.body.blocked.down || player.body.touching.down;
        if (cursors.left.isDown) {
          velocity.x -= maxVelocity.x / 10;
        } else if (cursors.right.isDown) {
          velocity.x += maxVelocity.x / 10;
        }
        switch (true) {
          case velocity.x > 0:
            animations.play("right");
            break;
          case velocity.x < 0:
            animations.play("left");
            break;
          default:
            animations.stop(null, true);
        }
        if (jumpButton.isDown && onFloor && time.now > jumpTimer) {
          velocity.y = -maxVelocity.y / 2;
          jumpTimer = time.now + 500;
        }
        world.wrap(player, null, null, true, false);
      }
    }
  });

}).call(this);
