'use strict';

const Controller = require('egg').Controller;

const cheerio = require('cheerio');
const fs = require('mz/fs');
const path = require("path");

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

  async setPoetry() {
    const { ctx } = this;
    const url = 'https://wallhaven.cc/hot?page=1';
    const { data } = await this.ctx.curl(url);
    // 详情接口
    // https://wallhaven.cc/w/7p6wke 
    console.log(data);

    // toString是为了解析出buffer数据
    const pageXml = data.toString();
    // // console.log(pageXml);

    // // decodeEntities参数是为了解决cheerio获取的中文乱码
    const $ = cheerio.load(pageXml, { decodeEntities: false });

    let images =[];

    $('#thumbs').each(function() {
      const html = $(this).html()
      // console.log(html);
      // const image = $('img').attr('src');
      // console.log(image);
      html.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function(match,capture) {
        if (capture.startsWith("http") || capture.startsWith("https")) {
          images.push(capture);
        }else {
          images.push('https:' + capture);
        }
      })
      // images.push(image);
    })

    ctx.body = {
      code:200,
      images
    };
  }

  async setDouyin() {
    const { ctx } = this;
    const {url} = ctx.request.body;
    const urls = this.httpString(url);
    console.log(urls);
    if (!url) {
      return ctx.body = {
        code:201,
        data:[],
        msg:'请输入链接'
      }
    };
    const { data } = await this.ctx.curl(urls);
    // toString是为了解析出buffer数据
    const pageXml = data.toString();
    // // console.log(pageXml);

    // // decodeEntities参数是为了解决cheerio获取的中文乱码
    const $ = cheerio.load(pageXml, { decodeEntities: false });
    let urlop = ''; 

    $('a').each(function() {
      const a = $(this).attr('href');
      const video = a.indexOf('video');
      const id = a.indexOf('?');
      urlop = `https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=` + a.substring(video + 6,id-1);
    });

    // console.log(urlop);

    const { data:videoData } = await this.ctx.curl(urlop);
    const pageXmlData = videoData.toString();
    // console.log(pageXmlData);
    if (!pageXmlData) {
      return ctx.body = {
        code:201,
        data:[],
        msg:'解析失败'
      };
    }
    const pageXmlDataList = JSON.parse(pageXmlData);
    const videoUrl = pageXmlDataList["item_list"][0]["video"]["play_addr"]["url_list"][0];
    const musicUrl = pageXmlDataList["item_list"][0]["music"]["play_url"]["url_list"][0];
    const parmas = {
      videoUrl:videoUrl.replace('wm',''),
      video:videoUrl,
      musicUrl,
    }

    ctx.body = {
      code:201,
      data: parmas,
      msg:'解析成功'
    };

  }

  // https://v.kuaishou.com/x37Ahq 十岁小孩实力征服学校老大，道馆一干四，最后还打倒的马老师 "龙拳小子 "跆拳道 "林秋楠 该作品在快手被播放过1,701万次，点击链接，打开【快手】直接观看！

  async setKuaishou() {
    const { ctx } = this;
    // const {url} = ctx.request.body;
    const url = 'https://v.kuaishou.com/x3NGom 新惯疫苗来了你打了吗 "抗击疫情我们在一起 "全民防疫 "新冠疫情 该作品在快手被播放过148万次，点击链接，打开【快手】直接观看！';
    const urls = this.httpString(url);
    // console.log(url);
    console.log(urls);
    // const { data } = await this.ctx.curl('http://www.bing.com/search?q='+url);
    const { data } = await this.ctx.curl(urls,{
      method:'GET',
      headers:{
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
        "Host": "live.kuaishou.com",
        "Cookie": "did=web_c0f3196ec94d4837b5f7850e3ebac3b9; didv=1589520098000; clientid=3; client_key=65890b29",
      },
    });
    console.log(data);
    // toString是为了解析出buffer数据
    const pageXml = data.toString();

    const $ = cheerio.load(pageXml, { decodeEntities: false });
    console.log(pageXml);
    $('a').each(function() {
     
    });
  }


  async setCut() {
    const { ctx } = this;
    const {url} = ctx.request.body;
    const { data } = await this.ctx.curl(url);
    console.log(data);
    const dir = path.join('app/public/' + new Date().getTime() + '.mp4');
    // 生成图片2(把buffer写入到图片文件)
    fs.writeFile(dir, data, function (err) {
      if (err) {}
    });
  }

  //解析字符串里面的url
  httpString (s){
    let reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    try {
        return s.match(reg)[0];
    } catch (error) {
        return null;
    }
  }
}

module.exports = HomeController;
