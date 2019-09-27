/* Helper Functions */
'use strict';

  /* Globals */
var appMoving = false, //state of icons (if they are moving)
    tapped = false, // state if widget is tapped (to detect dbl tap)
    appList = document.getElementById('appPicker'), //lists of apps
    infoPanel = document.getElementById('infoPanel'),
    menu = document.getElementById('menu'),
    ncPanel = document.getElementById('notificationPanel'),
    editMode = true;


/* Self Explained Helpers */

function clearinnerHTML(el) {
    el.innerHTML = '';
}

function showHideElement(el, style) {
    el.style.display = style;
}

/*
    Hide all menus
    hideMenus() hides all menus defined in the menus array
*/

var menusArray = ['menu', 'notificationPanel', 'infoPanel']; //menus that toggle

function hideMenus() {
    var i;
    for (i = 0; i < menusArray.length; i += 1) {
        document.getElementById(menusArray[i]).style.display = 'none';
    }
    //document.getElementById('appDrawerDiv').style.top = '738px'; //hide drawer
}

/*
    Creates dom elements with innerHTML and attribute
    type = 'li', 'div', etc
    innerHTML = text inside
    attribute = 'class', 'title', 'etc'
    attributeval = value of attribute
    Example: appList.appendChild(createDOMElement('li', 'test', 'title', 'testtitle'));
*/

function createDOMElement(type, innerHTML, attribute, attributeval) {
    var el = document.createElement(type);
    if (attributeval === 'Edit') {
        el.id = 'EditText';
        if (editMode) {
            innerHTML = 'Disable Edit';
        } else {
            innerHTML = 'Enable Edit';
        }

        if(localStorage.windisableedit){
            innerHTML = 'Enable Edit';
        }
    }
    el.innerHTML = innerHTML;
    el.setAttribute(attribute, attributeval);
    return el;
}

/* Show Icon menu
   Grabs all bundles from InfoStats2 and appends a dom element
*/

function showIconAddMenu() {
    var apps = FPI.apps.all, i, bundle, sel, name;
    clearinnerHTML(appList);
    showHideElement(appList, 'block');
    appList.appendChild(createDOMElement('li', 'Disable Edit', 'name', 'Edit'));

    for (i = 0; i < apps.length; i++) {
      bundle = apps[i].bundle;
      sel = FPI.bundle[bundle];
      name = sel.name;
      appList.appendChild(createDOMElement('li', name, 'name', bundle));
    }
}

/*
    Toggles divs display with option to load a function and/or hide menu
    Example: toggleDiv('notificationPanel', InfoStats.notifications, true);
*/

function toggleDiv(id, func, menu) {
    var d = document.getElementById(id);
    if (d.style.display === 'none') {
        d.style.display = 'block';
        if (func !== undefined) {
            console.log(func);
            func();
        }
    } else {
        d.style.display = 'none';
    }
    if (menu) {
        document.getElementById('menu').style.display = 'none';
    }
}

/*
    Battery Helper
    Takes width of element and decides how much it needs to travel per precent of battery
*/

function setBattery(battery, element, elwidth) {
    document.getElementById(element).style.width = Math.round((battery / 100) * elwidth) + 'px';
}


/*
    Detect which bottom app (in the start menu) is pressed and handle it.
*/

function whichBottomApp(app) {
    console.log(app);
    if (app === 'lock' || app === 'allApps') {
        if (app === 'lock') {
            window.location = 'frontpage:respring';
            //InfoStats.lockDevice();
            //InfoStats.addWidget();
        }
        if (app === 'allApps') {
            //InfoStats.triggerButton(drawer);
            FPI.drawer.toggleDrawer(null);
            //toggleDiv('menu', undefined, false);
        }
    } else {
        console.log(app);
        openApp(app);
    }
}

/*
    Creates Icons that are appended to desktop
*/
var desktopIcons = {};

function saveIconLocation(name, x, y) {
    desktopIcons[name] = {};
    desktopIcons[name].x = (x !== null) ? x : 0;
    desktopIcons[name].y = (y !== null) ? y : 0;
    localStorage.desktopIcons = JSON.stringify(desktopIcons);
}

function loadFromStorage() {
    var obj = JSON.parse(localStorage.desktopIcons);

    if (obj) {
        Object.keys(obj).forEach(function (key) {
            if (key !== null) {
                createIcon(key, obj[key].x, obj[key].y);
            }
        });
    }
}

function deleteDesktopObject(named) {
    delete desktopIcons[named];
    localStorage.desktopIcons = JSON.stringify(desktopIcons);
}

function createIcon(name, x, y) {
    console.log(name);
    var bundle = name, sel, name,
        holder = document.getElementById('appContainer'),
        li = document.createElement('li'),
        img = document.createElement('img'),
        div = document.createElement('div'),
        label = document.createElement('label'),
        xz = (x !== null) ? x : 0,
        yz = (y !== null) ? y : 40;

        //localstorage stores name.
        for (var i = 0; i < FPI.apps.all.length; i++) {
            if(FPI.apps.all[i].name === name){
                bundle = FPI.apps.all[i].bundle;
            }
        }

    sel = FPI.bundle[bundle];
    name = sel.name;
    li.className = 'appIcons';
    li.title = bundle;
    li.style.top = yz + 'px';
    li.style.left = xz + 'px';
    li.name = name;
    li.id = name;
    img.src = '/var/mobile/Library/FrontPageCache/' + bundle + '.png';
    label.innerHTML = name;
    li.appendChild(img);
    li.appendChild(div);
    li.appendChild(label);
    holder.appendChild(li);
    // what is created <li class="appIcons"><img src="src/images/test.png"/><div></div><label>25</label></li>
    saveIconLocation(name, xz, yz);



    //refresh draggable object
    $(".appIcons").draggable({
        stop: function (event, ui) {
            setTimeout(function () {
                appMoving = false;
            }, 200);
            if (document.getElementById(event.target.id)) {
                saveIconLocation(event.target.id, ui.position.left, ui.position.top);
            }
        },
        start: function (event, ui) {
            appMoving = true;
        },
        drag: function (event, ui) {
            if (ui.offset.top > window.innerHeight - 90) {
                $(event.target.title).trigger('mouseup');
                if (document.getElementById(event.target.title)) {
                    document.getElementById('appContainer').removeChild(document.getElementById(event.target.title));
                    deleteDesktopObject(event.target.id);
                }
                if (document.getElementById(event.target.id)) {
                    document.getElementById('appContainer').removeChild(document.getElementById(event.target.id));
                    deleteDesktopObject(event.target.id);
                }
            }
        }
    });
}

/* Show taskbar and auto hide */

function showTaskbar() {
    document.getElementById('bottomBar').style.display = 'block';
    setTimeout(function () {
        if (menu.style.display === 'block' || infoPanel.style.display === 'block' || appList.style.display === 'block' || ncPanel.style.display === 'block') {
            showTaskbar();
        } else {
            document.getElementById('bottomBar').style.display = 'none';
        }
    }, 6000);
}

//,#menu,#infoPanel,#notificationPanel,#appPicker
function setColors(color, startcolor) {
    var sheet = document.createElement('style');
        sheet.innerHTML = ".bottomBar, #menu, #infoPanel, #notificationPanel, #appPicker{background-color:" + color + ";}.startButton{background-color:" + startcolor +";}";
        document.body.appendChild(sheet);
}

var hideTaskbar = false;
var moveNotifications = false;
var disableMove = false;
var disableLabels = false;
var twentyfour = false;
var flipdate = false;
var barcolor = "black";
var menubutton = "black";

/* reading from Options.plist */
(function () {
    if (hideTaskbar) {
        setTimeout(function () {
            document.getElementById('bottomBar').style.display = 'none';
        }, 2000);
    }
    if (moveNotifications){
        document.getElementById('notifications').className = 'notifyBottom';
    }
    if (disableMove) {
        document.getElementById('iWidgetMain').addEventListener('touchmove', function (e) {
            if (e.target.id === 'iwidget' || e.target.id === 'infoBar' || e.target.id === 'switcher') {
                e.preventDefault();
            }
        });
    }
    if (disableLabels) {
        var sheet = document.createElement('style');
        sheet.innerHTML = ".appIcons label{opacity: 0;}";
        document.body.appendChild(sheet);
    }
    setColors(barcolor, menubutton);
    clock({
        twentyfour: twentyfour,
        padzero: false,
        refresh: 1000,
        success: function (clock) {
            document.getElementById('time').innerHTML = clock.hour() + ':' + clock.minute() + ' ' + clock.am();
            if (flipdate) {
                document.getElementById('date').innerHTML = clock.date() + '/' + (clock.month() + 1) + '/' + clock.year();
            } else {
                document.getElementById('date').innerHTML = (clock.month() + 1) + '/' + clock.date() + '/' + clock.year();
            }
        }
    });
}());