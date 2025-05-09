export function generateSchedule({
  plots,
  motors,
  startTime,
  endTime,
  motorRunTime,  
  interval,
}) {

  const formatTime = (timeStr) =>
    new Date(2000, 0, 1, ...timeStr.match(/.{1,2}/g).map(Number));


  const backFormat = (date) =>
    date
      .toTimeString()
      .split(' ')[0]
      .replace(/:/g, '')
      .slice(0, 6);

  const schedule = [];
  const runTime = motorRunTime * 60 * 1000;  
  const restTime = interval * 60 * 1000;  

  const start = formatTime(startTime); 
  const end = formatTime(endTime); 
  let current = new Date(start); 
  let plotCounter = 0;
  let index = 0;


  while (current < end) {
    for (let m = 0; m < motors && plotCounter < plots; m++) {
      const startT = new Date(current);  
      const endT = new Date(current.getTime() + runTime);  
      schedule.push({
        index: index++,
        plot: `D${(plotCounter % plots) + 1}`, 
        startTime: backFormat(startT), 
        endTime: backFormat(endT), 
        RunBy: `M${(m % motors) + 1}`,  
      });
      plotCounter++;
    }
   
    current = new Date(current.getTime() + runTime + restTime);


    if (plotCounter >= plots) plotCounter = 0;
  }

  return schedule;
}
