'use strict'

const Spinner = require('cli-spinner').Spinner
const ChildProcess = require('child_process')

// Internal spinner instance
//
const spinner = new Spinner()
spinner.setSpinnerString(')<->(')

// Spawn a pager with the given data. The data will be written
// to the pager's stdin. Falls back to the given fallback fn if
// PAGER env var isn't set.
//
// It is the caller's responsibility to check for an interactive TTY.
//
// @param {string} data
// The data to feed to the pager
//
// @param {function} fallback
// A function to fallback to for string output if PAGER isn't set.
// The function should accept a string argument to output. See
// Output.println for an example.
//
const spawnpager = function (data, fallback) {
  const pager = process.env.PAGER // eslint-disable-line no-process-env

  if (typeof pager === 'undefined') {
    fallback(data)
    return
  }

  const opts = { stdio: ['pipe', 'inherit', 'inherit'] }
  const child = ChildProcess.spawn(pager, [], opts)

  child.stdin.write(data)
  child.stdin.end()
}

module.exports = class Output {
  // Show a spinner with the given progress message
  // if the session is interactive. Else nothing.
  //
  // @param {string} message
  // The progress message to display
  //
  static progress (message) {
    if (!process.stdout.isTTY) {
      return
    }

    if (!spinner.isSpinning()) {
      spinner.start()
    }

    spinner.setSpinnerTitle(message)
  }

  // Output the given data. Uses a pager if PAGER is set
  // in the environemt and the session is interactive.
  // Flass back to stdout otherwise.
  //
  // @param {string} data
  // The data to output
  //
  static data (data) {
    if (!process.stdout.isTTY) {
      Output.println(data)
      return
    }

    spinner.stop(true)
    spawnpager(data, Output.println)
  }

  // Print the given string to stdout
  //
  // @param {string} str
  // The string to print
  //
  static println (str) {
    console.log(str) // eslint-disable-line no-console
  }
}
