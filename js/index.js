// 获取容器
var container = document.querySelector('.container')
// 获取开始界
var startBox = document.querySelector('.start-box')
// 获取主界面
var main = document.querySelector('.main-box')
// 获取分数界面
var scoreBox = document.querySelector('.score-box')
// 获取分数数值
var currentScore = document.querySelector('#score')
// 获取暂停界面
var suspend = document.querySelector('.suspend-box')
// 获取结束界面
var end = document.querySelector('.end-box')
// 暂停的继续按钮
var continueBtn = document.querySelector('.continue')
// 暂停的重新开始按钮
var restartBtn = document.querySelector('.restart')
// 暂停的回到主页按钮
var backBtn = document.querySelector('.back')
// 获取结束后分数统计界面
var finallyScore = document.querySelector('.plane-score')
// 结束的继续按钮
var againBtn = document.querySelector('.again')
// 初始化分数
var scores = 0

// 创建通用飞机类
function plane(
  HP,
  X,
  Y,
  sizeX,
  sizeY,
  score,
  dieTime,
  speed,
  boomImgSrc,
  imgSrc
) {
  this.planeHP = HP
  this.planeX = X
  this.planeY = Y
  this.planeSizeX = sizeX
  this.planeSizeY = sizeY
  this.planeScore = score
  this.planeDieTime = dieTime
  this.planeSpeed = speed
  this.planeBoomImg = boomImgSrc
  this.imgNode = null
  this.planeIsDie = false
  this.planeDieTimes = 0
  // 根据分数修改飞机移动的速度
  this.planeMove = function() {
    if (scores <= 50000) {
      this.imgNode.style.top = this.imgNode.offsetTop + this.planeSpeed + 'px'
    } else if (scores > 50000 && scores <= 100000) {
      this.imgNode.style.top =
        this.imgNode.offsetTop + this.planeSpeed + 1 + 'px'
    } else if (scores > 100000 && scores <= 150000) {
      this.imgNode.style.top =
        this.imgNode.offsetTop + this.planeSpeed + 2 + 'px'
    } else if (scores > 150000 && scores <= 200000) {
      this.imgNode.style.top =
        this.imgNode.offsetTop + this.planeSpeed + 3 + 'px'
    } else if (scores > 200000 && scores <= 300000) {
      this.imgNode.style.top =
        this.imgNode.offsetTop + this.planeSpeed + 4 + 'px'
    } else {
      this.imgNode.style.top =
        this.imgNode.offsetTop + this.planeSpeed + 5 + 'px'
    }
  }
  // 初始化生成飞机
  this.init = function() {
    this.imgNode = document.createElement('img')
    this.imgNode.style.left = this.planeX + 'px'
    this.imgNode.style.top = this.planeY + 'px'
    this.imgNode.src = imgSrc
    main.appendChild(this.imgNode)
  }
  this.init()
}

// 创建子弹类
function bullet(X, Y, sizeX, sizeY, imgSrc) {
  this.bulletX = X
  this.bulletY = Y
  this.bulletSizeX = sizeX
  this.bulletSizeY = sizeY
  this.bulletImg = null
  this.bulletAttach = 1
  this.bulletMove = function() {
    this.bulletImg.style.top = this.bulletImg.offsetTop - 20 + 'px'
  }
  // 初始化生成子弹
  this.init = function() {
    this.bulletImg = document.createElement('img')
    this.bulletImg.style.left = this.bulletX + 'px'
    this.bulletImg.style.top = this.bulletY + 'px'
    this.bulletImg.src = imgSrc
    main.appendChild(this.bulletImg)
  }
  this.init()
}

// 创建单行子弹类
function oddBullet(X, Y) {
  bullet.call(this, X, Y, 6, 14, '../images/bullet.png')
}

// 创建敌机类
function enemy(
  HP,
  a,
  b,
  sizeX,
  sizeY,
  score,
  dieTime,
  speed,
  boomImgSrc,
  imgSrc
) {
  plane.call(
    this,
    HP,
    random(a, b),
    // Y高度都是从-100开始
    -100,
    sizeX,
    sizeY,
    score,
    dieTime,
    speed,
    boomImgSrc,
    imgSrc
  )
}

// 生成min到max的随机数
function random(min, max) {
  return Math.floor(min + Math.random() * (max - min))
}

// 创建本方飞机类
function ourPlane(X, Y) {
  plane.call(
    this,
    1,
    X,
    Y,
    66,
    80,
    0,
    600,
    0,
    '../images/my-plane-boom.gif',
    '../images/my-plane.gif'
  )
  // 为了获取本方飞机设置事件而添加的ID
  this.imgNode.setAttribute('id', 'ourPlane')
}

// 创建本方飞机
var myPlane = new ourPlane(120, 485)

// 移动事件
var ourPlane = document.querySelector('#ourPlane')
// 获取容器距离左侧的距离
var containerOffsetX = container.offsetLeft
var moveEvent = function() {
  var myEvent = window.event
  var selfPlaneX = myEvent.clientX - containerOffsetX
  var selfPlaneY = myEvent.clientY
  // 设置本方飞机跟随鼠标移动，除以2的目的是使鼠标一直在飞机的中间位置
  ourPlane.style.left = selfPlaneX - myPlane.planeSizeX / 2 + 'px'
  ourPlane.style.top = selfPlaneY - myPlane.planeSizeY / 2 + 'px'
}

// 暂停事件
var flag = true
var body = document.querySelector('body')
var pauseEvent = function() {
  if (flag) {
    suspend.style.display = 'block'
    // 去除移动事件
    main.removeEventListener('mousemove', moveEvent, true)
    body.removeEventListener('mousemove', boundary, true)
    clearInterval(set)
    flag = false
  } else {
    suspend.style.display = 'none'
    // 添加移动事件
    main.addEventListener('mousemove', moveEvent, true)
    body.addEventListener('mousemove', boundary, true)
    set = setInterval(start, 20)
    flag = true
  }
}

// 判断本方飞机是否移除边界，移除则取消鼠标事件，反之添加鼠标事件
var boundary = function() {
  var myEvent = window.event
  var bodyX = myEvent.clientX
  var bodyY = myEvent.clientY
  if (
    bodyX < containerOffsetX + 5 ||
    bodyX > containerOffsetX + 315 ||
    bodyY < 0 ||
    bodyY > 568
  ) {
    main.removeEventListener('mousemove', moveEvent, true)
  } else {
    main.addEventListener('mousemove', moveEvent, true)
  }
}

// 重新加载
function reload() {
  location.reload(true)
}

// 添加事件到对应的DOM元素上
main.addEventListener('mousemove', moveEvent, true)
myPlane.imgNode.addEventListener('click', pauseEvent, true)
body.addEventListener('mousemove', boundary, true)
continueBtn.addEventListener('click', pauseEvent, true)
restartBtn.addEventListener('click', reload, true)
againBtn.addEventListener('click', reload, true)
backBtn.addEventListener('click', reload, true)

// 初始不显示本方飞机
myPlane.imgNode.style.display = 'none'

// 创建敌机和子弹对象数组
var enemys = []
var bullets = []

// 定义背景移动position
var backgroundPositionY = 0

// 定义标记，不同标记出现不同大小的敌机
var mark1 = 0
var mark2 = 0

// 创建开始函数
function start() {
  main.style.backgroundPositionY = backgroundPositionY + 'px'
  backgroundPositionY += 0.5
  if (backgroundPositionY == 568) {
    backgroundPositionY = 0
  }
  mark1++

  // 创建敌机
  if (mark1 == 20) {
    mark2++
    if (mark2 % 5 == 0) {
      enemys.push(
        new enemy(
          6,
          25,
          274,
          46,
          60,
          5000,
          360,
          random(1, 3),
          '../images/middle-plane-boom.gif',
          '../images/enemy_fly_2.png'
        )
      )
    }
    if (mark2 == 20) {
      enemys.push(
        new enemy(
          12,
          57,
          210,
          110,
          164,
          30000,
          540,
          1,
          '../images/big-plane-boom.gif',
          '../images/enemy_fly_3.png'
        )
      )
      mark2 = 0
    } else {
      enemys.push(
        new enemy(
          1,
          19,
          286,
          34,
          24,
          1000,
          360,
          random(1, 4),
          '../images/small-plane-boom.gif',
          '../images/enemy_fly_1.png'
        )
      )
    }
    mark1 = 0
  }
  // 移动敌机
  var enemysLen = enemys.length
  for (var i = 0; i < enemysLen; i++) {
    // 判断敌机没有被标记死亡则移动
    if (enemys[i].planeIsDie != true) {
      enemys[i].planeMove()
    }
    // 判断敌机超时容器高度就移除敌机
    if (enemys[i].imgNode.offsetTop > 568) {
      main.removeChild(enemys[i].imgNode)
      enemys.splice(i, 1)
      enemysLen--
    }
    if (enemys[i].planeIsDie == true) {
      enemys[i].planeDieTimes += 20
      if (enemys[i].planeDieTimes == enemys[i].planeDieTime) {
        main.removeChild(enemys[i].imgNode)
        enemys.splice(i, 1)
        enemysLen--
      }
    }
  }

  // 创建子弹
  if (mark1 % 5 == 0) {
    bullets.push(
      new oddBullet(
        parseInt(myPlane.imgNode.style.left) + 31,
        parseInt(myPlane.imgNode.style.top) - 10
      )
    )
  }
  // 移动子弹
  var bulletLen = bullets.length
  for (var k = 0; k < bulletLen; k++) {
    bullets[k].bulletMove()
    if (bullets[k].bulletImg.offsetTop < 0) {
      main.removeChild(bullets[k].bulletImg)
      bullets.splice(k, 1)
      bulletLen--
    }
  }

  // 判断碰撞本飞机
  for (var s = 0; s < bulletLen; s++) {
    for (var j = 0; j < enemysLen; j++) {
      if (enemys[j].planeIsDie == false) {
        if (
          // 判读X轴线方向
          enemys[j].imgNode.offsetLeft + enemys[j].planeSizeX >=
            myPlane.imgNode.offsetLeft &&
          enemys[j].imgNode.offsetLeft <=
            myPlane.imgNode.offsetLeft + myPlane.planeSizeX
        ) {
          if (
            // 判断Y轴线方向
            enemys[j].imgNode.offsetTop + enemys[j].planeSizeY >=
              myPlane.imgNode.offsetTop + 40 &&
            enemys[j].imgNode.offsetTop <=
              myPlane.imgNode.offsetTop - 20 + myPlane.planeSizeY
          ) {
            myPlane.imgNode.src = '../images/my-plane-boom.gif'
            end.style.display = 'block'
            finallyScore.innerHTML = scores
            main.removeEventListener('mousemove', moveEvent, true)
            body.removeEventListener('mousemove', boundary, true)
            clearInterval(set)
          }
        }

        //判断子弹打到敌机
        if (
          // 判读X轴线方向
          bullets[s].bulletImg.offsetLeft + bullets[s].bulletSizeX >
            enemys[j].imgNode.offsetLeft &&
          bullets[s].bulletImg.offsetLeft <
            enemys[j].imgNode.offsetLeft + enemys[j].planeSizeX
        ) {
          if (
            // 判断Y轴线方向
            bullets[s].bulletImg.offsetTop <=
              enemys[j].imgNode.offsetTop + enemys[j].planeSizeY &&
            bullets[s].bulletImg.offsetTop + bullets[s].bulletSizeY >=
              enemys[j].imgNode.offsetTop
          ) {
            // 敌机的血量等于敌机血量减去每个子弹的攻击力
            enemys[j].planeHP = enemys[j].planeHP - bullets[s].bulletAttach
            // 血量为0时计分
            if (enemys[j].planeHP == 0) {
              scores += enemys[j].planeScore
              currentScore.innerHTML = scores
              enemys[j].imgNode.src = enemys[j].planeBoomImg
              enemys[j].planeIsDie = true
            }
            main.removeChild(bullets[s].bulletImg)
            bullets.splice(s, 1)
            bulletLen--
            break
          }
        }
      }
    }
  }
}

var set = null
function begin() {
  startBox.style.display = 'none'
  main.style.display = 'block'
  scoreBox.style.display = 'block'
  myPlane.imgNode.style.display = 'block'
  set = setInterval(start, 20)
}
