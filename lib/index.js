/* Copyright (C) MXB-SOFTWARE, Simon Sassi
 * Written by Simon Sassi, 2017-09-23 12:15:40
 */
const defaults = require('defaults')
class MessageSuite {
  /**
   * Creates an instance of MessageSuite.
   * @param {Object} opts
   * @param {boolean} opts.enableTyping Enable typing when command used
   * @param {integer} opts.defaultTypingCount Default typing count when no typing count is specified in the command's locales
   * @param {integer} opts.defaultTimeout Default timeout in MS to send the command after starting typing when no timeout is specified in the command's locales
   * @param {boolean} opts.enableEmbedCompatibilityMode If it should enable the Compatibilty mode, it will send formatted text instead of an embed
   * @param {function} opts.embedCompatibilityModeFormat The function used to convert the embed to formatted text
   * @memberof MessageSuite
   */
  constructor (opts) {
    this.opts = defaults(opts, {
      enableTyping: false,
      defaultTypingCount: 1,
      defaultTimeout: 1000,
      enableEmbedCompatibilityMode: true,
      embedCompatibilityModeFormat: this.defaultFormat
    })
  }
  setUp (client, next) {
    const opts = this.opts
    const user = client.client.user
    client.fisherRouterInstancer.getResponseInstancer().prototype.send = function (text, data) {
      var request = this.router.request
      var that = this
      if (typeof data === 'object' && data.embed && opts.enableEmbedCompatibilityMode) {
        if (request.channel.type === 'text') {
          var perms = request.channel.permissionsFor(user)
          if (!perms.has('EMBED_LINKS')) {
            text = opts.embedCompatibilityModeFormat(data.embed)
            data.embed = undefined
          }
        }
      }
      if (opts.enableTyping && request.isCommand) {
        var typingCount = request.command.locales.typingCount ? request.command.locales.typingCount : opts.defaultTypingCount
        var timeout = request.command.locales.typingTimeout ? request.command.locales.typingTimeout : opts.defaultTimeout
        return new Promise(function (resolve, reject) {
          that.router.request.channel.startTyping(typingCount)
          setTimeout(function () {
            that.router.request.channel.stopTyping()
            that.router.request.channel.send(text, data).then(resolve).catch(reject)
          }, timeout)
        })
      } else return this.router.request.channel.send(text, data)
    }

    next()
  }
  defaultFormat (embed) {
    var formatted = ''
    if (embed.title) formatted = formatted + '__' + embed.title + '__\n'
    if (embed.description) formatted = formatted + '\n' + embed.description + '\n'
    if (embed.fields) for (var i in embed.fields)formatted = formatted + '=> **' + embed.fields[i].name + '**\n ' + embed.fields[i].value + '\n'
    return formatted
  }
}
module.exports = MessageSuite
