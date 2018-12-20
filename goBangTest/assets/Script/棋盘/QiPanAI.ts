// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Integer) // 纵向数
    rowNum: number = 0;

    @property(cc.Integer) // 横向数
    colNum: number = 0;

    @property(cc.Graphics) // 棋盘
    graphic: cc.Graphics = null
    
    private _pad = 20 // 棋盘距离边框的长度

    private qiziSize_w = 70 // 棋子横向大小
    private qiziSize_h = 70 // 棋子纵向大小


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        console.log('开始画棋盘咯', this.node)
        this.qiziSize_w = (this.node.width - this._pad * 2) / this.rowNum
        this.qiziSize_h = (this.node.height - this._pad * 2) / this.rowNum
        console.log('this.qiziSize = ', this.qiziSize_w, this.qiziSize_h);
        this.addListeners()
        this.drawQiPan()
    }

    drawQiPan() {
        // 通过纵向数画横向
        for (let i = 0; i <= this.colNum; i++) {
            this.graphic.moveTo(this._pad + i * this. qiziSize_w, this._pad)
            this.graphic.lineTo(this._pad + i * this.qiziSize_w, this.node.width - this._pad)
            this.graphic.stroke()
        }
        for (let i = 0; i <= this.rowNum; i++) {
            this.graphic.moveTo(this._pad, this._pad + i * this.qiziSize_h);
            this.graphic.lineTo(this.node.width - this._pad, this._pad + i * this.qiziSize_h);
            this.graphic.stroke();
        }
        this.graphic.fill()
    }

    // update (dt) {}

    onBoardTouched(cool: cc.Vec2) {
        cc.log('cool = ', cool)
        this.drawCircle(cool)
    }

    private addListeners() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouched, this);
    }

    private onTouched(event: cc.Event.EventTouch) {
        let location = this.node.convertToNodeSpaceAR(event.getLocation())
        this.onBoardTouched(this.analysisXY(location))
    }

    private analysisXY(location: cc.Vec2): cc.Vec2 {
        let xid = Math.round((location.x - this._pad) / this.qiziSize_w)
        let yid = Math.round((location.y - this._pad) / this.qiziSize_h)
        return cc.v2(xid, yid)
    }

    private drawCircle(cool: cc.Vec2) {
        this.graphic.strokeColor = cc.Color.BLACK
        this.graphic.fillColor = cc.Color.BLACK
        this.graphic.ellipse(cool.x * this.qiziSize_w + this._pad, cool.y * this.qiziSize_h + this._pad, this.qiziSize_w / 4, this.qiziSize_h / 4)
        this.graphic.fill()
    }
}
