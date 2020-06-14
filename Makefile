all: server client

server: server.c
	export CPATH="/usr/local/opt/openssl/include:/usr/local/opt/gettext/include"
	export LIBRARY_PATH="/usr/local/opt/openssl/lib:/usr/local/opt/gettext/lib"
	gcc -g -Wall $< -o $@ `pkg-config libwebsockets --libs --cflags`
client: client.c
	gcc -g -Wall $< -o $@ `pkg-config libwebsockets --libs --cflags`

clean:
	rm -f server
	rm -rf server.dSYM
	rm -f client
	rm -rf client.dSYM
