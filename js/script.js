ymaps.ready(init);
var map = document.getElementById("map");
var select = document.getElementById("currentUser");
var myMap, 
    myPlacemark,
    anotherPlacemark;
var width = document.documentElement.clientWidth;
var opened = false;
var photoOpened = true;
var rootRef = firebase.database().ref();
var firstName;

function Point(name, worker, code, lat, lng){
    this.name = name;
    this.worker = worker;
    this.code = code;
    this.lat = lat;
    this.lng = lng;
}

var currentPoints = [];

function init(){
    map.textContent = ' ';
    $(".cssload-loader").removeClass("cssload-loader");
    myMap = new ymaps.Map("map", {
        center: [43.118366, 131.8857],
        zoom: 13
    }); 

    $("#close-icon").click(function(){
             $("#info").animate({left: width + 10});
             opened = false;
     });
    $("#photo-toggle").click(function(){
        togglePhoto();
    });
    togglePhoto();
}

function togglePhoto(){
        if (photoOpened){
            $(".photo-container").slideUp();
            $(".comment-section").animate({height: "+=160px"}, 400);
            photoOpened = false;
        } else {
            $(".comment-section").animate({height: "-=160px"}, 400);
            $(".photo-container").slideDown();
            photoOpened = true;
        }
        $("#photo-toggle").toggleClass("fa-sort-asc fa-sort-desc");
     
}

function selectChange(sel){
    if(sel.value === 'edurnova'){
        myMap.geoObjects.removeAll();
        addPoints("Екатерина Дурнова");
    }
    if(sel.value === 'akunitskiy'){
        myMap.geoObjects.removeAll();
        myMap.geoObjects.add(myPlacemark);
    }
}

function addPoints(worker){
        rootRef.child(worker).once("value").then(function(snapshot){
            snapshot.forEach(function(childSnapshot){
                var point = new Point(childSnapshot.child("name").val(), worker, childSnapshot.key, childSnapshot.child("coords").child("lat").val(), childSnapshot.child("coords").child("lng").val());
                currentPoints.push(point);
            });
            
    for(let i = 0; i < 8; i++){
        var tmpmark = new ymaps.Placemark([currentPoints[i].lat, currentPoints[i].lng], {hintContent: currentPoints[i].name});
        tmpmark.events.add('click', function(){
            toggleMenu(currentPoints[i].name, currentPoints[i].code, currentPoints[i].worker);
        })
        console.log(currentPoints[i].lng);
        myMap.geoObjects.add(tmpmark); 
    }
        }
    );
}

function updateMenu(name, code, worker){
    $("#info-name").text(name);
    $("#workerName").text(worker);
    $("#codeOfPoint").text(code);
}

function toggleMenu(name, code, worker){
    if (opened){
        $("#info").animate({left: width + 10});
        opened = false;
    } else {
        updateMenu(name, code, worker);
        $("#info").animate({left: width - 580});
        opened = true;
    }
}