
runGeneralTest();

function runGeneralTest() {

    describe('Triangulation - ', function () {

        it("expects adapter to throw an error when an unknown library is set", function () {

            expect(function(){ THREE.Triangulation.setLibrary('test') }).toThrow(new Error('ERROR: unknown library test'));

        });

    });

    describe('Triangulation - ', function () {

        it("expects adapter throw an error when the dependencies for a earcut are missing", function () {

            THREE.Triangulation.setLibrary('earcut');

            var earcut = window.earcut;

            window.earcut = undefined;

            expect(function(){ THREE.Triangulation.setLibrary('earcut') }).toThrow(new Error('ERROR: earcut not loaded'));

            window.earcut = earcut;

        });

        it("expects adapter throw an error when the dependencies for a earcut are missing", function () {

            THREE.Triangulation.setLibrary('earcut');

            var earcut = window.earcut;

            window.earcut = undefined;

            expect(function(){ THREE.Triangulation.setLibrary('earcut') }).toThrow(new Error('ERROR: earcut not loaded'));

            window.earcut = earcut;

        });

        it("expects adapter throw an error when the dependencies for a poly2tri are missing", function () {

            THREE.Triangulation.setLibrary('poly2tri');

            var poly2tri = window.poly2tri;

            window.poly2tri = undefined;

            expect(function(){ THREE.Triangulation.setLibrary('poly2tri') }).toThrow(new Error('ERROR: poly2tri not loaded'));

            window.poly2tri = poly2tri;

        });

        it("expects adapter throw an error when the dependencies for a libtess are missing", function () {

            THREE.Triangulation.setLibrary('libtess');

            var libtess = window.tessy;

            window.tessy = undefined;

            expect(function(){ THREE.Triangulation.setLibrary('libtess') }).toThrow(new Error('ERROR: libtess not loaded'));

            window.tessy = libtess;

        });

    });

}