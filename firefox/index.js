const PORT = 4851;

var serverSocket;

exports.main = function (options, callbacks) {
    var page = require('sdk/page-mod').PageMod({
        include: /(https?:\/\/)?vk.com\/.*/,
        contentScriptFile: './vk-audio-control.js'
    });

    const {Cc,Ci} = require('chrome');
    serverSocket = Cc['@mozilla.org/network/server-socket;1'].createInstance(Ci.nsIServerSocket);
    serverSocket.init(PORT, true, -1);
    serverSocket.asyncListen({
        onSocketAccepted: function (server, transport) {
            var inputStream = transport.openInputStream(0, 0, 0);
            var binaryInput = Cc['@mozilla.org/binaryinputstream;1'].createInstance(Ci.nsIBinaryInputStream);
            binaryInput.setInputStream(inputStream);

            var outputStream = transport.openOutputStream(0, 0, 0);
            var binaryOutput = Cc['@mozilla.org/binaryoutputstream;1'].createInstance(Ci.nsIBinaryOutputStream);
            binaryOutput.setOutputStream(outputStream);

            function wait() {inputStream.asyncWait(callback, 0, 0, Cc['@mozilla.org/thread-manager;1'].getService().mainThread)}

            var callback = {onInputStreamReady: function (stream) {
                try {
                    var action = binaryInput.readCString();
                    page.port.emit('player', action)
                } catch (e) {
                    console.log(e)
                }
            }};

            page.port.on('response', function(response) {
                binaryOutput.writeUtf8Z(response)
                wait();
            });

            wait();
        }
    });
};

exports.onUnload = function (reason) {
    serverSocket.close();
};
