const game = new Phaser.Game({
  // 初始化地图配置
  type: Phaser.AUTO,
  parent: "game-container",
  width: 1500,
  height: 875,
  backgroundColor: "#fff",
  pixelArt: false,
  plugins: {
    scene: [
      {
        // PhaserNavMeshPlugin 为自动寻路库 已在index.html中引入
        key: "NavMeshPlugin", // 指定库名
        plugin: PhaserNavMeshPlugin, // Class that constructs plugins
        mapping: "navMeshPlugin", // 属性名
        start: true,
      },
    ],
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: 0,
    },
  },
});
// 添加场景、绑定函数
game.scene.add("load", Load);
game.scene.add("start", Start);
game.scene.start("load");