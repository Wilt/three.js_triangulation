'use strict';

var ShapeUtils = [];

var triangulateShape = THREE.ShapeUtils.triangulateShape;
var triangulate = THREE.ShapeUtils.triangulate;

function setShapeUtils( index ){

    THREE.ShapeUtils.triangulate = ShapeUtils[ index ].triangulate;
    THREE.ShapeUtils.triangulateShape = ShapeUtils[ index ].triangulateShape;

}

var tessy = (function initTesselator() {
    // function called for each vertex of tesselator output
    function vertexCallback(data, polyVertArray) {
        // console.log(data[0], data[1]);
        polyVertArray[polyVertArray.length] = data[0];
        polyVertArray[polyVertArray.length] = data[1];
    }
    function begincallback(type) {
        if (type !== libtess.primitiveType.GL_TRIANGLES) {
            console.log('expected TRIANGLES but got type: ' + type);
        }
    }
    function errorcallback(errno) {
        console.log('error callback');
        console.log('error number: ' + errno);
    }
    // callback for when segments intersect and must be split
    function combinecallback(coords, data, weight) {
        // console.log('combine callback');
        return [coords[0], coords[1], coords[2]];
    }
    function edgeCallback(flag) {
        // don't really care about the flag, but need no-strip/no-fan behavior
        // console.log('edge flag: ' + flag);
    }

    var tessy = new libtess.GluTesselator();
    // tessy.gluTessProperty(libtess.gluEnum.GLU_TESS_WINDING_RULE, libtess.windingRule.GLU_TESS_WINDING_POSITIVE);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, begincallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorcallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combinecallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);

    return tessy;
})();

ShapeUtils[0] = {

    triangulate: triangulate,

    triangulateShape: function ( contour, holes ) {

        var result;

        console.time("original");

        result = triangulateShape(contour, holes);

        console.timeEnd("original");

        return result;

    }

};

ShapeUtils[1] = {

    triangulateShape: function( contour, holes ){

        console.time("earcut");

        var i, il, dim = 2, array, points = contour;
        var holeIndices = [];
        var vertices = [];

        for( i = 0, il = holes.length; i < il; i++ ){

            holeIndices.push( points.length );

            points = points.concat( holes[i] );

        }

        for( i = 0, il = points.length; i < il; i++ ){

            vertices.push( points[i].x, points[i].y );

        }

        array = earcut( vertices, holeIndices, dim );

        var result = [];

        for ( i = 0, il = array.length; i < il; i += 3 ) {

            result.push( array.slice( i, i + 3 ) );

        }

        console.timeEnd("earcut");

        return result;

    }

};

ShapeUtils[2] = {

    triangulateShape: function (contour, holes) {

        console.time("poly2tri");

        var i, il, object, sweepContext, triangles;
        var pointMap = {}, count = 0;

        points = makePoints(contour);

        sweepContext = new poly2tri.SweepContext(points);

        for (i = 0, il = holes.length; i < il; i++) {

            points = makePoints(holes[i]);

            sweepContext.addHole(points);

            points = points.concat(points);

        }

        object = sweepContext.triangulate();

        triangles = object.triangles_;

        var a, b, c, points, result = [];

        for (i = 0, il = triangles.length; i < il; i++) {

            points = triangles[i].points_;

            a = pointMap[points[0].x + ',' + points[0].y];
            b = pointMap[points[1].x + ',' + points[1].y];
            c = pointMap[points[2].x + ',' + points[2].y];

            result.push([a, b, c]);
        }

        console.timeEnd("poly2tri");

        return result;

        function makePoints(a) {

            var i, il = a.length,
                points = [];
            for (i = 0; i < il; i++) {
                points.push(new poly2tri.Point(a[i].x, a[i].y));
                pointMap[a[i].x + ',' + a[i].y] = count;
                count++;
            }
            return points;
        }

    }

};

ShapeUtils[3] = {

    triangulateShape: function( contour, holes ) {

        console.time("libtess");

        var i, il, triangles = [];
        var pointMap = {}, count = 0;

        // libtess will take 3d verts and flatten to a plane for tesselation
        // since only doing 2d tesselation here, provide z=1 normal to skip
        // iterating over verts only to get the same answer.
        // comment out to test normal-generation code
        tessy.gluTessNormal(0, 0, 1);

        tessy.gluTessBeginPolygon( triangles );

        points = makePoints( contour );

        for( i = 0, il = holes.length; i < il; i++ ){

            points = makePoints( holes[i] );

        }

        tessy.gluTessEndPolygon();

        var a, b, c, points, result = [];

        for( i = 0, il = triangles.length; i < il; i+=6 ){

            a = pointMap[ triangles[i] + ',' + triangles[i+1] ];
            b = pointMap[ triangles[i+2] + ',' + triangles[i+3] ];
            c = pointMap[ triangles[i+4] + ',' + triangles[i+5] ];

            result.push([ a, b, c ]);
        }

        console.timeEnd("libtess");

        return result;

        function makePoints( a ) {

            var i, il = a.length,
                coordinates;

            tessy.gluTessBeginContour();

            for ( i = 0; i < il; i++ ) {
                coordinates = [ a[i].x, a[i].y, 0 ];
                tessy.gluTessVertex( coordinates, coordinates );
                pointMap[ a[i].x + ',' + a[i].y ] = count;
                count++;
            }

            tessy.gluTessEndContour();

            return points;

        }

    }

};