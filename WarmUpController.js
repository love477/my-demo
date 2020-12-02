/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
export class WarmUpController extends Controller {
  constructor(count, warmUpPeriod, coldFactor) {
    super();
    this.count = count;
    this.coldFactor = coldFactor;
    this.lastFilledTime = Date.now();

    // 假设系统从开始进入稳定期到完全稳定(令牌的获取速度和令牌的加入速度持平，storedPermits = 0) 所需的时间占令牌完全消耗的时间的 1/coldFactor，
    // 即 thresholdPermits*stableInterval/(thresholdPermits*stableInterval + warmUpPeriod) = 1/coldFactor，
    // 而从上面的函数图形中我们知道预热时间为梯形面积 warmUpPeriod = 0.5*(stableInterval + coldInterval)*(maxPermits - thresholdPermits)；

    this.thresholdPermits = (warmUpPeriod * count) / (coldFactor - 1);
    this.maxPermits = this.thresholdPermits + (2 * warmUpPeriod * count / (1 + coldFactor));

    // 预热期比例常数
    this.slope = ((coldFactor - 1) * (this.maxPermits - this.thresholdPermits)) / count;
    // 令牌初始值为令牌最大值
    this.storedPermits = this.maxPermits;
  }

  // 判断当前请求是否能通过
  canPass(node, acquireCount) {
    const currentQps = node.passQps();
    this.resync(node.previousPassQps());
    let cost;
    if (this.storedPermits > this.thresholdPermits) {
      // 处于预热期的令牌数
      const warmUpPermits = this.storedPermits - this.thresholdPermits;

      if (acquireCount < warmUpPermits) {
        cost = this.slope * acquireCount;
      } else {
        cost = this.slope * warmUpPermits + (1 / this.count) * (acquireCount - warmUpPermits);
      }
      if (currentQps + acquireCount < 1 / cost) {
        return true;
      }
    } else if (currentQps + acquireCount < this.count) {
      return true;
    }

    return false;
  }

  resync(passQps) {
    let currentTime = Date.now();
    currentTime = currentTime - currentTime % 1000;
    const oldLastFillTime = this.lastFilledTime;
    if (currentTime <= oldLastFillTime) {
      return;
    }
    this.storedPermits = this.coolDownTokens(currentTime, passQps);

    const currentValue = this.storedPermits - passQps;
    this.storedPermits = Math.max(currentValue, 0);
    this.lastFilledTime = currentTime;
  }

  coolDownTokens(currentTime, passQps) {
    const oldValue = this.storedPermits;
    let newValue = oldValue;

    // 添加令牌的判断前提条件:
    // 当令牌的消耗程度远远低于警戒线的时候
    if (oldValue < this.thresholdPermits) {
      newValue = (oldValue + (currentTime - this.lastFilledTime) * this.count / 1000);
    } else if (oldValue > this.thresholdPermits) {
      if (passQps < (this.count / this.coldFactor)) {
        newValue = (oldValue + (currentTime - this.lastFilledTime) * this.count / 1000);
      }
    }
    return Math.min(newValue, this.maxPermits);
  }
}
