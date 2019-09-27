/* Event Handlers */
'use strict';


document.getElementById('iwidget').addEventListener('touchstart', function(e){
    if(e.touches.length > 1){
        return;
    }
    if (!tapped) {
        tapped = setTimeout(function () {
            tapped = null;
            showHideElement(appList, 'none');
        }, 300);
    } else {
        clearTimeout(tapped); //stop single tap callback
        tapped = null;
        showIconAddMenu();
    }
});



document.getElementById('appPicker').addEventListener('click', function (el) {
    var name = el.target.getAttribute('name');
    if (name === 'Edit') {
        var editButton = document.getElementById('EditText');
        if (editButton.innerHTML === 'Enable Edit') {
            editButton.innerHTML = 'Disable Edit';
            editMode = true;
            localStorage.removeItem('windisableedit');
            $(".appIcons").draggable({disabled: false});
        } else {
           editButton.innerHTML = 'Enable Edit';
           editMode = false;
           localStorage.windisableedit = true;
           $(".appIcons").draggable({disabled: true});
        }

    }else{
        document.getElementById('appPicker').innerHTML = '';
        document.getElementById('appPicker').style.display = 'none';
        createIcon(name);
    }
});

if(localStorage.windisableedit){
    setTimeout(function(){
        $(".appIcons").draggable({disabled: true});
    }, 1000);
}

document.getElementById('iwidget').addEventListener('touchend', function (el) {
    console.log(el.target.title);
    if (el.target.title == 'bg') {
        hideMenus();
    } else {
        if (!appMoving) {
            openApp(el.target.title);
        }
    }
}, false);
document.getElementById('notificationApps').addEventListener('touchstart', function (el) {
    openApp(el.target.title);
}, false);
document.getElementById('bottomTap').addEventListener('touchstart', function (el) {
    showTaskbar();
}, false);
document.getElementById('notifications').addEventListener('touchstart', function () {
    toggleDiv('notificationPanel', loadNotifiedApps, true);
}, false);
document.getElementById('switcher').addEventListener('touchend', function (el) {
    if(changeApps.changingIcon || changeApps.changeApp){

    }else{
        openApp(el.target.title);
    }
}, false);
document.getElementById('favApps').addEventListener('touchend', function (el) {
    if(changeApps.changingIcon || changeApps.changeApp){
        
    }else{
        openApp(el.target.title);
        document.getElementById('menu').style.display = 'none';
    }
}, false);
document.getElementById('bottomApps').addEventListener('touchstart', function (el) {
    console.log(el.target);
    if(el.target === 'allApps'){
        document.getElementById('menu').style.display = 'none';
    }
    whichBottomApp(el.target.title);
    toggleDiv('menu', undefined, false);
}, false);
document.getElementById('start').addEventListener('touchstart', function () {
    toggleDiv('menu', undefined, false);
    loadBackground();
});
document.getElementById('infoBar').addEventListener('touchstart', function () {
    toggleDiv('infoPanel', undefined, false);
    window.location = 'frontpage:updateMemory';
    //InfoStats.memoryPanel();
});
document.getElementById('timeDate').addEventListener('touchstart', function () {
    openApp(appBundles['clock']);
});


document.body.addEventListener('touchstart', function () {
    //hideDock();
});