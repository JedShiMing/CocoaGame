// if(typeof window == "undefined") {
//     var AF = {};
// } else {
//     window.AF = window.AF || {};
// }

var Random2 = function(seed){
    seed = seed || new Date().getTime();
    this.setSeed(seed);
};

Random2.prototype.next = function(a,b){
    this._seed = this._seed * 16807 % 2147483647;
    if(arguments.length === 0){
        return this._seed/2147483647;
    }else if(arguments.length === 1){
        return (this._seed/2147483647)*a;
    }else{
        return (this._seed/2147483647)*(b-a)+a;
    }
};

Random2.prototype.getChance = function (chance) {
    var r = this.getRandomIn(1, 100);

    return r <= chance;
}

Random2.prototype.getRandomIn = function (min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
}

Random2.prototype.setSeed = function (seed) {
    this._seed = seed * 16807 % 2147483647;
    if (this._seed <= 0){ this._seed += 2147483646;}
}

AF.Random2 = module.exports = Random2;

AF.Random = new AF.Random2(new Date().getTime())