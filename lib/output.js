'use strict'

const Spinner = require('cli-spinner').Spinner
const ChildProcess = require('child_process')

// Internal spinner instance
//
const spinner = new Spinner()
spinner.setSpinnerString(')<->(')

// Default output function for outputFn
// @see outputFn below
//
const DEFAULT_OUTPUT_FN = console.log // eslint-disable-line no-console

// Settable output function.
// Defaults to console.log
//
// @see setOutputFn() in exports
//
let outputFn = DEFAULT_OUTPUT_FN

// Spawn a pager with the given data. The data will be written
// to the pager's stdin. Falls back to outputFn if the
// PAGER env var isn't set.
//
// It is the caller's responsibility to check for an interactive TTY.
//
// @param {string} data
// The data to feed to the pager
//
const spawnpager = function (data) {
  const pager = process.env.PAGER // eslint-disable-line no-process-env

  if (typeof pager === 'undefined') {
    outputFn(data)
    return
  }

  const opts = { stdio: ['pipe', 'inherit', 'inherit'] }
  const child = ChildProcess.spawn(pager, [], opts)

  child.stdin.on('error', function (err) {
    if (err.code === 'ECONNRESET') {
      // no-op. User quit
      return
    }

    outputFn(err)
  })

  child.stdin.write(data)
  child.stdin.end()
}

module.exports = {
  // Show a spinner with the given progress message
  // if the session is interactive. Else nothing.
  //
  // @param {string} message
  // The progress message to display
  //
  progress (message) {
    if (!process.stdout.isTTY) {
      return
    }

    if (!spinner.isSpinning()) {
      spinner.start()
    }

    spinner.setSpinnerTitle(message)
  },

  // Output the given data. Uses a pager if PAGER is set
  // in the environemt and the session is interactive.
  // Flass back to stdout otherwise.
  //
  // @param {string} data
  // The data to output
  //
  data (data) {
    if (!process.stdout.isTTY) {
      outputFn(data)
      return
    }

    spinner.stop(true)
    spawnpager(data)
  },

  // Sets the general output function which will
  // be used whenever output is desired. Will reset to
  // the default output function if the given param
  // isn't truthy.
  //
  // n.b. Defaults to console.log
  //
  // @param {function} fn
  // The function to call for output.
  // Should accept a string and do side-effect stuff.
  //
  setOutputFn (fn) {
    outputFn = fn || DEFAULT_OUTPUT_FN
  }
}
