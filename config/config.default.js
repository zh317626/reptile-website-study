/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1642752276740_6395';

  // add your middleware config here
  config.middleware = [];

  /**
   * 修改启动端口号
   */
   config.cluster = {
    // listen: {
    //   path: '',
    //   port: 8080,
    //   hostname: 'localhost',
    //   // hostname: '192.168.110.95',
    //   // hostname: '192.168.1.94',
    // },
  };

  // 跨域问题
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '*' ], // []中放放出的白名单，*代表所有
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
