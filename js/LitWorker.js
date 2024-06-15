/**
 * 使用很多get/set，细节太多,反复观看
 * 其实就是为了装逼哈哈哈
 */

export class LitWorker {
    constructor() {
        // canvas 初始化...
        this.canvas = document.querySelector("#one")

        // 宽高初始化
        let { innerWidth:w,innerHeight:h  } = window
        this.webGlHeight = h
        this.webGlWidth = w
        // 注意，宽高一定要在获取上下文前面...
        this.webGl = this.canvas.getContext("webgl")
    }

    set dt(value){
        this._dt = value
    }
    set time(value){
        this._time = value
    }

    /**
     * 设置webgl高度
     * @param value
     */
    set webGlHeight(value){
        this.canvas.height = value
    }

    /**
     * 设置webgl的宽度
     * @param value
     */
    set webGlWidth(value){
        this.canvas.width = value
    }

    get dt(){
        return this._dt
    }
    get time(){
        return this._time
    }
    /**
     * 获取高度，是窗口的
     * @returns {number}
     */
    get height(){
        let {innerHeight:h} = window
        return h
    }
    /**
     * 获取宽度，窗口的
     * @returns {number}
     */
    get width(){
        let {innerWidth:w} = window
        return w
    }

    /**
     * 垂直数据信息
     * @returns {Float32Array}
     */
    get vertexData(){
        return new Float32Array(
            [-1.0, 1.0,
                -1.0, -1.0,
                1.0, 1.0,
                1.0, -1.0,
            ]);
    }

    /**
     * 获取对应东西...都是一样的其实
     * @returns {WebGLUniformLocation}
     */
    get timeHandle(){
        return this.getUniformLocation({context:this.webGl,program:this.program, name:'time'})
    }
    get widthHandle(){
        return this.getUniformLocation({context:this.webGl,program:this.program, name:'width'})
    }
    get heightHandle(){
        return this.getUniformLocation({context:this.webGl,program:this.program, name:'height'})
    }
    get positionHandle(){
        return this.getAttribLocation({context:this.webGl,program:this.program, name:'position'})
    }
    get program(){
        return this._program
    }

    /**
     * 设置配置，采用解构的写法
     * @param dt
     * @param time
     */
    setConfig({dt= 0.01,time=0}){
        this.dt = dt
        this.time = time
    }

    /**
     * 编译着色器
     * @param context 上下文，就是webgl
     * @param shaderSource 资源
     * @param shaderType 类型
     * @returns {WebGLShader} 编译后的数据
     */
    compileShader({context = this.webGl, shaderSource, shaderType}){
        const shader = context.createShader(shaderType)
        // 着色
        context.shaderSource(shader,shaderSource)
        // 编译
        context.compileShader(shader)
        // 是否编译成功，不成功就要返回报错信息
        if(!context.getShaderParameter(shader,context.COMPILE_STATUS)){
            throw "Shader 编译出错:: " + context.getShaderInfoLog(shader);
        }
        return shader
    }

    /**
     * 获取属性位置
     * @param context
     * @param program
     * @param name
     */
    getAttribLocation({context=this.webGl,program, name}){
        // 获取属性位置
        const attribLocation = context.getAttribLocation(program,name)
        if(attribLocation === -1){
            throw `并没有发现${name}属性`
        }
        return attribLocation
    }

    /**
     * 获取统一位置
     * @param context
     * @param program
     * @param name
     */
    getUniformLocation({context=this.webGl,program, name}){
        const attributeLocation = context.getUniformLocation(program, name);
        if (attributeLocation === -1) {
            throw `并没有发现${name}属性的同一位置`
        }
        return attributeLocation;
    }

    /**
     * 创建一个程序
     * @param context
     * @returns {WebGLProgram}
     */
    createProgram({context=this.webGl}){
        // 首先如果有了就不用创建了
       return this._program = context.createProgram()
    }

    attachShader({context=this.webGl,program,shader}){
        context.attachShader(program,shader)
    }
    draw(context = this.webGl){
        this.time += this.dt
        context.uniform1f(this.timeHandle, this.time)
        context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
        // 按照电脑最好的速度搞哈哈哈
        requestAnimationFrame(()=>this.draw())
    }
}