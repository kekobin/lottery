(function($, window, undefined) {
	var recursion; //缓存Lottery this对象，以便在递归时使用

	var Lottery = function(ele, opt) {
		this.$element = ele;

		var defaults = {
			index: -1, //当前转动到哪个位置，起点位置
			count: 0, //总共有多少个位置
			timer: 0, //setTimeout的ID，用clearTimeout清除
			speed: 20, //初始转动速度
			times: 0, //转动次数
			cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
			prize: -1, //中奖位置
		};

		this.options = $.extend({}, defaults, opt);
		this.options.count = this.$element.find(".lottery-unit").length;

		this.$element.find(".lottery-unit-" + this.options.index).addClass("active");
		recursion = this;
	};

	Lottery.prototype = {
		constructor: Lottery,

		roll: function() {
			var self = arguments.callee;

			recursion.options.times++;
			recursion.oneCircle();

			if (recursion.options.times > recursion.options.cycle + 10 && recursion.options.prize === recursion.options.index) {
				recursion.stop();
			} else {
				if (recursion.options.times < recursion.options.cycle) {
					recursion.options.speed -= 10;
				} else if (recursion.options.times === recursion.options.cycle) {
					recursion.options.prize = Math.ceil(Math.random() * (recursion.options.count - 1));
				} else {
					recursion.options.speed += 20;
				}

				if (recursion.options.speed < 40) {
					recursion.options.speed = 40;
				}

				recursion.options.timer = setTimeout(self, recursion.options.speed);
			}

			return recursion;
		},

		oneCircle: function() {
			var index = this.options.index;

			this.$element.find(".lottery-unit-" + index).removeClass("active");

			if (++index > this.options.count - 1) {
				index = 0;
			}

			this.$element.find(".lottery-unit-" + index).addClass("active");
			this.options.index = index;
		},

		stop: function() {
			clearTimeout(this.options.timer);
			this.options.index = -1;
			this.options.prize = -1;
		}
	};

	$.fn.lottery = function(options) {
		return new Lottery(this, options).roll();
	};
}(jQuery, window));