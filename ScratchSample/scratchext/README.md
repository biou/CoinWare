# Scratchext

Scratchext is a framework for making Scratch 2.0 extensions in node.js.

## How do I use it?

Clone the scratchext repository into your project directory.

```sh
$ cd your/project/directory
$ git clone https://github.com/queryselector/scratchext
```

Create a manifest file called `extension.json`. This file contains information about the extension and its blocks.

```json
{
    "extensionName": "HelloWorld",
    "extensionPort": 12345,
    "blockSpecs": [
        [" ", "say hello", "greet"]
    ]
}
```

Then create `extension.js`, which contains the extension behavior.

```js
require('./scratchext/scratchext').create({
    blocks: {
        greet: function () {
            console.log('Hello, world!');
        }
    }
});
```

Run the extension with Node…

```sh
$ sudo node extension.js
```

…and import the extension into Scratch by shift-clicking the **File** menu, selecting **Import Experimental Extension**, and choosing `extension.json` in the file dialog.

![Shift-click File menu with 'Import Experimental Extension' highlighted"](http://scratch.mit.edu/internalapi/asset/0a21c83d286a59ad7f0408fd8296eb82.png/get/)

Your block will appear in the **More Blocks** category. Click it to say hello!

![Image of the 'say hello' block in the 'More Blocks' palette](http://scratch.mit.edu/internalapi/asset/65a2b074d530f905ccb840853d06842d.png/get/)

```sh
$ sudo node extension.js
Connected to Scratch as "HelloWorld", port 12345
Hello, world!
```

That's it! Check out the [wiki](https://github.com/queryselector/scratchext/wiki) for more tutorials and documentation.
