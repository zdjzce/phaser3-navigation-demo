import Phaser from "phaser";
import FollowerSprite from "../game-objects/follower";

export default class Start extends Phaser.Scene {
  create() {
    // -- 根据 tileMap 生成的地图进行设置 --

    // 从 phaser 缓存中加载 tilemap
    const tilemap = this.add.tilemap("map");

    // Set up the tilesets - first parameter is name of tileset in Tiled and second paramter is
    // name of tileset image in Phaser's cache
    const wallTileset = tilemap.addTilesetImage("tiles", "tiles");
    const wallLayer = tilemap.createLayer("walls", wallTileset);
    wallLayer.setCollisionByProperty({ collides: true });

    // -- 对各个商店生成精灵描绘坐标。监听事件 --
    // 商店名及商店坐标名（在TileMaps软件中已经绘制完路径导入）
    const shopsMap = {
      shaxian: "shaxian-path",
      jinchawu: "jinchawu-path",
      aiyucun: "aiyucun-path",
      caoshi: "caoshi-path",
      jimenmen: "jimenmen-path",
      zaliangjianbing: "zaliangjianbing-path",
      chufuren: "chufuren-path",
      wuyebanmian: "wuyebanmian-path",
      zuomayoula: "zuomayoula-path",
      chongqingxiaomian: "chongqingxiaomian-path",
      luoguanzhong: "luoguanzhong-path",
      jiapo: "jiapo-path",
      niujiaren: "niujiaren-path",
      caiyuanxiaoshi: "caiyuanxiaoshi-path",
      liunuannuan: "liunuannuan-path",
    };

    // 遍历 shopsMap 生成精灵
    for (const shop in shopsMap) {
      const shopObject = tilemap.getObjectLayer(shop);
      const shopObjectPath = tilemap.getObjectLayer(shopsMap[shop]);
      this[shop] = this.physics.add
        .sprite(
          shopObject.objects[0].x + shopObject.objects[0].width / 2,
          shopObject.objects[0].y + shopObject.objects[0].height / 2,
          shop
        )
        .setInteractive();
      this[shop].enableBody = true;
      this[shop].setDisplaySize(shopObject.objects[0].width, shopObject.objects[0].height);
      this[shop].alpha = 0.01;
      this[shop].on("pointerdown", function (pointer) {
        const safeCoordX = shopObject.objects[0].width + shopObject.objects[0].x;
        const safeCoordY = shopObject.objects[0].height + shopObject.objects[0].y;
        let end = new Phaser.Math.Vector2(pointer.x, pointer.y);
        if (safeCoordX > pointer.x && safeCoordY > pointer.y) {
          end = new Phaser.Math.Vector2(
            shopObjectPath.objects[0].x + shopObjectPath.objects[0].width / 2,
            shopObjectPath.objects[0].y + shopObjectPath.objects[0].height / 2
          );
        }
        const start = new Phaser.Math.Vector2(follower.x, follower.y);

        // Tell the follower sprite to find its path to the target
        follower.goTo(end);
        const path = navMesh.findPath(start, end);

        navMesh.debugDrawClear();
        navMesh.debugDrawPath(path, 0xffd900);
      });
    }

    // -- NavMesh Setup --
    const navMesh = this.navMeshPlugin.buildMeshFromTilemap("mesh1", tilemap, [wallLayer]);

    // Graphics overlay for visualizing path
    const graphics = this.add.graphics(0, 0).setAlpha(0.5);
    navMesh.enableDebug(graphics);

    // Game object that can follow a path (inherits from Phaser.Sprite)
    const objectLayer = tilemap.getObjectLayer("obj");
    const follower = new FollowerSprite(
      this,
      objectLayer.objects[0].x + 60,
      objectLayer.objects[0].y + 80,
      navMesh
    );
    follower.scale = 0.1;

    const resetBtn = tilemap.getObjectLayer("resetbtn");
    this.resetBtn = this.physics.add
      .sprite(resetBtn.objects[0].x + 130, resetBtn.objects[0].y + 30, "resetBtn")
      .setInteractive();
    this.resetBtn.enableBody = true;
    this.resetBtn.setDisplaySize(resetBtn.objects[0].width, resetBtn.objects[0].height);
    this.resetBtn.alpha = 0.01;
    this.resetBtn.on("pointerdown", function () {
      navMesh.debugDrawClear();
      follower.x = objectLayer.objects[0].x + 60;
      follower.y = objectLayer.objects[0].y + 80;
    });
  }
}
