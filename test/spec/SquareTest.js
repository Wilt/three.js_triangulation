var tests = [
    {
        name: "square",
        shape: {
            contour: [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(100, 0),
                new THREE.Vector2(100, 100),
                new THREE.Vector2(0, 100)
            ],
            holes: []
        },
        expected: {
            original: [[ 3, 0, 1 ], [ 1, 2, 3 ]],
            earcut: [[ 2, 3, 0 ], [ 0, 1, 2 ]],
            poly2tri: [[ 3, 1, 2 ], [ 3, 0, 1 ]],
            libtess: [[ 1, 3, 0 ], [ 3, 1, 2 ]]
        }
    }
];

THREE.Triangulation.setTimer(true);

triangulateSquareTest();
//runEarcutTests();
//runPoly2TriTests();
//runLibtessTests();

function triangulateSquareTest() {

    var shape = tests[0].shape;
    var expected = tests[0].expected;

    describe('Triangulate square - ', function () {

        it('expects original library to triangulate correctly', function () {

            THREE.Triangulation.setLibrary('original');

            var result = THREE.ShapeUtils.triangulateShape(shape.contour, shape.holes);

            expect(result).toEqual(expected.original);

        });

        it('expects earcut library to triangulate correctly', function () {

            THREE.Triangulation.setLibrary('earcut');

            var result = THREE.ShapeUtils.triangulateShape(shape.contour, shape.holes);

            expect(result).toEqual(expected.earcut);

        });

        it('expects poly2tri library to triangulate correctly', function () {

            THREE.Triangulation.setLibrary('poly2tri');

            var result = THREE.ShapeUtils.triangulateShape(shape.contour, shape.holes);

            expect(result).toEqual(expected.poly2tri);

        });

        it('expects libtess library to triangulate correctly', function () {

            THREE.Triangulation.setLibrary('libtess');

            var result = THREE.ShapeUtils.triangulateShape(shape.contour, shape.holes);

            expect(result).toEqual(expected.libtess);

        });

    });

}