# This React App allows the user to play a matching game based off of a grid.

The user drops an image and is prompted with a form asking for rows and columns.
They are then given a movable grid to clip the image and create cards. The cards are then
randomized and given to the user.

## TODO:

-Reduce the size of the carousel. Increased it for now to use but shouldn't have to scroll down to grab each card. When the size is reduced the svg viewbox inside of the card expands outside of the carousel container. When changed to fit the image inside the card container with 100% width/height, the viewbox will expand outside of the card container.
-Add merging cells. Just need to iterate through the column under 'BOTTOM'. if row deleted go down, if col deleted go right, if both then go rigtht/down.
-Increase size of image beyond actual size when image is dragged. Only goes to actual size.
-Remove warning for grid/clipgrid callback rendering.
-When a card is dragged and let go the carousel thinks the card is still being held. This makes the carousel move side to side following the cursor..
-Add some bounds to avoid grid lines from going past there neighbors on drag.
-Update clipping hard error. If the lines are very close it crashes very rarely.
-Add unit test to ensure grid clips all the way up to 20x20.
-Add a scoring system.
-Game resets to same cards when all cards are matched. Lift cards/squares state up. This should also remove the bug where ocassionally the first card on a recreation matches fine but doesn't remove from array.
-Get rid of default grid size 3x3
-Clean up code
