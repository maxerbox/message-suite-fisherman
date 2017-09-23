# Message Suite - Fisherman

> Add some message features to fisherman. Copyrights (c), Simon Sassi 2017

## What is the message suite

The message suite is a fisherman middleware that is using the prototype editing available by fisherman
It edits the FisherResponse prototype to provide some cool features like:

- Bot Typing: send a message with a delay to simulate real user typing, with `response.send()`
- Embed compatibility: it checks if the bot can send embed, if it can't, it convert the embed to a formatted text

## Setting up

```bash
npm install --save command-loader-fisherman
```

Include the middleware to the bot:

```javascript
[...]
const MessageSuite = require("message-suite-fisherman")
var messageSuitePlugin = new MessageSuite({enableTyping: true, enableEmbedCompatibilityMode: true})
bot.use(messageSuitePlugin)
[...]
```

## Api docs

### new Messagesuite(opts)

Creates an instance of MessageSuite.

### MessageSuite constructor options

| Parameter name               | Description                                                                                                                       | Type     | Default value |
|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| enableTyping                 | Enable typing when it's a command and response.send() is used                                                                     | Boolean  | false         |
| defaultTypingCount           | Default typing count when no typing count is specified in the command's locales                                                   | Integer  | 1             |
| defaultTimeout               | Default timeout in MS to send the message after starting typing when no timeout is specified in the command's locales                   | Integer  | 1000          |
| enableEmbedCompatibilityMode | If it should enable the Compatibilty mode, it will send formatted text instead of an embed if the bot hasn't the perm EMBED_LINKS | Boolean  | true          |
| embedCompatibilityModeFormat | The function used to convert the embed to formatted text                                                                          | Function | defaultFormat |

### Setting the embedCompatibilityModeFormat options

This parameter is an option used to parse the embed.

The default value is a simple function who looks like this:

```javascript
  defaultFormat (embed) {
    var formatted = ''
    if (embed.title) formatted = formatted + '__' + embed.title + '__\n'
    if (embed.description) formatted = formatted + '\n' + embed.description + '\n'
    if (embed.fields) for (var i in embed.fields)formatted = formatted + '=> **' + embed.fields[i].name + '**\n ' + embed.fields[i].value + '\n'
    return formatted
  }
```

The `embed` parameter is an Object. This function has to return a string value

## Custom timeout and typing count in the command locales proprety

You can set as well the timeout and the typing count in the command's locales property:

Example with a timeout of `5s` and a typing count of `1`

```javascript
register.textCommand('test', {locales: {typingCount:1, typingTimeout:5000}}, function (req, res) {
  console.log("Command trigerred")
  var embed = {
    title: "a test",
    description: "Just a simple test",
    fields: [{name: "Cat title", value: "Guoi daziou duoaoauj dqiupou"},{name: "Cat title", value: "Guoi daziou duoaoauj dqiupou"}]
  }
  res.send("ok", {embed: embed})
})
```