"use strict";

const Spinner      = require('cli-spinner').Spinner,
      ChildProcess = require('child_process')

// internal spinner instance
//
const _spinner = new Spinner()
_spinner.setSpinnerString(')<->(')

module.exports = {

  /**
   * Show a spinner with the given progress message
   * if the session is interactive. Else nothing.
   *
   * @param {string} message
   * The progress message to display
   */
  progress: function (message) {
    if (!process.stdout.isTTY) {
      return
    }

    if (! _spinner.isSpinning()) {
      _spinner.start()
    }

    _spinner.setSpinnerTitle(message)
  },

  /**
   * Output the given data. Uses a pager if PAGER is set
   * in the environemt and the session is interactive.
   * Flass back to stdout otherwise.
   *
   * @param {string} data
   * The data to output
   */
  data: function (data) {
    if (!process.stdout.isTTY) {
      this._println(data)
      return
    }

    _spinner.stop(true)
    this._spawnpager(data)
  },

  /**
   * (internal utility)
   *
   * Spawn a pager with the given data. The data
   * will be written to the pager's stdin. Falls
   * back to console output if the PAGER env var
   * isn't set.
   *
   * This is used internally, and probably doesn't
   * need to be called by external code. It is
   * the caller's responsibility to check for
   * an interactive TTY.
   *
   * @param {string} data
   * The data to feed to the pager
   */
  _spawnpager: function(data) {
    const pager = process.env.PAGER

    if (pager == undefined) {
      this._println(data)
      return
    }

    const opts = { stdio: ['pipe', 'inherit', 'inherit'] }
    const child = ChildProcess.spawn(pager, [], opts)

    child.stdin.write(data)
    child.stdin.end()
  },


  /**
   * (internal utility)
   *
   * This aliases console.log for internal use,
   * so that it can be intercepted for testing.
   */
  _println: console.log,
}
