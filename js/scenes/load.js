class Load extends Phaser.Scene {
  preload() {
    const loadingBar = this.add.graphics();
    const { width, height } = this.sys.game.config;
    // 加载进度条
    this.load.on("progress", (value) => {
      loadingBar.clear();
      loadingBar.fillStyle(0xffffff, 1);
      loadingBar.fillRect(0, height / 2 - 25, width * value, 50);
    });
    // 加载完成
    this.load.on("complete", () => loadingBar.destroy());

    // 加载资源 地图 地图碰撞层 精灵
    this.load.tilemapTiledJSON("map", "tilemaps/map.json");
    this.load.image("tiles", "tilemaps/tiles.png");
    this.load.image("follower", "images/follower.png");
  }

  update() {
    this.scene.start("start");
  }
}
