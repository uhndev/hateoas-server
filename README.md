# DADOS #

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

$ sudo npm install sails@beta -g
$ sudo npm install -g bower
$ sudo npm install -g grunt-cli
```

## Install Dependencies
```
$ npm install ; bower install
```

## Running The Application
```
$ sails lift
```
Your application should run on the 1337 port so in your browser just go to [http://localhost:1337](http://localhost:1337)

## Environments
There are three environments available to run dados (defualt is development):
```
NODE_ENV=development sails lift
NODE_ENV=test sails lift
NODE_ENV=production sails lift
```
Each environment has a different associated database:
```
dados-dev => development
dados-test => test 
dados-prod => production
```

## Testing
Run ```grunt test``` to test (uses the test environment & database)

## Known Issues

#### uniquness not enforced for waterline adapters
[https://github.com/balderdashy/sails/issues/1831](https://github.com/balderdashy/sails/issues/1831)

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
