<p align="center">
  <img src="docs/logo.svg" width="128" height="128"/>
</p>

<h1 align="center">SE Blueprinter</h1>

SE Blueprinter is an online tool to convert 3D models into Space Engineers blueprints.

## Features

* Supports both cubes and sloped blocks (full list below)
* Choose between **large**/**small** grids, and **heavy**/**light** armor
* Make meshes **hollow**

## How to use

1. Upload your 3d model. The format must by **GLTF binary** (`.glb` extension). If you have an STL or another format you can use [Blender](https://www.blender.org/) to convert it to .glb
1. Pick between **large/small** grid, **heavy/light** armor, and **static/ship** grid.
1. Optionally, enter your player information
1. Create blueprint preview. You can view the generated preview layer by layer.
1. Download the blueprint as a zip file. Unzip it and place the folder inside the SE blueprints folder. By default it's `C:/Users/<YOUR_USERNAME>/AppData/Roaming/SpaceEngineers/Blueprints/local/`

## Caveats & tips

When creating or modifying 3D models, keep in mind:

* make sure that all mesh faces are oriented outward. This is an easy fix in Blender: (in edit mode) Fix face normals in blender: (top left) show normals in edit mode (edit mode) mesh > normals > recalculate outside. SE Blueprinter relies on face normals (i.e. the direction that the faces are facing) to detect where blocks should go, so if the normals are wrong you may end up with missing blocks.

* for the best results, every mesh should be "watertight", meaning that all mesh faces create a single continuous surface with no gaps or holes, thus the back of these faces is never visible from the outside. This kind of mesh is also called "manifold".

* in Space Engineers, the size of a large block is 2.5m, and a small block is 0.5m. However, SE Blueprinter treats **1m as 1 block**, regardless of the grid size you pick.

**Before exporting** your 3D model, make sure to:

* apply **rotation and scale** to all meshes! (in Blender: select meshes > `CTRL+A` > `Rotation & Scale`)
* apply **modifiers** to all meshes (in the Blender export dialog: `Data` > `Mesh` > `Apply Modifiers`)

## FAQ

> The blueprint is missing some blocks / it has blocks that should not be there

* Make sure the face normals of the 3D model are facing outwards
* Try changing the raycast direction before generating the blueprint
* Try splitting the model into multiple meshes, as this can improve accuracy as well as performance

> Is this tool safe to use? Are my blueprints being uploaded somewhere?

SE Blueprinter runs entirely in your browser, so all your data stays private.

## Supported blocks

**Only armor blocks are supported**.

| Block                                                                 | Name                    | Supported? |
| --------------------------------------------------------------------- | ----------------------- | ---------- |
| ![block](public/blocks/block.png)                                     | block                   | ✔️         |
| ![slope](public/blocks/slope.png)                                     | slope                   | ✔️         |
| ![corner](public/blocks/corner.png)                                   | corner                  | ✔️         |
| ![inv_corner](public/blocks/inv_corner.png)                           | inv corner              | ✔️         |
| ![half](public/blocks/half.png)                                       | half                    | ✔️         |
| ![half_slope](public/blocks/half_slope.png)                           | half slope              | ✔️         |
| ![slope_211_base](public/blocks/slope_211_base.png)                   | slope 211 base          | ✔️         |
| ![slope_211_tip](public/blocks/slope_211_tip.png)                     | slope 211 tip           | ✔️         |
| ![inv_corner_211_base](public/blocks/inv_corner_211_base.png)         | inv corner 211 base     | ✔️         |
| ![inv_corner_211_tip](public/blocks/inv_corner_211_tip.png)           | inv corner 211 tip      | ✔️         |
| ![corner_211_base](public/blocks/corner_211_base.png)                 | corner 211 base         | ✔️         |
| ![corner_211_tip](public/blocks/corner_211_tip.png)                   | corner 211 tip          | ✔️         |
| ![corner_square](public/blocks/corner_square.png)                     | corner square           | ✔️         |
| ![corner_square_inv](public/blocks/corner_square_inv.png)             | corner square inv       | ✔️         |
| ![half_corner](public/blocks/half_corner.png)                         | half corner             | ✔️         |
| ![half_slope_corner](public/blocks/half_slope_corner.png)             | half slope corner       | ✔️         |
| ![half_slope_corner_inv](public/blocks/half_slope_corner_inv.png)     | half slope corner inv   | ✔️         |
| ![half_sloped_corner](public/blocks/half_sloped_corner.png)           | half sloped corner      | ✔️         |
| ![half_sloped_corner_base](public/blocks/half_sloped_corner_base.png) | half sloped corner base | ✔️         |
| ![half_slope_inv](public/blocks/half_slope_inv.png)                   | half slope inv          | ✔️         |
| ![sloped_corner](public/blocks/sloped_corner.png)                     | sloped corner           | 🚧 to be added         |
| ![sloped_corner_base](public/blocks/sloped_corner_base.png)           | sloped corner base      | 🚧 to be added         |
| ![sloped_corner_tip](public/blocks/sloped_corner_tip.png)             | sloped corner tip       | 🚧 to be added         |
| ![round_slope](public/blocks/round_slope.png)                         | round slope             | ❌         |
| ![round_corner](public/blocks/round_corner.png)                       | round corner            | ❌         |
| ![round_inv_corner](public/blocks/round_inv_corner.png)               | round inv corner        | ❌         |

## Acknowledgements

* [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) for improving raycasting performance
* https://polyhaven.com/a/pizzo_pernice_puresky for the background environment map

## For developers

Before distributing the webapp, do these steps:

**Create block signatures**

* Run the webapp in debug mode: http://localhost:5173/?debug=true
* Open the console
* copy the block signature logged in the console (right click -> Copy Object)
* open `src/blocks/block-signatures.json`
* replace the file content by pasting the copied data

**Create block names**

* Edit `src/blocks/block-names.csv` and add all the blocks you want
* run `pnpm prebuild` to convert the csv to json (src/blocks/block-names.json)