'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/getPictureData', controller.home.getPictureData);
  router.get('/getPictureDataNan', controller.home.getPictureDataNan);
  router.post('/api/meme', controller.home.setMeme);
  router.post('/api/poetry', controller.home.setPoetry);
  router.post('/api/douyin', controller.home.setDouyin);
  router.post('/api/ks', controller.home.setKuaishou);
  router.post('/api/cou', controller.home.setCut);


  // 壁纸接口
  router.post('/api/wall/index', controller.wallhaven.mallIndex);
  router.post('/api/wall/list', controller.wallhaven.wallList);
  router.post('/api/wall/info', controller.wallhaven.wallInfo);
};
