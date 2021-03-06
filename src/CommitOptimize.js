import { AEvent } from "./AEvent";
import { requestAnimationFrame } from "aomd-utils";

/**
 *
 *
 * @class CommitOptimize
 */
class CommitOptimize extends AEvent{
  /**
   *Creates an instance of CommitOptimize.
   * @param {*} time 间隔时间
   * @param {*} num 多少条触发
   * @memberof CommitOptimize
   */
  constructor(time, num) {
    super();
    // 获取当前时间戳 为基准
    this.timeStamp = new Date().getTime();

    // 多久触发事件 
    // 默认3min
    this.time = time || 3000;

    // 多少个触发事件
    // 默认300条数据
    this.num = num || 300;

    // 收集触发事件
    this._event = {
      'timeUp': [],
      'numUp': []
    }

    // 收集数据
    this.data = []


    this.timeComputer()
  }

  /**
   * 计算时间
   *
   * @memberof CommitOptimize
   */
  timeComputer() {
    var t = new Date().getTime()
    if (t - this.timeStamp >= this.time) {
      this.timeStamp = t
      // 触发时间事件
      this._emit('timeUp',this.data);
      this.clearData()
    }
    requestAnimationFrame(this.timeComputer.bind(this))
  }


  /**
   * 私有方法
   *
   * @param {*} data
   * @memberof CommitOptimize
   */
  push(data) {
    this.data.push(data);
    // 重置时间
    this.timeStamp = new Date().getTime();

    if (this.data.length >= this.num) {
      // 触发个数事件
      this._emit('numUp',this.data);
      
      this.clearData()
    }
  }

  /**
   * 获取数据
   *
   * @returns
   * @memberof CommitOptimize
   */
  getData() {
    return this.data
  }

  /**
   * 清理数据
   *
   * @memberof CommitOptimize
   */
  clearData() {
    this.data = [];
    // 重置时间
    this.timeStamp = new Date().getTime();
  }
}

// var commitOptimize = new CommitOptimize();

// commitOptimize.on('timeUp', function (data) {
//   console.log('timeUp', data)
// })
// commitOptimize.on('numUp', function (data) {
//   console.log('numUp', data)
// })