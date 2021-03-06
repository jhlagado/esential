import { HEIGHT, WASM_FILENAME, WIDTH } from './common/constants';
import { calcNumPages, log, rnd } from './common/tools';
import { init, step, fill, setup } from './life-js';
import { addAllListeners, isActive } from './listeners';
import { Exported } from './types';

const timer = (boardSize: number, mem: any, exported: any, increment: number, limit: number) => {
  var update = (divisor: number) => () => {
    setTimeout(update(Math.min(divisor + increment, limit)), 1000 / divisor);
    mem.copyWithin(0, boardSize, boardSize + boardSize);
    if (isActive()) exported.step();
  };
  setTimeout(update(1), 1000);
};

const run = async (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d');
  if (!context) return;

  context.imageSmoothingEnabled = false;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const pages = calcNumPages(WIDTH, HEIGHT);
  const boardSize = WIDTH * HEIGHT;

  const useWASM = false;

  const memory = new WebAssembly.Memory({
    initial: pages,
    maximum: pages,
  });
  const env = {
    memory,
    abort: function() {
      return;
    },
    log,
    rnd,
  };

  try {
    let exported: any;
    if (useWASM) {
      const response = await fetch(WASM_FILENAME);
      const buffer = await response.arrayBuffer();
      const module = await WebAssembly.instantiate(buffer, { env });
      exported = module.instance.exports as Exported;
    } else {
      setup({ env });
      exported = {
        init,
        step,
        fill,
      };
    }
    exported.init(WIDTH, HEIGHT);
    const mem = new Uint32Array(memory.buffer);
    const imageData = context.createImageData(WIDTH, HEIGHT);
    const pixels = new Uint32Array(imageData.data.buffer);

    (function render() {
      requestAnimationFrame(render);
      pixels.set(mem.subarray(boardSize, 2 * boardSize)); // copy output to image buffer
      context.putImageData(imageData, 0, 0); // apply image buffer
    })();
    timer(boardSize, mem, exported, 1, 60);
    addAllListeners(canvas, document, (x: number, y: number) => exported.fill(x, y));
  } catch (err) {
    alert('Failed to load WASM: ' + err.message + ' (ad blocker, maybe?)');
    console.log(err.stack);
  }
};

run(document.getElementsByTagName('canvas')[0]);
