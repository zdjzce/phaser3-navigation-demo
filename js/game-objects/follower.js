const map = (value, min, max, newMin, newMax) => {
  return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
};

class FollowerSprite extends Phaser.GameObjects.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {*} x
   * @param {*} y
   * @param {*} navMesh
   * @param {*} wallLayer
   * @memberof FollowerSprite
   */
  constructor(scene, x, y, navMesh) {
    super(scene, x, y, "follower");

    this.navMesh = navMesh;
    this.path = null;
    this.currentTarget = null;
    this.scene = scene;

    // 启用物理以高速移动
    scene.physics.world.enable(this);

    scene.add.existing(this);
    // 当前场景更新时调用update
    scene.events.on("update", this.update, this);
    scene.events.once("shutdown", this.destroy, this);
  }

  goTo(targetPoint) {
    // 调用navMesh自带的方法 只要传入目标路径 就能够生成导航路径
    this.path = this.navMesh.findPath(new Phaser.Math.Vector2(this.x, this.y), targetPoint);

    // 如果存在有效路径，则从路径中获取第一个点并将其设置为目标
    if (this.path && this.path.length > 0) this.currentTarget = this.path.shift();
    else this.currentTarget = null;
  }

  update(time, deltaTime) {
    // 在还没有绘制完成的时候，不要移动
    if (!this.body) return;

    // 停止任何先前的动作
    this.body.velocity.set(0);

    if (this.currentTarget) {
      // 检查是否达到了目标位置
      const { x, y } = this.currentTarget;
      const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);

      if (distance < 5) {
        // 如果还有路径，则前往下一个点。否则，使目标为空
        if (this.path.length > 0) this.currentTarget = this.path.shift();
        else this.currentTarget = null;
      }

      // 接近路径的最后一点时减速。
      let speed = 400;
      if (this.path.length === 0 && distance < 50) {
        speed = map(distance, 50, 0, 400, 50);
      }

      // 仍然有一个有效的目标则继续前进
      if (this.currentTarget) this.moveTowards(this.currentTarget, speed, deltaTime / 1000);
    }
  }

  moveTowards(targetPosition, maxSpeed = 200, elapsedSeconds) {
    // 计算角度和距离
    const { x, y } = targetPosition;
    // 两点之间的角度（就是拐弯时需要的角度 不过这个模型暂时用不上）
    const angle = Phaser.Math.Angle.Between(this.x, this.y, x, y);
    // 两点之间的距离
    const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
    // 速度
    const targetSpeed = distance / elapsedSeconds;
    // 限制速度
    const magnitude = Math.min(maxSpeed, targetSpeed);
    // 设置速度
    this.scene.physics.velocityFromRotation(angle, magnitude, this.body.velocity);
  }

  destroy() {
    // 移除事件监听
    if (this.scene) this.scene.events.off("update", this.update, this);
    super.destroy();
  }
}
