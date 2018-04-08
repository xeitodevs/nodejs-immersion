/**
 * The intention of this example is showing how tasks can be grouped in functions
 * for leveraging the power of async/await. Some tasks can be done in parallel with others.
 * In th other hand , there are plenty of tasks that needs to be done serial.
 */

function task (name, time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(name)
      resolve()
    }, time)
  })
}

function prepareRocket () {
  task('Fuel loaded !!', 10000)
  task('Avionics up and running !!', 2000)
}

async function initLaunchPhase () {
  await task('Astronauts checked in !!', 5000)
  task('Count down ended !!', 11000)
  await task('Engines started !!!', 12000)
}

async function initCruisePhase () {
  await task('Full throttle !!', 500)
  await task('Tank pressure is normal !!', 500)
  await task('Notify Launch succeeded !!', 200)
}

async function initOrbitalPhase () {
  await task('Cruise throttle established !!', 500)
  await task('Deploy fuel containers', 1000)
  task('Notify deploy of fuel containers', 200)
  await task('Orbital alignment', 1500)
}

async function launchRocket () {
  prepareRocket()
  await initLaunchPhase()
  await initCruisePhase()
  await initOrbitalPhase()
}

launchRocket()
