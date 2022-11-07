'use strict';

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
}

module.exports = wallController;