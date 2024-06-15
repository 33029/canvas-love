/**
 * 爱心实现
 * By.烟雨 Litworke
 */

export class Love{

    constructor(){
        this.can = document.querySelector("#two")
        this.ctx = this.can.getContext("2d")

        this.w = window.innerWidth
        this.h = window.innerHeight
        console.log(window.innerWidth);

        this.can.width = this.w
        this.can.height = this.h

        this.ctx.translate(this.w / 2, this.h / 2)
        // 存放的容器池
        this.list = []
        this.deg = Math.PI
        // 设置全局颜色...
        this.color = this.createColor()
    }
    // 设置颜色
    set color(value){
        console.log(`%c当前修改颜色为:${value}`,`color:${value}`)
        this._color = value
    }
    // 获取
    get color(){
        return this._color
    }

    /**
     * 生成配置...
     * @param {*} param0 
     */
    setConfig({
            // 放大系数
            scale=20,
            // 半径
            r=3,
            // 弧度变量
            change=0.025,
            // 数量
            count=10,
            // 偏移量
            offset = 0.4
        })
    {
        this.scale = scale
        this.r = r
        this.change = change
        this.count = count
        this.offset = offset
    }
    /**
     * 创建关联信息
     * @param {*} x
     * @param {*} y
     */
    create(x,y){
        let count = this.count
        for (let i = 0; i < count; i++) {
            const deg = Math.PI * 2 * Math.random()
            // 模糊精细量
			const sx = Math.cos(deg) * Math.random() * this.offset
			const sy = Math.sin(deg) * Math.random() * this.offset
            // 长度，意思意思就行了
			const len = 20 + Math.random() * 130
            this.list.push({
                x:x,
                y:y,
                sx:sx,
                sy:sy,
                len:len,
                r:this.r,
                color:this.color
            })
        }
    }
    /**
     * 更新节点...
     */
    update(){
        if (this.deg > 0) {
			this.deg -= this.change
            let { x,y}  = this.createCoordinate(this.deg)
            // 爱心创建...
			this.create(x, -y)
			this.create(-x, -y)
		}
		this.list.forEach(item => {
			item.x += item.sx
			item.y += item.sy
			if (this.deg <= 0) { // 如果心已经画完，这些点就逐渐消失
				item.len -= 1
			}
		})
		this.list = this.list.filter(item => item.len > 0)
    }

    /**
     * 生成笛卡尔爱心坐标系
     * @param deg
     */
    createCoordinate(deg){
        // 笛卡尔爱心公式
        let x = this.scale * (16 * Math.pow(Math.sin(deg),3))
		let y = this.scale * (13 * Math.cos(deg) - 5 * Math.cos(2 * deg) - 2 * Math.cos(3 * deg) - Math.cos(4 * deg))
        return {x,y}
    }
    /**
     * 绘制
     */
    draw(){
        let context = this.ctx
        context.clearRect(-this.w / 2, -this.h / 2, this.w, this.h)
		this.list.forEach(function (item) {
		    // 绘制圆,
            context.beginPath()
            context.arc(item.x, item.y, item.r, 0, Math.PI * 2)
            context.fillStyle = item.color
            context.fill()
            context.closePath()
		})
    }
    // 走你...
    setup(){
        this.update()
        this.draw()
        // 如果len是01，就是没有了的话，创建新的，颜色重新设置
        if (this.list.length === 0) {
            this.color = this.createColor()
            // 用这个是因为我只需要一次
			// 重新开始下一个心
            this.deg = Math.PI
		} 
        requestAnimationFrame(()=> this.setup())
    }
    // 随机颜色生成器...写法比较low逼
    createColor(){
        let str="#";
        for(let i=0; i<3; i++){
            str += Math.floor(Math.random()*256).toString(16).padStart(2,"0");
        }
        return str;
    }
}
