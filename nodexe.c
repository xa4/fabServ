#include <stdlib.h>

int main () {
	system("/usr/local/bin/nodemon --watch /home/pi/Dev/fabServ /home/pi/Dev/fabServ/app.js 2>&1 >> /var/log/fabServ.log");

	return 0;
}
