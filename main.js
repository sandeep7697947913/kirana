const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

const path = require('path');
const url = require('url');

console.log('main is runnig is grets')
///to reload automaticalyy

'use strict';
 //this work only for html not for js
require('electron-reload')(__dirname);
//// to reload automaticalyy

let win1;

function createWindow(){
    win1 = new BrowserWindow({show:false});
    win1.loadURL(url.format({
       pathname : path.join(__dirname,"index.html"),
       protocol:'file',
       slashes:true
    }));
    win1.once('ready-to-show',()=>{
        win1.show();
    });

    win1.on('closed',()=>{
        win1 = null;
    });
}

app.on('ready',function(){
    createWindow();
    const template = [
        {
            label:"About",
            click : function(){
                let abtwin = new BrowserWindow({show:false});
                abtwin.loadURL(url.format({
                    pathname : path.join(__dirname,"about.html"),
                    protocol:'file',
                    slashes:true
                }));
                abtwin.once('ready-to-show',()=>{
                    abtwin.show();
                });
            }
        },
        {
            label:"Contact Us",
            click : function(){
                let abtwin = new BrowserWindow({show:false});
                abtwin.loadURL(url.format({
                    pathname : path.join(__dirname,"contact.html"),
                    protocol:'file',
                    slashes:true
                }));
                abtwin.once('ready-to-show',()=>{
                    abtwin.show();
                });
            }
        }
    ]
   const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});

app.on('window-all-closed',()=>{
   app.quit(); 
});