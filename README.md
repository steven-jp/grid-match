# This React App allows the user to play a matching game based off of a grid.

The user drops an image and is prompted with a form asking for rows and columns.<br/>
They are then given a movable grid to clip the image and create cards. The cards are then<br/>
randomized and given to the user.<br/>

<img src="/gifs/image-drop.gif" alt="Dropping of image" width="70%"> <br/>
<img src="/gifs/grid-clip.gif" alt="Clipping of grid" width="70%"> <br/>
<img src="/gifs/card-match.gif" alt="Matching Card" width="70%"> <br/>

## TODO:

-Increase size of image beyond actual size when image is dragged. Only goes to actual size.<br/>
-scale cards and squares when browser is resized. To do so we'd create a new method that takes existing coords and scales it. Each coord will have a value called scale which will pertain to what the image size was. We then get the coords in terms of the current image size.<br/>
-Add some bounds to avoid grid lines from going past there neighbors on drag.<br/>
-Update clipping hard error. If the lines are very close it crashes very rarely.<br/>
-Add unit test to ensure grid clips all the way up to 20x20.<br/>
-Game resets to same cards when all cards are matched. Lift cards/squares state up. This should also remove the bug where ocassionally the first card on a recreation matches fine but doesn't remove from array. It will also remove cards rerendering when browser is resized.<br/>
-Maybe add OCR and google api to look up definition of columns/rows. <br/>
-Add animation to buttons. <br/>
-Add browse button for image or ability to use URL. <br/>
-Clean up code<br/>
