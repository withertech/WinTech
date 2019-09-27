var changeApps, loadSavedApps, basicArray;

changeApps = {
    target: null,
    changingIcon: false,
    changingApp: false,
    replaceAndSaveIcon: function(location) {
        loadSavedApps.appIcons[this.target.title] = location;
        var save = {
            appIcons: loadSavedApps.appIcons,
            defaultFavs: loadSavedApps.defaultFavs,
            defaultSwitcher: loadSavedApps.defaultSwitcher
        }
        localStorage.winApps = JSON.stringify(save);
        loadSavedApps.init();
    },
    replaceAndSaveApp: function(older, newer) {
        var array = loadSavedApps.defaultSwitcher,
            index = array.indexOf(older);
        if (index !== -1) {
            array[index] = newer;
        } else {
            array = loadSavedApps.defaultFavs,
                index = array.indexOf(older);
            if (index !== -1) {
                array[index] = newer;
            }
        }
        save = {
            appIcons: loadSavedApps.appIcons,
            defaultFavs: loadSavedApps.defaultFavs,
            defaultSwitcher: loadSavedApps.defaultSwitcher
        }
        localStorage.winApps = JSON.stringify(save);
        loadSavedApps.init();
    },
    showPopup: function(target) {
        this.changingIcon = true;
        this.changingApp = true;
        this.target = target;
        jPopup({
            type: "confirm",
            message: "Choose an option below",
            yesButtonText: "Set App",
            noButtonText: "Set Icon",
            functionOnNo: function() {
                this.changeIcon = true;
                window.location = 'frontpage:loadIconBrowser';
            },
            functionOnOk: function() {
                this.changeApp = true;
                FPI.drawer.toggleDrawer({
                    state: 'changingApp',
                    callback: function(newApp) {
                        changeApps.changingIcon = false;
                        changeApps.changingApp = false;
                        changeApps.replaceAndSaveApp(changeApps.target.title, newApp);
                    }
                });
            }
        });
    }
};

taphold({
    time: 400,
    element: document.getElementById('favApps'),
    action: function(target) {
        changeApps.showPopup(target);
    },
    passTarget: true
});

taphold({
    time: 400,
    element: document.getElementById('switcher'),
    action: function(target) {
        changeApps.showPopup(target);
    },
    passTarget: true
});



loadSavedApps = {
    appIcons: {

    },
    defaultFavs: ['com.apple.mobilephone', 'com.apple.MobileSMS', 'com.apple.mobilemail', 'com.apple.mobilesafari', 'com.apple.Preferences'],
    defaultSwitcher: ["com.saurik.Cydia", "com.apple.mobiletimer", "com.apple.camera", "com.apple.calculator"],
    favApps: document.getElementById('favApps'),
    switcherApps: document.getElementById('switcher'),
    loadFavs: function() {
        this.favApps.innerHTML = "";
        var bundle, icon, li, img, label, i;
        for (i = 0; i < this.defaultFavs.length; i++) {
            bundle = this.defaultFavs[i];
            icon = '/var/mobile/Library/FrontPageCache/' + bundle + '.png';
            if (loadSavedApps.appIcons[bundle]) {
                icon = loadSavedApps.appIcons[bundle];
            }
            li = document.createElement('li');
            li.title = bundle;
            img = document.createElement('img');
            img.src = icon;
            img.className = "notouch";
            li.appendChild(img);
            label = document.createElement('label');
            label.className = "notouch";
            if(FPI.bundle[bundle]){
                label.innerHTML = FPI.bundle[bundle].name;
            }else{
                label.innerHTML = "deleted";
            }
            li.appendChild(label);
            this.favApps.appendChild(li);
        }
    },
    loadSwitcher: function() {
        var bundle, icon, li, img, i;
        this.switcherApps.innerHTML = "";
        for (i = 0; i < this.defaultSwitcher.length; i++) {
            bundle = this.defaultSwitcher[i];
            icon = '/var/mobile/Library/FrontPageCache/' + bundle + '.png';
            if (loadSavedApps.appIcons[bundle]) {
                icon = loadSavedApps.appIcons[bundle];
            }
            li = document.createElement('li');
            li.title = bundle;
            img = document.createElement('img');
            img.setAttribute('title', bundle);
            img.src = icon;
            img.className = "notouch";
            li.appendChild(img);
            this.switcherApps.appendChild(li);
        }
    },
    init: function() {
        var storage = null;
        if (localStorage.winApps) {
            storage = JSON.parse(localStorage.winApps);
            if (storage.appIcons) {
                loadSavedApps.appIcons = storage.appIcons;
            }
            if (storage.defaultFavs) {
                loadSavedApps.defaultFavs = storage.defaultFavs;
            }
            if (storage.defaultSwitcher) {
                loadSavedApps.defaultSwitcher = storage.defaultSwitcher;
            }
        }
        this.loadSwitcher();
        this.loadFavs();
    }
};