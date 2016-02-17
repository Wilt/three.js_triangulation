var urlParams = {};
var shapes = [];
var algorithms = [
    "original",
    "earclip",
    "poly2tri",
    "libtess"
];


loadShape = function( url, callback ){
    var XMLHttp = new XMLHttpRequest();

    XMLHttp.addEventListener("progress", onProgress);
    XMLHttp.addEventListener("load", onLoad );
    //XMLHttp.addEventListener("error", onError);
    //XMLHttp.addEventListener("abort", onAbort);
    XMLHttp.responseType = 'json';

    XMLHttp.open('GET', url, true);
    XMLHttp.send();

    function onLoad(){

        var data = this.response;

        var shape = createShape( data );

        callback( shape );

    }

};

/**
 * Load url params
 */
function loadUrlParams() {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query)){
        urlParams[decode(match[1])] = decode(match[2]);
    }
}

/**
 * @param data
 * @returns {THREE.Shape|*}
 */
function createShape( data ){

    var i, il, j, jl, points, shape, hole;

    points = [];

    for( i = 0, il = data.shape.length; i < il; i+=2 ){

        points.push( new THREE.Vector2( data.shape[i], data.shape[i+1]) );

    }

    shape = new THREE.Shape( points );

    for( i = 0, il = data.holes.length; i < il; i++ ){

        points = [];

        for( j = 0, jl = data.holes[i].length; j < jl; j+=2 ){

            points.push( new THREE.Vector2( data.holes[i][j], data.holes[i][j+1] ));

        }

        hole = new THREE.Path( points );

        shape.holes.push( hole );

    }

    return shape;

}

/**
 * Populate shape select list
 */
function populateShapeSelectList() {

    var url = 'shapes.json',
        XMLHttp = new XMLHttpRequest();

    XMLHttp.addEventListener('load', callback);

    XMLHttp.responseType = 'json';

    XMLHttp.open('GET', url, true);

    XMLHttp.send();

    function callback(){

        var div = document.getElementById('progress');

        div.style.display = 'none';

        var select = document.getElementById('shape_select');

        var shapes = this.response;

        for (var i = 0; i < shapes.length; i++) {

            var shape = shapes[i];

            var option = document.createElement('option');

            option.textContent = shape.name;

            option.value = i;

            if ('shape' in urlParams && option.value == urlParams['shape']) {

                option.selected = true;

                loadShape( shape.url, onLoad );

            }

            select.appendChild(option);

        }

    }

}

/**
 * On progress callback
 */
function onProgress( event ){

    var progress = document.getElementById( 'progress' );

    var percentage = Math.round( event.loaded / event.total * 100 );

    var progressText = "";

    if ( event.status !== "triangulating..." ) {

        progressText = "loading" + ' : ' + percentage + '%';

    }

    progress.textContent = progressText;

}