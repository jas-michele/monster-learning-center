# Dino Drag and Drop Placement Workflow

Use the Triceratops page as the quality bar for each dinosaur build scene.

1. Keep representative card art separate from drag/drop overlay art. Card art only needs to communicate the piece clearly inside the build card.
2. Choose the correct rendered part source before generating anything new. If the repo already has a crisp rendered part with the right anatomy, use that as the visual source instead of generating a new generic part.
3. Use the gray target silhouettes in the assembled skeleton image to understand the target pose, canvas, and placement. When a rendered source piece exists, clean its colored edge fringe and fit it into the matched overlay canvas. When no rendered source exists, generate a polished bronze part using the gray guide as the silhouette reference.
4. Save matched overlay pieces in a separate drag asset set, then wire `BuildPart.dragImage` to those files. Do not replace the representative button images with matched overlay pieces.
5. Use the placement debugger with `?placementDebug=<dinosaur>` to tune each piece:
   - `Placed` mode sets final `completedPartPlacements`.
   - `Popup` mode sets `stagingPartPlacements`.
   - Tune `x`, `y`, `widthVw`, `maxRem`, and `rotationDeg`.
6. Set `dropTargets` to the same `x` and `y` as the final placement center for each piece.
7. Set popup pieces to their final `widthVw`, `maxRem`, and `rotationDeg` so dragging only changes position. The piece should not resize or rotate when it lands.
8. Put popup pieces in a clear open staging area where they are fully visible and do not cover the dinosaur head, cards, avatar, or action buttons.
9. Validate in the browser, copy final debugger output back into config, then run the build check.
