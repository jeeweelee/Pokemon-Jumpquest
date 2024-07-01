import Phaser from 'phaser'
import ScoreLabel from '../ui/ScoreLabel';
import ThunderSpawner from './ThunderSpawner'

const PLATFORM_KEY = 'platform'
const CHARACTER_KEY = 'character'
const POKEBALL_KEY = 'pokeball'
const THUNDER_KEY = 'thunder'


export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene')
		this.player = undefined
		this.cursor = undefined
		this.scoreLabel = undefined
		this.thunderSpawner = undefined
		this.gameOver = false
		
  }

  preload() {
    this.load.image('background', 'assets/background.png')
    this.load.image(PLATFORM_KEY, 'assets/platform.png')
    this.load.image(POKEBALL_KEY, 'assets/pokeball.png')
    this.load.image(THUNDER_KEY, 'assets/thunder.png')

    this.load.spritesheet(CHARACTER_KEY,
      'assets/character.png',
      { frameWidth: 60, frameHeight: 63 }
    )
  }

  create() {
    this.add.image(400, 300, 'background').setScale(0.5)
	
    const platforms = this.createPlatforms()
		this.player = this.createPlayer()
		
		this.pokeballs = this.createPokeBalls()

		this.thunderSpawner = new ThunderSpawner(this, THUNDER_KEY)
		const thunderGroup = this.thunderSpawner.group
		this.physics.add.collider(thunderGroup, platforms)
		this.physics.add.collider(this.player, thunderGroup, this.hitThunder, null, this)


		this.scoreLabel = this.createScoreLabel(16,16,0)
		this.physics.add.overlap(this.player, this.pokeballs, this.collectPokeBalls, null, this)
		this.physics.add.collider(this.player,platforms)
		this.physics.add.collider(this.pokeballs,platforms)
	
		this.cursors = this.input.keyboard.createCursorKeys()
	
		
		
  }
	collectPokeBalls(player,pokeball){
		pokeball.disableBody(true,true)
		this.scoreLabel.add(30)

		if (this.pokeballs.countActive(true) === 0)
			{
				
				this.pokeballs.children.iterate((c) => {
					const child = (/** @type {Phaser.Physics.Arcade.Sprite} */ (c))
					child.enableBody(true, child.x, 0, true, true)
				})
				this.thunderSpawner.spawn(player.x)
			}
			
	
			
	}

	update()
	{ 
		if (this.gameOver)
			{
				return
			}
		if (this.cursors.left.isDown)
		{
			this.player.setVelocityX(-150)

			this.player.anims.play('left', true)
		}
		else if (this.cursors.right.isDown)
		{
			this.player.setVelocityX(150)

			this.player.anims.play('right', true)
		}
		else
		{
			this.player.setVelocityX(0)

			this.player.anims.play('idle')
		}

		if (this.cursors.up.isDown && this.player.body.touching.down)
		{
			this.player.setVelocityY(-240)
		}
		
	}
	hitThunder(player)
	{
		this.physics.pause()

		player.setTint(0xff0000)

		player.anims.play('turn')

		this.gameOver = true
	}

  createPlatforms() {
    const platforms = this.physics.add.staticGroup()
		platforms.create(400, 471, PLATFORM_KEY).setScale(4,2).refreshBody()

    platforms.create(20, 380, PLATFORM_KEY).setScale(1, 1).refreshBody()
		platforms.create(300, 325, PLATFORM_KEY).setScale(0.5, 1).refreshBody()
		platforms.create(500, 375, PLATFORM_KEY).setScale(0.5, 1).refreshBody()
		platforms.create(750, 325, PLATFORM_KEY).setScale(0.5, 1).refreshBody()

   return platforms
		
		
  }

	createPlayer() {
    const player = this.physics.add.sprite(300, 400, CHARACTER_KEY)
    player.setBounce(0.2)
    player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(CHARACTER_KEY, { start: 4, end: 7 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'idle',
      frames: [{ key: CHARACTER_KEY, frame: 0 }],
      
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(CHARACTER_KEY, { start: 8, end: 11 }),  
      frameRate: 5,
      repeat: -1
    })
		return player
  }
	createPokeBalls() {
		const pokeballs = this.physics.add.group({
			key: 'pokeball',
			repeat: 10,
			setXY: { x: 2, y: 300, stepX: 70 } 
		});
	
		pokeballs.children.iterate((child) => {
			const pokeball = /** @type {Phaser.Physics.Arcade.Sprite} */ (child);
			pokeball.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
	
			
			pokeball.setScale(0.2); 
		});
	
		return pokeballs;
	}
	createScoreLabel(x, y, score)
	{
		const style = { fontSize: '32px', fill: '#000' }
		const label = new ScoreLabel(this, x, y, score, style)

		this.add.existing(label)

		return label
	}


	
}
