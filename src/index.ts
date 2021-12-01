import { start } from "repl";
import {
  BehaviorSubject,
  merge,
  fromEvent,
  interval,
  EMPTY,
  timer,
  Subject,
  defer,
} from "rxjs";
import {
  map,
  mapTo,
  tap,
  scan,
  mergeMap,
  switchMap,
  withLatestFrom,
  takeWhile,
  takeUntil,
  repeat,
} from "rxjs/operators";
import "./style.css";

const log = console.log;

// type Direction = "up" | "down";

// interface Countdown {
//   count: number;
//   speed: number;
//   ticking: boolean;
//   step: number;
//   countup: boolean;
// }

// model -------------------------------------------------------------------------------
const Countdown = {
  duration: 1500,
  speed: 1000,
  step: 1,
};

// dispatch actions --------------------------------------------------------------------
// action start
const startBtn = document.getElementById("start");
// const start$ = fromEvent(startBtn!, "click").pipe( mapTo(true))
const start$ = fromEvent(startBtn!, "click").pipe(mapTo(1));

// action pause
const pauseBtn = document.getElementById("pause");
const pause$ = fromEvent(pauseBtn!, "click"); //.pipe( mapTo(0))

// reset signal
const signal = new Subject();
const resetBtn = document.getElementById("reset");
const reset$ = fromEvent(resetBtn!, "click")
  .pipe(
    tap((_) => (Countdown.duration = 1500)),
    tap((_) => signal.next(0))
  )
  .subscribe(() => renderCount(1500));

// update  ---------------------------------------------------------------------------------------
const update$ = merge(start$, pause$)
  .pipe(
    // tap((v) => console.log(v)),
    switchMap((it) => (it == 1 ? timer(Countdown.duration, Countdown.speed) : EMPTY)),
    scan((timeLeft, _) => timeLeft - Countdown.step, Countdown.duration),
    takeWhile((it) => it > 0),
    takeUntil(signal),
    repeat()
  )
  .subscribe(renderCount);

// view (render state) -------------------------------------------------
// count
const countEl = document.getElementById("count");
function renderCount(n: number | string) {
  log("count:", n);
  if (typeof n === "number") {
    countEl!.innerText = n.toString();
  } else if (typeof n === "string") {
    countEl!.innerText = n;
  }
}
// speed
const speedEl = document.getElementById("speed");
function renderSpeed(n: number) {
  //@ts-ignore
  speedEl!.value = n.toString();
}

const stepEl = document.getElementById("step");
function renderStep(n: number) {
  //@ts-ignore
  stepEl!.value = n.toString();
}

const countupEl = document.getElementById("countup");
function renderCountUp(b: boolean) {
  if (b) {
    //@ts-ignore
    log("countup:", b);
    countupEl!.innerText = "Counting up";
  } else {
    //@ts-ignore
    countupEl!.innerText = "Counting down";
  }
}

function init() {
  renderCount(Countdown.duration);
  renderSpeed(Countdown.speed);
  renderStep(Countdown.step);
}

init();
