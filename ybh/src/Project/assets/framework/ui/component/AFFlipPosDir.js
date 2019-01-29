cc.Class({
    extends: cc.Component,
    
    editor: {
        menu: 'ApplicationFramework/AFFlipPosDir'
    },

    properties: {
    	strNodeFlipPosX: [cc.String],
    	strNodeFlipDirX: [cc.String],
    },

    // use this for initialization
    onLoad: function () {
        for(var i = 0; i < this.strNodeFlipPosX.length; i++) {
            var node = cc.find(this.strNodeFlipPosX[i], this.node);
            node.x = -node.x;
        }

        for(var i = 0; i < this.strNodeFlipDirX.length; i++) {
            var node = cc.find(this.strNodeFlipDirX[i], this.node);
            node.scaleX = -node.scaleX;
        }
    },
});
