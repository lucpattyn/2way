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

Then navigate to http://localhost:8000/fileupload.html in your web browser.
You should be able to upload a file in chunks through websocket if you specify the right ip address in the .js file.

