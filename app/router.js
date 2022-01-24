'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get("/getPictureData", controller.home.getPictureData);
  router.get("/getPictureDataNan", controller.home.getPictureDataNan);
};
