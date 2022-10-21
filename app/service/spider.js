/*
 * @创建文件:\app\service\spider.js
 */
'use strict';

const Service = require('egg').Service;

class SpiderService extends Service {
  async spider(url) {
    const result = await this.ctx.curl(url);
    return result;
  }
}

module.exports = SpiderService;
