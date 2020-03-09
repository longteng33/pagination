function Pagination(pageObj) {
    this.ele = pageObj.ele;
    this.pageTotals = pageObj.pageTotals;
    this.currentPages = pageObj.currentPages;
    this.cb = pageObj.cb;


    this.init();
}
Pagination.prototype = {
    init: function () {
        var _this = this;

        this.fillHtml();


        this.ele.on("click", ".page", function () {
            var index = parseInt($(this).text());
            _this.currentPages = index;
            _this.fillHtml();
            _this.cb();
        });

        this.ele.on("click", ".prev:not(.disabled)", { dir: -1, _this: this }, this.pageBtn)
        this.ele.on("click", ".next:not(.disabled)", { dir: 1, _this: this }, this.pageBtn)

    },

    pageBtn: function (e) {
        var _this = e.data._this;
        var n = e.data.dir;
        _this.currentPages += n;
        _this.fillHtml();
        _this.cb();
    },


    //生成一个标准页
    createPage: function (index) {
        this.$page = $('<a href="javascript:" class="page"></a>');
        this.$pageIndex = $('<span class="page-index"></span>');
        this.$pageIndex.text(index);
        this.$page.append(this.$pageIndex);
    },
    //生成current页
    createCurrentPage: function (index) {
        this.$current = $('<div class="current"></div>');
        this.$pageIndex = $('<span class="page-index"></span>');
        this.$pageIndex.text(index);
        this.$current.append(this.$pageIndex);
    },
    //生成...符号
    cteateOmit: function (index) {
        this.omitSpan = $('<span class="omit">...</span>');
    },
    // 填充页码函数，从star位置填充到end位置
    fillPage: function (start, end) {
        for (var i = start; i <= end; i++) {
            if (i == this.currentPages) {
                var currentItem = new this.createCurrentPage(i);
                this.ele.append(currentItem.$current)
            } else {
                var pageItem = new this.createPage(i);
                this.ele.append(pageItem.$page);
            }
        }
    },

    fillHtml: function () {
        this.ele.empty();
        if (this.currentPages > this.pageTotals || this.currentPages < 1 || this.pageTotals < 1) {
            return;
        }

        var $prev = $('<a href="javascript:" class="prev">&lt上一页</a>');
        if (this.currentPages == 1) {
            $prev.addClass("disabled");
        }
        this.ele.append($prev);

        // 此分页码组件一共有9个位置，所以当总页数少于等于9页时，就全部填充为页码
        if (this.pageTotals <= 9) {
            this.fillPage(1, 9);
        } else {
            // 当总页数大于9页时
            var start;
            var end;
            // 当currentPages小于5时，前面就不要...符号了
            if (this.currentPages <= 5) {
                start = 1;
                end = 7;
                this.fillPage(start, end);
                var omit = new this.cteateOmit();
                this.ele.append(omit.omitSpan);
                var pageItem = new this.createPage(this.pageTotals);
                this.ele.append(pageItem.$page);

            } else if (this.currentPages + 5 > this.pageTotals) {
                // 当currentPages + 5大于总页数时，后面就不要...符号了
                start = this.pageTotals - 6;
                end = this.pageTotals;
                var pageItem = new this.createPage(1);
                this.ele.append(pageItem.$page);
                var omit = new this.cteateOmit();
                this.ele.append(omit.omitSpan);
                this.fillPage(start, end);
            } else {
                // 其余情况，当currentPages既不在较前面，也不再较后面，在比较中间的位置的时候
                start = this.currentPages - 2;
                end = this.currentPages + 2;
                // 最前面就留一个1页码
                var pageItem = new this.createPage(1);
                this.ele.append(pageItem.$page);
                var omit = new this.cteateOmit();
                this.ele.append(omit.omitSpan);
                this.fillPage(start, end);
                var omit = new this.cteateOmit();
                this.ele.append(omit.omitSpan);
                // 最后面就留一个终页码
                var pageItem = new this.createPage(this.pageTotals);
                this.ele.append(pageItem.$page);
            }


        }

        var $next = $('<a href="javascript:" class="next">下一页&gt</a>');
        if (this.currentPages == this.pageTotals) {
            $next.addClass("disabled");
        }
        this.ele.append($next);



    }

}



