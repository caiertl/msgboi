import * as msgboi from './msgboi/main'
import * as logger from './msgboi/logger'
import * as config from './msgboi/config'

global.MsgboiError = require('./msgboi/error')

/* eslint-disable-next-line no-unused-vars */
exports.handler = async (event, context) => {
  let r = null

  try {
    r = await msgboi.handle(config, event.body)
  } catch (e) {
    r = e.content
  }

  if (r.code < 400) {
    logger.success(r.message)

    r.responses.forEach((r) => {
      if (r.code < 400) {
        logger.success(`notification to channel ${r.channel} succeded`)
      } else {
        logger.error(`notification to channel ${r.channel} failed with code ${r.code}`)
      }
    })
  } else {
    logger.error(r.message, r.error)
  }

  return {
    headers: { 'Content-Type': 'application/json' },
    isBase64Encoded: false,
    statusCode: r.code,
    body: null
  }
}
