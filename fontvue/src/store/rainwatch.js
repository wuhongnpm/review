// 获取画布
        var canvas = document.querySelector("#canvas");
        var rain = canvas.getContext('2d');
        // drop数组，存每个散开的小水滴信息
        var drop = [];
        // water数组，存每丝雨的信息
        var water = [];
        // 雨的数量，可自行更改
        var waterNum = 400;
        // 小水（雨）滴的重力
        var gravity = 1;
        // 鼠标在页面的初始位置
        var mouseX=-40,mouseY=-44;
        // 关于雨的角度值，值为-1到1，后面讲
        var direction = 0;
        // 这也是关于鼠标在页面位置的角度值，值为-1到1
        var mouseDelay = 0;
        // 这是画布自适应窗口大小的函数，复制即可
        window.onresize = resizeCanvas;
            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resizeCanvas();
        
       // 一丝雨的初始化，封装，后面好几处要调用
        function creatWater(){         
                water.push({
                    //值为0或1，判断是否要散开水滴
                    add:1,
                    //随机初始水平位置
                    x:Math.random()*3*canvas.width-canvas.width,
                    // 随机初始垂直位置，在上面一点，这样雨能从上面下落
                    y: Math.random()*70-70,
                    // 随机雨的长度
                    len: Math.random()*7+30,
                    // 随机雨的速度
                    speed: Math.random()*10+10,
                    // 随机雨的随机颜色
                    color: `rgb(255,255,255,${Math.random()*0.5})`,
                    // 随机散开水滴数量
                    dropNum:Math.random()*+4
                })                   
        }
        // 雨数组初始化，每丝雨都来
        function chushi(){
            for (let i = 0; i < waterNum; i++) {
               creatWater();
            } 
        }
       // 散开水滴数组初始化，x为水平位置，y为垂直位置，dropNum为数量
        function creatDrop (x,y,dropNum){
            //给drop数组添加元素
            for (let j = 0; j < dropNum; j++) {
                drop.push({
                    // x轴位置
                    pagex:x,
                    // y轴位置
                    pagey:y,
                    // x轴移动距离
                    dx:Math.random()*12-6,
                    // y轴移动距离
                    dy:Math.random()*10-20,
                    // 半径
                    r:Math.random()+2,
                    //颜色
                    color: `rgb(191,103,102,${Math.random()*0.5+0.5})`,
                })
            }
        }
        // 绘画，画雨
        function drawWater(){
            //遍历数组
            for (let i = 0; i < water.length; i++){
                let temp = water[i];
                // 颜色
                rain.strokeStyle = temp.color;
                // 开始路径
                rain.beginPath();
                // 开始点
                rain.moveTo(temp.x,temp.y);
                // 结束点，连线，如： 当前x位置+长度*角度值  
                rain.lineTo(temp.x+temp.len*direction,temp.y+temp.len);
                // 线宽度
                rain.lineWidth = 5;
                // 绘制
                rain.stroke();                            
            }
        }
      // 绘画雨滴
       function drawDrop(){
           //遍历
        for (let i = 0; i < drop.length; i++){  
            let temp = drop[i];
            // 线宽度
            rain.lineWidth = 5;
            //颜色
            rain.strokeStyle = temp.color;
            //开始路径
            rain.beginPath();
            // 画一个随机的弧度
            rain.arc(temp.pagex,temp.pagey,temp.r, Math.PI , Math.random() * 2 * Math.PI);
            // 绘制
            rain.stroke();
            //结束路径
            rain.closePath();                            
       }
    }
      //雨信息的更新
       function updateWater(){
         for (let i = 0; i < water.length; i++){
            // 判断雨的底部是否碰到鼠标，碰到就散开成水滴，x轴y轴与鼠标的位置绝对值在35之内则散开。
            if(Math.abs(mouseX-water[i].x)<35&&Math.abs(mouseY-water[i].y-water[i].len)<35){
                // 创建雨滴，传入x轴y轴大小与数量
                creatDrop(water[i].x,water[i].y+water[i].len,water[i].dropNum);
                // 既然水滴散开了，就清除掉这丝雨
                water.splice(i,1);
                // 重新来一丝随机的雨
                creatWater();
            }
             // 判断雨的底部是否超过画布底部，且add值为1
            if(((water[i].y+water[i].len)>=canvas.height) && water[i].add==1){
               // add值为0 
               water[i].add = 0;
              // 创建雨滴，传入x轴y轴大小与数量，y轴位置就为画布高即可
               creatDrop(water[i].x,canvas.height,water[i].dropNum);
           }
            // 判断整丝雨是否超过画布
            if(water[i].y>canvas.height){
                // 清除它
               water.splice(i,1);
               // 来个新的
              creatWater();
           }
           // 缓动动画原理，雨角度慢慢接近鼠标的角度
           direction += (mouseDelay - direction)*0.0002;           
           // 雨x轴位置改变
           water[i].x += water[i].speed*direction;
           //雨y轴位置改变
           water[i].y += water[i].speed;        
          }
       }
       // 雨滴信息更新
       function updateDrop(){
           for(let i=0;i<drop.length;i++){
            // y轴移动距离加上重力。因为dy一开是负数，所以雨滴先升后降
            drop[i].dy +=  gravity;    
            // x轴位置改变，同时它也受雨角度影响
                 drop[i].pagex += drop[i].dx + direction*10;
                 // y轴位置改变
                 drop[i].pagey += drop[i].dy;
                 //判断雨滴是否超过画布
                 if(drop[i].pagey>canvas.height){
                     //清除水滴
                     drop.splice(i,1);
                 }
           }
       }
      // 绑定鼠标移动事件
       window.addEventListener('mousemove',e=>{
           // 得到x轴位置
              mouseX = e.clientX;
              //得到y轴位置
              mouseY = e.clientY;
              // 雨角度值，在-1到1之间
              mouseDelay = (e.clientX-canvas.offsetWidth/2)/(canvas.offsetWidth/2);
              
       })
       // 判断鼠标离开事件
       window.addEventListener('mouseout',()=>{
           // 给个值，不会产生雨滴的值就行
           mouseY=canvas.height+30;
       })
      // 先初始化雨数组
       chushi();
       //设置定时器，开始动画
       setInterval(function(){
           // 清除画布
          rain.clearRect(0,0,canvas.width,canvas.height);
          // 更新雨和雨滴信息
          updateWater();   
          updateDrop();
          // 绘画雨和雨滴
          drawWater();
          drawDrop();
       },20)
