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

    private qiziSize = 70 // 棋子大小


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        console.log('开始画棋盘咯')
        this.qiziSize = (this.node.width - this._pad * 2) / this.rowNum
        console.log('this.qiziSize = ', this.qiziSize);
        this.drawQiPan()
    }

    drawQiPan() {
        // this.graphic.clear();
        console.log('this.colNum = ', this.colNum);
        console.log('this.rowNum = ', this.rowNum);
        for (let i = 0; i <= this.colNum; i++) {
            this.graphic.moveTo(this._pad + i * this.qiziSize, this._pad)
            this.graphic.lineTo(this._pad + i * this.qiziSize, this.node.width - this._pad)
            this.graphic.stroke()
        }
        for (let i = 0; i <= this.rowNum; i++) {
            this.graphic.moveTo(this._pad, this._pad + i * this.qiziSize);
            this.graphic.lineTo(this.node.width - this._pad, this._pad + i * this.qiziSize);
            this.graphic.stroke();
        }
        this.graphic.fill()
        console.log('一花完毕');
        
    }

    // update (dt) {}
}
