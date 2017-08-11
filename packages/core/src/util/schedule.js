import { mockable } from '../testing/mocks';

let schedule = task => setTimeout(task, 0);

// @ts-ignore
if (TESTING) {
  schedule = mockable(schedule);
}

export default schedule;
