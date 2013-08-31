var fs = require('fs');
var net = require('net');

exports.create = function (config) {
    function update() {
        var response = {
            method: 'update',
            params: updates
        };
        var data = JSON.stringify(response) + '\n';
        sockets.forEach(function (socket) {
            socket.write(data);
        });
        updates = [];
    }

    if (!config) config = {};
    if (!config.blocks) config.blocks = {};

    var sockets = [];
    var updates = [];
    var vars = {};
    var ext = {
        trigger: function (event) {},
        set: function (name, value) {
            if (typeof name !== 'string') return;
            updates.push([name, value]);
            vars[name] = value;
            update();
        },
        get: function (name) {
            return vars[name];
        },
        declare: function (name) {
            Object.defineProperty(ext.vars, name, {
                set: function (value) {
                    ext.set(name, value);
                },
                get: function () {
                    return ext.get(name);
                }
            });
        },
        blocks: {},
        vars: {}
    };

    var manifest = JSON.parse(fs.readFileSync(config.manifest || 'extension.json'));
    var port = manifest.extensionPort;

    var blocks = manifest.blockSpecs;
    if (blocks instanceof Array) {
        blocks.forEach(function (block) {
            if (!(block instanceof Array) || block.length < 3) return;
            if (block[0] === 'r' || block[0] === 'b') {
                ext.declare(block[2]);
            }
        });
    }

    var blocks = config.blocks;
    if (blocks) {
        for (var selector in blocks) if (Object.hasOwnProperty.call(blocks, selector)) {
            (function (selector, block) {
                ext.blocks[selector] = function () {
                    return block.call(ext, arguments);
                };
            }(selector, blocks[selector]));
        }
    }

    var policyFile = [
        '<?xml version="1.0"?>',
        '<!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">',
        '<cross-domain-policy>',
        '    <allow-access-from domain="*.scratch.mit.edu" to-ports="*"/>',
        '    <allow-access-from domain="*.media.mit.edu" to-ports="*"/>',
        '</cross-domain-policy>'
    ].join('\n');

    var server = net.createServer(function (socket) {
        function init() {
            var list = [];
            for (var name in vars) if (Object.hasOwnProperty.call(vars, name)) {
                list.push([name, vars[name]]);
            }
            var response = {
                method: 'update',
                params: list
            };
            socket.write(JSON.stringify(response) + '\n');
        }
        console.log('Connected to Scratch as "%s", port %d', manifest.extensionName, port);
        if (config.onInit && typeof config.onInit === 'function') {
            config.onInit();
        }
        sockets.push(socket);
        init();
        socket.on('close', function (e) {
            console.log('Disconnected from Scratch');
            var i = sockets.indexOf(socket);
            if (i !== -1) sockets.splice(i, 1);
        });
        socket.on('data', function (data) {
            if (data.toString() === '<policy-file-request/>\0') {
                socket.end(policyFile + '\0');
                return;
            }
            ('' + data).split('\n').forEach(function (line) {
                if (!line) return;
                try {
                    var p = JSON.parse(line);
                } catch (e) {
                    console.log('Unknown packet %s', line);
                    return;
                }
                if (!p) return;
                if (p.method === 'poll') {
                } else if (config.blocks[p.method]) {
                    config.blocks[p.method].apply(ext, p.params);
                }
            });
        });
    });
    server.listen(port);

    var policyServer = net.createServer(function (socket) {
        socket.on('data', function (data) {
            if (data.toString() === '<policy-file-request/>\0') {
                socket.end(policyFile + '\0');
            }
        });
    });
    policyServer.once('error', function (err) {
        if (err.code == 'EADDRINUSE') {
            console.warn('Could not listen on port 843. This is either because you have another extension running, or you did not use `sudo node`.');
        }
    })
    policyServer.listen(843);

    return ext;
};
