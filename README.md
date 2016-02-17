three.js - triangulation
========

#### Triangulation comparison ####

The aim of the project is to create compare the results of different triangulation/tesselation algorithms/libraries in three.js

— [original](https://github.com/mrdoob/three.js/blob/master/src/extras/ShapeUtils.js) - original algorithm from THREE.ShapeUtils<br>
— [earcut](https://github.com/mapbox/earcut) - earcut triangulation library<br>
— [poly2tri](https://github.com/r3mi/poly2tri.js) - poly2tri triangulation library<br>
— [libtess](https://github.com/brendankenny/libtess.js/) - libtess tesselation library<br>


### Viewers ###

For now there are two viewers.

- One [single screen viewer](single.html) where the triangulation result of a certain shape with a selected algorithm can be viewed.
- And [multiple screen viewer](multiple.html) where the triangulation result of a certain shape can be seen for all algorithms at the same time.


### Benchmarking ###

The next step will be to do some benchmarking of the different algorithms
