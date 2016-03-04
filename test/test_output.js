'use strict'
/* eslint-env node, mocha */
/* eslint-disable no-process-env */

const sinon = require('sinon')
const Output = require('../lib/output')
const Spinner = require('cli-spinner').Spinner
const ChildProcess = require('child_process')

describe('Output', function () {
  // -------------------------------------------------------------
  // Sinon sandbox setup/teardown
  // -------------------------------------------------------------

  let sinonbox = sinon.sandbox.create({
    useFakeTimers: false,
    useFakeServer: false
  })

  let stubSpinnerStart
  let stubSpinnerTitle
  let stubOutputSpawn
  let stubOutputPrintln

  beforeEach(function () {
    stubOutputPrintln = sinonbox.stub(Output, 'println')
    stubSpinnerStart = sinonbox.stub(Spinner.prototype, 'start')
    stubSpinnerTitle = sinonbox.stub(Spinner.prototype, 'setSpinnerTitle')
    stubOutputSpawn = sinonbox.stub(ChildProcess, 'spawn').returns({
      stdin: {
        write: sinonbox.stub(),
        end: sinonbox.stub()
      }
    })
  })

  afterEach(function () {
    sinonbox.restore()
  })

  // -------------------------------------------------------------
  // Tests
  // -------------------------------------------------------------

  it('should not display progress unless interactive', function () {
    process.stdout.isTTY = false
    Output.progress('test progress message')
    sinon.assert.notCalled(stubSpinnerTitle)
  })

  it('should only start spinning once', function () {
    process.stdout.isTTY = true
    let spinning = sinonbox.stub(Spinner.prototype, 'isSpinning')
    spinning.onCall(0).returns(false)
    spinning.returns(true)

    Output.progress('test progress message 1')
    Output.progress('test progress message 2')
    Output.progress('test progress message 3')

    sinon.assert.calledOnce(stubSpinnerStart)
  })

  it('should spawn a pager when interactive', function () {
    process.stdout.isTTY = true
    process.env.PAGER = 'pager'

    Output.data('test data')
    sinon.assert.called(stubOutputSpawn)
  })

  it('should not spawn a pager when PAGER isn\'t set', function () {
    process.stdout.isTTY = true
    delete process.env.PAGER

    Output.data('test data')
    sinon.assert.notCalled(stubOutputSpawn)
  })

  it('should print to stdout when PAGER isn\'t set', function () {
    process.stdout.isTTY = true
    delete process.env.PAGER

    Output.data('test data')
    sinon.assert.called(stubOutputPrintln)
  })

  it('should not spawn a pager when not interactive', function () {
    process.stdout.isTTY = false
    process.env.PAGER = 'pager'

    Output.data('test data')
    sinon.assert.notCalled(stubOutputSpawn)
  })

  it('should print to stdout when not interactive', function () {
    process.stdout.isTTY = false
    process.env.PAGER = 'pager'

    Output.data('test data')
    sinon.assert.called(stubOutputPrintln)
  })
})
