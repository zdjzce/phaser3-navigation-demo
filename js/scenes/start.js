class Start extends Phaser.Scene {
  create() {
    // -- 根据 tileMap 生成的地图进行设置 --

    // 从 phaser 缓存中加载 tilemap
    const tilemap = this.add.tilemap("map");

    // 设置 tilesets - 第一个参数是 Tiled 中 tileset 的名称，第二个参数是加载 Phaser 缓存中的 tileset 图像名称
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
      // 获取各个商店坐标
      const shopObject = tilemap.getObjectLayer(shop);
      // 获取各个商店路径坐标
      const shopObjectPath = tilemap.getObjectLayer(shopsMap[shop]);
      // 生成精灵 为每个店铺绑定点击事件
      this[shop] = this.physics.add
        .sprite(
          shopObject.objects[0].x + shopObject.objects[0].width / 2,
          shopObject.objects[0].y + shopObject.objects[0].height / 2,
          shop
        )
        .setInteractive();
      // 设置店铺可点击区域的碰撞体积
      this[shop].enableBody = true;
      // 设置店铺可点击区域的大小
      this[shop].setDisplaySize(shopObject.objects[0].width, shopObject.objects[0].height);
      // 设置店铺精灵透明度
      this[shop].alpha = 0.01;
      // 添加点击事件
      this[shop].on("pointerdown", function (pointer) {
        // 获取点击店铺的精灵 xy坐标数据
        const safeCoordX = shopObject.objects[0].width + shopObject.objects[0].x;
        const safeCoordY = shopObject.objects[0].height + shopObject.objects[0].y;
        // 设置终点为点击店铺的中心点
        let end = new Phaser.Math.Vector2(pointer.x, pointer.y);
        // 设置终点为点击店铺的中心点
        if (safeCoordX > pointer.x && safeCoordY > pointer.y) {
          end = new Phaser.Math.Vector2(
            shopObjectPath.objects[0].x + shopObjectPath.objects[0].width / 2,
            shopObjectPath.objects[0].y + shopObjectPath.objects[0].height / 2
          );
        }
        // 起始路径
        const start = new Phaser.Math.Vector2(follower.x, follower.y);

        // 调用 follower 的移动方法前往
        follower.goTo(end);
        const path = navMesh.findPath(start, end);
        // 绘制路径
        navMesh.debugDrawClear();
        navMesh.debugDrawPath(path, 0x000000);
      });
    }

    // 自动导航初始化
    const navMesh = this.navMeshPlugin.buildMeshFromTilemap("mesh1", tilemap, [wallLayer]);

    // 路径绘制参数
    const graphics = this.add.graphics(0, 0).setAlpha(0.5);
    navMesh.enableDebug(graphics);

    // 根据入口的位置生成精灵
    const objectLayer = tilemap.getObjectLayer("obj");
    // 初始化精灵位置传入自动导航网格参数
    const follower = new FollowerSprite(
      this,
      objectLayer.objects[0].x + 60,
      objectLayer.objects[0].y + 80,
      navMesh
    );
    follower.scale = 0.1;

    // 获取重置按钮位置
    const resetBtn = tilemap.getObjectLayer("resetbtn");
    // 初始化按钮位置和样式
    this.resetBtn = this.physics.add
      .sprite(resetBtn.objects[0].x + 130, resetBtn.objects[0].y + 30, "resetBtn")
      .setInteractive();
    // 设置按钮可点击区域的碰撞体积
    this.resetBtn.enableBody = true;
    // 设置按钮可点击区域的大小
    this.resetBtn.setDisplaySize(resetBtn.objects[0].width, resetBtn.objects[0].height);
    // 设置按钮精灵透明度
    this.resetBtn.alpha = 0.01;
    // 重置按钮添加点击事件
    this.resetBtn.on("pointerdown", function () {
      navMesh.debugDrawClear();
      follower.x = objectLayer.objects[0].x + 60;
      follower.y = objectLayer.objects[0].y + 80;
    });
  }
}
