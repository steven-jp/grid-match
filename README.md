# This React App allows the user to play a matching game based off of a grid.

The user drops an image and is prompted with a form asking for rows and columns.<br/>
They are then given a movable grid to clip the image and create cards. The cards are then<br/>
randomized and given to the user.<br/>

## TODO:

-Reduce the size of the carousel. Increased it for now to use but shouldn't have to scroll down to grab each card. When the size is reduced the svg viewbox inside of the card expands outside of the carousel container. When changed to fit the image inside the card container with 100% width/height, the viewbox will expand outside of the card container.<br/>
-Add merging cells. Just need to iterate through the column under 'BOTTOM'. if row deleted go down, if col deleted go right, if both then go rigtht/down.<br/>
-Increase size of image beyond actual size when image is dragged. Only goes to actual size.<br/>
-Add some bounds to avoid grid lines from going past there neighbors on drag.<br/>
-Update clipping hard error. If the lines are very close it crashes very rarely.<br/>
-Add unit test to ensure grid clips all the way up to 20x20.<br/>
-Add a scoring system.<br/>
-Game resets to same cards when all cards are matched. Lift cards/squares state up. This should also remove the bug where ocassionally the first card on a recreation matches fine but doesn't remove from array.<br/>
-Get rid of default grid size 3x3<br/>
-Maybe add OCR and google api to look up definition of columns/rows. <br/>
-Clean up code<br/>
