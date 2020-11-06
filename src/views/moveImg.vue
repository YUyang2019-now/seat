<template>
<div>
    <div style="margin-bottom: 20px">
        <el-button @click="facilityVis = true" size="small">设施</el-button>
        <el-button @click="seatVis = true" size="small">模型</el-button>
    </div>
    <div>
        <div class="box" ref="box" @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup" @click="click">
            <div v-for="(c, index) in area" :key="index * 1000" style="height: 33px">
                <div v-for="(item, index) in c" :key="index" :class="{'place': true}" :row="item.row" :column="item.column">
                </div>
            </div>
            <div class="dragImg" ref="dragImg" v-show="dragImg && initialize">
                <img src="../assets/logo.png" width="100%" height="100%">
            </div>
        </div>
    </div>
    <el-dialog title="选择设施" :visible.sync="facilityVis" width="30%">
        <div class="facility">
            <div v-for="item in facilityList" :key="item.name" class="facilityItem" @click="facilityItem(item)">
                {{item.name}}
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="facilityVis = false">取 消</el-button>
            <el-button type="primary" @click="facilityVis = false">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="选择模板" :visible.sync="seatVis" width="30%">
        <div class="facility">
            <div v-for="item in seatList" :key="item.name" class="facilityItem" @click="seatItem(item)">
                {{item.name}}
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="seatVis = false">取 消</el-button>
            <el-button type="primary" @click="seatVis = false">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog :title="facilityTitle" :visible.sync="onselfVis" width="30%">
        <el-form :model="facility" label-width="100px" label-position="left" ref="facility" size="small" :rules="rules">
            <el-form-item label="设施朝向：" prop="direction" v-show="facilityTitle === '主席台'">
                <el-select v-model="facility.direction" placeholder="请选择">
                    <el-option v-for="item in direction" :key="item.type" :label="item.name" :value="item.type">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设施长度：" prop="width">
                <el-input type="number" v-model="facility.width"></el-input>
            </el-form-item>
            <el-form-item label="设施高度：" prop="height">
                <el-input type="number" v-model="facility.height"></el-input>
            </el-form-item>
            <el-form-item label="座位数量：" v-show="facilityTitle === '主席台'" prop="seatL">
                <el-input type="number" v-model="facility.seatL"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="onselfVis = false">取 消</el-button>
            <el-button type="primary" @click="dragFac">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import imgUrl from '../assets/logo.png'
export default {
    data() {
        return {
            initialize: false,
            rules: {
                direction: [{
                    required: true,
                    message: '请选择朝向',
                    trigger: 'blur'
                }, ],
                width: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
                height: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
                seatL: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
            },
            interval: 33,
            dragImg: false,
            line: 24,
            list: 20,
            area: [], // type: 1 默认格子 3座位     row: 行  column：列
            reactArea: {
                startX: 0,
                startY: 0,
                endX: 0,
                endY: 0
            },
            isMouseDown: false,
            areaSelect: null,
            facility: {
                direction: null,
                width: null,
                height: null,
                seatL: null,
                type: null
            },
            direction: [{
                name: '朝上',
                type: 1
            }, {
                name: '朝右',
                type: 2
            }, {
                name: '朝下',
                type: 3
            }, {
                name: '朝左',
                type: 4
            }],
            facilityTitle: '主席台',
            facilityVis: false,
            onselfVis: false,
            facilityList: [{
                name: '主席台',
                url: ''
            }, {
                name: '门',
                url: ''
            }, {
                name: '会议桌',
                url: ''
            }, {
                name: '主屏幕'
            }],
            seatList: [{
                name: 'U字形',
                url: ''
            }, {
                name: '回字形',
                url: ''
            }, {
                name: '课桌型',
                url: ''
            }, {
                name: '自定义'
            }],
            seatVis: false,
        }
    },
    computed: {},
    methods: {
        // 点击模板
        seatItem(item) {
            this.onselfVis = true
            this.facilityTitle = item.name
            this.facility.type = 3
        },
        // 拖拽设施
        dragFac() {
            this.$refs.facility.validate((valid) => {
                if (valid) {
                    this.onselfVis = false
                    this.facilityVis = false
                    this.dragImg = true
                }
            })

        },
        // 点击设施
        facilityItem(item) {
            this.onselfVis = true
            this.facilityTitle = item.name
        },
        mousedown(e) {
            if (!this.dragImg) {
                this.reactArea.startX = e.clientX;
                this.reactArea.startY = e.clientY;
                this.isMouseDown = true
            }
        },
        mousemove(e) {
            if (this.isMouseDown && !this.dragImg) {
                let preArea = this.$refs.box.getElementsByClassName('v-selected-area')
                if (preArea.length) {
                    this.$refs.box.removeChild(preArea[0])
                }
                this.reactArea.endX = e.clientX
                this.reactArea.endY = e.clientY
                let leftValue = 0
                let topValue = 0
                let widthValue = Math.abs(this.reactArea.startX - this.reactArea.endX)
                let heightValue = Math.abs(this.reactArea.startY - this.reactArea.endY)
                if (this.reactArea.startX >= this.reactArea.endX) {
                    leftValue = this.reactArea.endX - this.$refs.box.offsetLeft
                } else {
                    leftValue = this.reactArea.startX - this.$refs.box.offsetLeft
                }
                if (this.reactArea.startY > this.reactArea.endY) {
                    topValue = this.reactArea.endY - this.$refs.box.offsetTop
                } else {
                    topValue = this.reactArea.startY - this.$refs.box.offsetTop
                }
                //判断同时有宽高才开始画虚线框

                if (this.reactArea.startX != this.reactArea.endX && this.reactArea.startY != this.reactArea.endY) {
                    this.areaSelect = document.createElement('p')
                    let style = `left: ${leftValue}px;top: ${topValue}px;
                    width: ${widthValue}px;height: ${heightValue}px;`
                    this.areaSelect.classList.add("v-selected-area")
                    this.areaSelect.style = style;
                    this.$refs.box.append(this.areaSelect)
                }
                let children = this.$refs.box.getElementsByClassName('place')
                for (let i = 0; i < children.length; i++) {
                    let childrenHeight = children[i].getBoundingClientRect().height
                    let childrenWidth = children[i].getBoundingClientRect().width

                    //每个元素的位置
                    let offsetLeft = children[i].offsetLeft
                    let offsetTop = children[i].offsetTop
                    //每个li元素的宽高
                    let endPositionH = childrenHeight + offsetTop
                    let endPositionW = childrenWidth + offsetLeft
                    //五个条件满足一个就可以判断被选择
                    //一是右下角在选择区域内
                    let require1 = endPositionH > topValue && endPositionW > leftValue && endPositionH < topValue + heightValue && endPositionW < leftValue + widthValue
                    //二是左上角在选择区域内
                    let require2 = offsetTop > topValue && offsetLeft > leftValue && offsetTop < topValue + heightValue && offsetLeft < leftValue + widthValue
                    //三是右上角在选择区域内
                    let require3 = offsetTop > topValue && offsetLeft + childrenWidth > leftValue && offsetTop < topValue + heightValue && offsetLeft + childrenWidth < leftValue + widthValue
                    //四是左下角在选择区域内
                    let require4 = offsetTop + childrenHeight > topValue && offsetLeft > leftValue && offsetTop + childrenHeight < topValue + heightValue && offsetLeft < leftValue + widthValue
                    //五选择区域在元素体内
                    let require5 = offsetTop < topValue && offsetLeft < leftValue && offsetTop + childrenHeight > topValue + heightValue && offsetLeft + childrenWidth > leftValue + widthValue
                    if (require1 || require2 || require3 || require4 || require5) {
                        children[i].classList.add('active')
                    } else {
                        children[i].classList.remove('active')
                    }
                }
            }
            // 移动设施
            if (this.dragImg) {
                let width = (this.facility.width * this.interval)
                let height = (this.facility.height * this.interval)
                let left = e.clientX - this.$refs.box.offsetLeft - parseInt(width / 2)
                let top = e.clientY - this.$refs.box.offsetTop - parseInt(height / 2)
                let style = `left: ${left}px;top: ${top}px;width: ${width}px;height: ${height}px;`
                this.$refs.dragImg.style = style
                this.initialize = true
            }
        },
        mouseup() {
            if (!this.dragImg) {
                this.isMouseDown = false
                if (this.areaSelect && this.areaSelect.childNodes && this.$refs.box.contains(this.areaSelect)) {
                    this.$refs.box.removeChild(this.areaSelect)
                }
                this.areaSelect = null
            }
        },
        click(e) {
            console.log(e.target)
            if (this.dragImg) {
                console.log(e.target.offsetLeft)
                let row = e.target.getAttribute('row')
                if (!row) {
                    return
                }
                let column = e.target.getAttribute('column')
                for (let i = row - parseInt(this.facility.width / 2); i < parseInt(this.facility.width) - 1; i++) {
                    for (let j = column - parseInt(this.facility.height / 2); j < parseInt(this.facility.height) - 1; j++) {
                        this.area[i][j].type = 2
                        this.area[i][j].width = this.facility.width
                        this.area[i][j].height = this.facility.height
                    }

                }
                console.log(this.area)
                // 创造图片
                let width = parseInt(this.facility.width) * this.interval
                let height = parseInt(this.facility.height) * this.interval
                let ele = document.createElement('img')
                let div = document.createElement('div')
                ele.setAttribute('src', imgUrl)
                let style = `
                width: 100%;height: 100%;`
                ele.style = style;
                let divstyle = `left: ${e.target.offsetLeft - 1 - parseInt(this.facility.width/2) * this.interval}px;top: ${e.target.offsetTop - 1 - parseInt(this.facility.height/2) * this.interval}}px;
                width: ${width}px;height: ${height}px;position: absolute;z-index: 2000;background: yellow`
                div.style = divstyle;
                div.append(ele)
                this.$refs.box.append(div)
                this.$nextTick(() => {
                    this.dragImg = false
                    this.initialize = false
                })
            }
        },
    },
    mounted() {
        for (let i = 0; i < this.list; i++) {
            this.area.push([])
            for (let j = 0; j < this.line; j++) {
                this.area[i].push({
                    type: 1,
                    column: i,
                    row: j
                })
            }
        }
        console.log(this.area)
    }
}
</script>

<style>
.box {
    position: relative;
    display: flex;
    width: 795px;
    margin: 0 auto;
    background-color: #fff;
    flex-wrap: wrap;
    /*justify-content: space-around;*/
}

.select {
    background-color: yellow;
}

.place {
    height: 30px;
    width: 30px;
    background-color: rgb(180, 177, 177);
    display: inline-block;
    margin: 0 1px 1px 0;
    border: 1px rgb(180, 177, 177) dashed;
}

.active {
    border-color: red;
    background-color: red;
}

.v-selected-area {
    position: absolute;
    border: 1px dashed grey;
}

.facility {
    display: flex;
    justify-content: space-around
}

.facilityItem {
    cursor: pointer;
}

.dragImg {
    position: absolute;
    pointer-events: none;
    background: #fff;
    opacity: .6;
}

.move {
    position: absolute;
    left: 0;
    top: 0;
}
</style>
