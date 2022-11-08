const Controller = require('egg').Controller;

const cheerio = require('cheerio');
const fs = require('mz/fs');
const path = require("path");

class wallController extends Controller {

    async mallIndex() {
        const { ctx } = this;
        const url = 'https://wallhaven.cc/'; // 
        const list = await ctx.service.spider.spider(url,{
            method:'GET',
            headers:{
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
            },
        });
        // toString是为了解析出buffer数据
        const pageXml = list.data.toString();

        // decodeEntities参数是为了解决cheerio获取的中文乱码
        const $ = cheerio.load(pageXml, { decodeEntities: false });

        let classify = [];
        // 获取分类
        $('.pop-tags .pop-tag-item a').each(function () {
            const text = $(this).text();
            const url = $(this).attr('href');
            classify.push({
                title:text,
                url
            })
        });

        let slideshow = [];
        // 获取轮播
        $('.feat-row .lg-thumb img').each(function () {
            const url = $(this).attr('src');
            slideshow.push({url});
        });

        // 图片列表
        let listData = [];
        $('.more-feat .feat-row img').each(function () {
            const url = $(this).attr('src');
            listData.push({url})
        });

        ctx.body = {
            code:200,
            classify,
            slideshow,
            list:listData
        };
    }

    // 获取列表
    async wallList() {
        const { ctx } = this;
        let {url,page=1} = ctx.request.body;
        if (!url) {
            return ctx.body = { code:201,msg:'url不能为空' };
        };
        if (url.indexOf('&') !== -1) {
            url = url + '&page=' + page;
        }else {
            url = url + '?page=' + page;
        };
        const list = await ctx.curl(url,{
            method:'GET',
            headers:{
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
            },
        });
        // toString是为了解析出buffer数据
        const pageXml = list.data.toString();

        // decodeEntities参数是为了解决cheerio获取的中文乱码
        const $ = cheerio.load(pageXml, { decodeEntities: false });

        let info = [];
        $('.thumb-listing-page ul li').each(function (index,item) {
            const data = $(item).html();
            const imageIndex = data.indexOf('data-src');
            const imageLatIndex = data.indexOf('src="">');
            const image = data.substring(imageIndex + 10,imageLatIndex - 2);

            const aIndex = data.indexOf('href=');
            const aLatIndex = data.indexOf('</a');
            const a = data.substring(aIndex + 6, aLatIndex - 18);

            info.push({
                img:image,
                url:a
            });
        });

        ctx.body = {
            code:200,
            data:info,
            page,
            count:info.length
        };
    }
}

module.exports = wallController;