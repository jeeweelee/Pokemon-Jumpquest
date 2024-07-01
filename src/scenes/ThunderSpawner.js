import Phaser from 'phaser'

export default class ThunderSpawner {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene, thunderKey = 'thunder') {
    this.scene = scene
    this.key = thunderKey

    this._group = this.scene.physics.add.group()
  }

  get group() {
    return this._group
  }

  spawn(playerX = 0) {
		let x = Phaser.Math.Between(0,400)
		if(playerX < 400){
			x = Phaser.Math.Between(400,800)
		}
    

    const thunder = this.group.create(x, 16, this.key)
    thunder.setBounce(1)
    thunder.setCollideWorldBounds(true)
		thunder.setScale(0.1)
    thunder.setVelocity(Phaser.Math.Between(-200, 200), 20)

    return thunder
  }
}
