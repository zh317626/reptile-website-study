'use strict';

const Controller = require('egg').Controller;

const cheerio = require('cheerio')

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async getPictureData(ctx) {
    var url = 'https://www.woyaogexing.com/touxiang/nv/2021/1159425.html'; // 以爬取 我要个性网图片为例
    const list = await ctx.service.spider.spider(url);
    console.log(list);
    // toString是为了解析出buffer数据
    const pageXml = list.data.toString();
 
    // decodeEntities参数是为了解决cheerio获取的中文乱码
    const $ = cheerio.load(pageXml, { decodeEntities: false });
 
    const imgListData = [];
    // 爬取某一个列表数据
    $('a img').each(function () {
      let text = $(this).attr('src')
      console.log(text);
      imgListData.push(text);
    })
    ctx.body = imgListData
  }

  async getPictureDataNan(ctx) {
    var url = 'https://www.novipnoad.com/'; // 以爬取 我要个性网图片为例
    const list = await ctx.service.spider.spider(url);
    // toString是为了解析出buffer数据
    const pageXml = list.data.toString();
 
    // decodeEntities参数是为了解决cheerio获取的中文乱码
    const $ = cheerio.load(pageXml, { decodeEntities: false });
 
    const imgListData = [];
    // 爬取某一个列表数据
    $('.item-thumbnail a').each(function () {
      let text = $(this).attr('href')
      imgListData.push(text);
    })
    ctx.body = imgListData
  }
}

module.exports = HomeController;
