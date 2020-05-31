declare global {
  interface Window {
    requestAnimationFrame: any;
    webkitCancelRequestAnimationFrame: any;
    mozRequestAnimationFrame: any;
    mozCancelAnimationFrame: any;
    mozCancelRequestAnimationFrame: any;
  }
}
function init() {
  if (!Date.now)
    Date.now = function () {
      return new Date().getTime();
    };

  (function () {
    'use strict';

    const vendors: string[] = ['webkit', 'moz'];

    for (let i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
      const vp: string = vendors[i];

      if (vp == 'webkit') {
        window.requestAnimationFrame = window.webkitRequestAnimationFrame;

        window.cancelAnimationFrame =
          window.webkitCancelAnimationFrame ||
          window.webkitCancelRequestAnimationFrame;
      } else if (vp == 'moz') {
        window.requestAnimationFrame = window.mozRequestAnimationFrame;

        window.cancelAnimationFrame =
          window.mozCancelAnimationFrame ||
          window.mozCancelRequestAnimationFrame;
      }
    }

    if (
      /iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || // iOS6 is buggy
      !window.requestAnimationFrame ||
      !window.cancelAnimationFrame
    ) {
      let lastTime = 0;

      window.requestAnimationFrame = function (callback: any) {
        const now = Date.now();

        const nextTime = Math.max(lastTime + 16, now);

        return setTimeout(
          function () {
            callback((lastTime = nextTime));
          },

          nextTime - now
        );
      };

      window.cancelAnimationFrame = clearTimeout;
    }
  })();
}
export default init;

// export default function(result: (time: number) => void) {
//   function getReqCallback() {
//     var count = 0;
//     var start: number = 0;
//     var lastTimestamp: number = 0;
//     var delta = 0;
//     return function req(timestamp: number) {
//       if (start === null) {
//         start = timestamp;
//         lastTimestamp = timestamp;
//       }
//       count++;
//       delta = timestamp - lastTimestamp;
//       if (delta > 5) {
//         result(delta);
//       }
//       lastTimestamp = timestamp;
//       if (count < 5) {
//         requestAnimationFrame(req);
//       }
//     };
//   }
//   requestAnimationFrame(getReqCallback());
// }
