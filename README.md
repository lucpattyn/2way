# simple-libwebsockets-example

A simple libwebsockets example for file transfering through socket.

This is based on https://github.com/iamscottmoyers/simple-libwebscokets-example/

## Build
```bash
make
```

## Run
In one terminal run:
```bash
./server
```

## Dependencies 
After installing build-essentials, gcc/g++ compiler and cmake,
do:

```bash
sudo apt-get install libwebsockets-dev
sudo apt-get install pkg-config
```

For Mac you may need to do or similar after installing the dependencies:

export CPATH="/usr/local/opt/openssl/include:/usr/local/opt/gettext/include"
export LIBRARY_PATH="/usr/local/opt/openssl/lib:/usr/local/opt/gettext/lib"

Then navigate to http://localhost:8000/fileupload.html in your web browser.
You should be able to upload a file in chunks through websocket if you specify the right ip address in the .js file.

