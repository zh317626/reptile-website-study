'use strict';

const Controller = require('egg').Controller;

const cheerio = require('cheerio');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async getPictureData(ctx) {
    const url = 'https://www.woyaogexing.com/touxiang/nv/2021/1159425.html'; // 以爬取 我要个性网图片为例
    const list = await ctx.service.spider.spider(url);
    console.log(list);
    // toString是为了解析出buffer数据
    const pageXml = list.data.toString();

    // decodeEntities参数是为了解决cheerio获取的中文乱码
    const $ = cheerio.load(pageXml, { decodeEntities: false });

    const imgListData = [];
    // 爬取某一个列表数据
    $('a img').each(function() {
      const text = $(this).attr('src');
      console.log(text);
      imgListData.push(text);
    });
    ctx.body = imgListData;
  }

  async getPictureDataNan(ctx) {
    const url = 'https://www.novipnoad.com/'; // 以爬取 我要个性网图片为例
    const list = await ctx.service.spider.spider(url);
    // toString是为了解析出buffer数据
    const pageXml = list.data.toString();

    // decodeEntities参数是为了解决cheerio获取的中文乱码
    const $ = cheerio.load(pageXml, { decodeEntities: false });

    const imgListData = [];
    // 爬取某一个列表数据
    $('.item-thumbnail a').each(function() {
      const text = $(this).attr('href');
      imgListData.push(text);
    });
    ctx.body = imgListData;
  }

  async setMeme() {
    const { ctx } = this;
    const url = 'http://service.aibizhi.adesk.com/v1/vertical/category/4e4d610cdf714d2966000002/vertical'; // 转发获取壁纸
    // const list = await ctx.service.spider.spider(url);
    const list = await this.ctx.curl(url,{
      method:'POST',
      headers:{
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
        Host: 'service.aibizhi.adesk.com',
        Origin: 'http://tu.k8aa.com',
        Referer: 'http://tu.k8aa.com/',
      },
      data:{
        limit:12,skip:296,adult:false,first:0,order:'hot'
      }
    });

    // const buffer = new Buffer.from();
    
    console.log(list);
    ctx.body = JSON.parse(list.data);
  }
}

module.exports = HomeController;
