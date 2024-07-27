<p align="center">
  <img src="docs/logo.svg" width="128" height="128"/>
</p>

<h1 align="center">
  SE Blueprinter
</h1>

<p align="center">
  SE Blueprinter is an online tool to convert 3D models into Space Engineers blueprints.
</p>

<p align="center">
  Try it now at https://imivi.github.io/se-blueprinter
</p>


## Features

* Supports both cubes and sloped blocks (full list below)
* Choose between **large**/**small** grids, and **heavy**/**light** armor
* Make meshes **hollow**

## How to use

1. Upload your 3d model. The format must by **GLTF binary** (`.glb` extension). If you have an STL or another format you can use [Blender](https://www.blender.org/) to convert it to .glb
1. Pick between **large/small** grid, **heavy/light** armor, and **static/ship** grid.
1. Optionally, enter your player information
1. Create the blueprint preview. You can view the generated preview layer by layer.
1. Download the blueprint as a zip file. Unzip it and place the folder inside the SE blueprints folder. By default it's `C:/Users/<YOUR_USERNAME>/AppData/Roaming/SpaceEngineers/Blueprints/local/`

## Caveats & tips

Here's a few tips to achieve the best results using SE Blueprinter.

### Tip #1: apply transformations and modifiers

**Before exporting** your 3D model, make sure to:

* apply **rotation and scale** to all meshes! (in Blender: select meshes > `CTRL+A` > `Rotation & Scale`)
* apply **modifiers** to all meshes (in the Blender export dialog: `Data` > `Mesh` > `Apply Modifiers`)

!["Apply modifiers"](/docs/export_apply_modifiers.png)

### Tip #2: orient faces outward

SE Blueprinter relies on face normals (i.e. the direction that the faces are facing) to detect where blocks should go, so if the normals are wrong you may end up with missing blocks.

To fix this, make sure that all mesh faces are oriented outward. This is easy in Blender:

* Select the mesh
* Enter edit mode (tab)
* Show normals: in `Mesh edit mode`, click on the icon for `Display normals` and increase the `size` slider:

  !["Show face normals in Blender"](/docs/show_normals_arrows.png)

* Still in edit mode, select all faces (shortcut: `A`)
* hit `mesh` > `normals` > `recalculate outside`

  !["Recalculate normals"](/docs/recalculate_normals.png)

### Tip #3: simplify your meshes

Removing unnecessary faces, edges and vertices can improve both accuracy and performance.

1. Select a mesh
2. Enter edit mode (tab)
3. Select all faces (shortcut: `A`)
3. hit `mesh` > `delete` > `limited dissolve`

Compare before and after:

!["Limited dissolve"](/docs/dissolve_faces_before_after.png)

More info: https://docs.blender.org/manual/en/latest/modeling/meshes/editing/mesh/delete.html#limited-dissolve

### Tip #4: design your meshes as solids

For the best results, every mesh should be "watertight" or "solid", meaning that all mesh faces create a single continuous surface with no gaps or holes, thus the back of these faces is never visible from the outside. This kind of mesh is also called "manifold".

### Tip #5: 1 meter = 1 block

In Space Engineers, the size of a large block is 2.5m, and a small block is 0.5m. However, SE Blueprinter treats **1m as 1 block**, regardless of the grid size you pick.

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

### Add more blocks

1. Edit `src/blocks/block-names.csv` and add the names for the new blocks
2. run `npm run save-block-names` to convert the csv to json (src/blocks/block-names.json)
3. Edit `src/models/blocks.blend` adding the blocks in all orientations
4. Export to `public/cubes.glb`
5. Re-create the block signatures (steps below)

### Create block signatures

1. Run the webapp in debug mode: http://localhost:5173/se-blueprinter?debug=true
2. Load any example model
3. Select "slopes (fast)" scan mode
4. In the debug panel, click on `copy signatures`
5. Paste the signatures in `src/blocks/block-signatures-3x3x3.json`
6. Switch to "slopes (best)" scan mode
7. Again `copy signatures`
8. Paste the signatures in `src/blocks/block-signatures-4x4x4.json`