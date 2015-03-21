/* global input */

(function(exports) {
  'use strict';
  var config = {
    nes: {
      image: 'style/images/nes_controller.png',
      buttons: [
        { name: 'up', x: 110, y: 140 },
        { name: 'left', x: 75, y: 180 },
        { name: 'right', x: 150, y: 180 },
        { name: 'down', x: 110, y: 215 },
        { name: 'b', x: 450, y: 210 },
        { name: 'a', x: 540, y: 210 },
        { name: 'start', x: 340, y: 210 },
        { name: 'select', x: 260, y: 210 }
      ]
    }
  };
  exports.config = config;
}(window));
