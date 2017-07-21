import partition  from 'lodash/partition';
import find       from 'lodash/find';
import { error as logError } from './log.js';

let queue = [];
let ready = [];

function once(event, task) {
  const fired = find(ready, r => r.event === event);
  if (fired) {
    try {
      task(fired.message);
    } catch(err) {
      logError(err);
    }
  } else {
    queue.push({
      event,
      task,
    });
  }
}

function broadcast(event, message) {
  const [tasks, rest] = partition(queue, q => q.event === event);
  queue = rest;
  ready.push({ event, message });

  tasks.forEach(task => {
    try {
      task(message);
    } catch(err) {
      logError(err);
    }
  });
}

export {
  once,
  broadcast,
};
