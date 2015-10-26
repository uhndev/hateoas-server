dados-server
============
DADOS is a single software platform for electronically collecting and managing data related to treatment outcomes. The application has been implemented within various clinics and departments at UHN to handle prospective clinical trials and subspecialty registries. Initially created by integrating and enhancing two open-source Web-based applications developed by Duke University, DADOS-Prospective and DADOS-Survey, the DADOS platform is currently developed, maintained, and supported by the Techna Institute for use within UHN and other research institutions across the world. New features to improve usability and expand its applicability in the field of translational and clinical research are continually developed and enhanced.

A *tentative* API reference can be found here:
[http://docs.dados.apiary.io](http://docs.dados.apiary.io/)

## Installing Node without Administrative Rights

There are 2 parts of the NODEJS Windows installer. 

1. Download the **node.exe** binary into a local folder.
  a. [32-bit](http://nodejs.org/dist/latest)
  b. [64-bit](http://nodejs.org/dist/latest/x64)
2. Add your local folder to your PATH Environment. 
3. Download the [NPM **zip**](http://nodejs.org/dist/npm/).
4. Extract the **.zip** to a local folder.
5. Add the local folder into the PATH Environment.

## Installing Prerequisites
```
$ sudo apt-get install nodejs
$ sudo apt-get install npm
$ sudo apt-get install mongodb
$ sudo apt-get install redis-server // can use mongo as a session store alternatively

$ sudo npm install -g sails
$ sudo npm install -g bower
$ sudo npm install -g grunt-cli
```

## Install Dependencies
```
$ npm install
```

## Running The Application
```
$ sails lift
```
Your application should run on the 1337 port so in your browser just go to [http://localhost:1337](http://localhost:1337)

## Testing
Run ```grunt test``` to test (uses the test environment & database)

## Troubleshooting

#### grunt errors
Depending on your setup, when you run sails you may encounter any of these errors:
```
Waiting ... Fatal error: watch ENOSPC
Error: Maximum call stack size exceeded
```
To resolve this, make sure that your version of grunt-contrib-watch is at least 0.6.0 in your package.json
and if all else fails, increase the number of files that can be watched via the command:
```
$ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

#### bcrypt errors
If you are having trouble installing bcrypt, make sure you have installed the node-gyp package and its dependencies globally:
```
$ sudo apt-get install libssl-dev
$ sudo apt-get install build-essential
$ sudo npm install -g node-gyp
```

##### Windows Users
1. install Python http://www.python.org/download/releases/2.7.5/
2. Install Visual Studio 2012/13 Express (or other)
3. Install Windows SDK (for Windows 7 / 8)
4. Install Win64 OpenSSL v1.0.1g
5. Then run `npm install bcrypt`

[Source](http://stackoverflow.com/questions/14573488/error-compiling-bcrypt-node-js)

#### npm errors
If during the prerequisite installation phase you find that npm keeps failing to install packages, cleaning the npm cache may be of use:
```
$ npm cache clean
```
However if all else fails, a fresh start may be required **(NOTE the following will completely uninstall node and all global npm packages)**
```
sudo apt-get remove nodejs
sudo apt-get remove npm
sudo apt-get autoremove
rm -Rf ~/.npm
rm -Rf /usr/local/lib/node_modules
rm -Rf /usr/local/lib/node
rm -Rf /usr/local/lib/npm
rm -Rf $HOME/tmp
```
## Manual Patching ##

Searching non-string values does not work with Blueprint routing. Until the fix is release, one must manually patch Sails. Use the fix outlined at the following [link](https://github.com/pAlpha627/sails/commit/8090603f387b303f636a2570c665e1ae40164d79).

Copy the changes to `node_modules/sails/lib/hooks/blueprints/actionUtils.js#tryToParseJSON`.

## License ##
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
