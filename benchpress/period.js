function Period(durations){
    this.openReqs = {};
    this.durations = durations || [];
}
Period.prototype = {
    locationOf: function(element, array, start, end) {
        start = start || 0;
        end = end || array.length;
        var pivot = parseInt(start + (end - start) / 2, 10);
        if (end-start <= 1 || array[pivot] === element) return pivot;
        if (array[pivot] < element) {
            return this.locationOf(element, array, pivot, end);
        } else {
            return this.locationOf(element, array, start, pivot);
        }
    },

    insertMeasure: function(item) {
        this.durations.splice(this.locationOf(item, this.durations) + 1, 0, item);
    },

    startMeasure: function(req) {
        var id = this.createId();
        req.servethis = req.servethis || {};
        req.servethis.benchpress = {
            id: id
        };
        this.openReqs[id] = new Date().getTime();
    },
    endMeasure: function(req){
        if(req.servethis && req.servethis.benchpress){
            var eTime = new Date().getTime();
            var id = req.servethis.benchpress.id;
            var sTime = this.openReqs[id];
            if(sTime){
                this.insertMeasure(eTime - sTime);
            }
        }
    },
    createId: function(){
        return Math.random().toString();
    },

    getAvg: function(){
        var sum = 0, l = this.durations.length;
        this.durations.forEach(function(t){
            sum += t ? t : 0;
        });
        return l ? (sum / l).toFixed(2) : void 0;
    },

    longest: function(){
        return this.durations[this.durations.length - 1];
    },

    printDefault: function(){
        console.log('count: ' + this.durations.length + '   avg: ' + (this.getAvg() || '--')  + '   longest: ' + this.longest());
    }
};

module.exports = Period;