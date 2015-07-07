//Functions

const scale = 1000000000;

function point(centreX, centreY, label) {
  // Allows creating a point with a centre and a label.
  // reduces var A = {cx:80, cy:160, label:"A"}; to A = new point( 80, 160, "A");
  // Some debate about this method: Ideally, it would not 'draw' a circle
  // Also, it's more convenient to write A.cx instead of A.attr("cx")

  myPoint = drawing.append("circle")
  .classed('point', true)
  .style("stroke", "none")
  .style("fill", "none")
  .attr("r", 0)
  .attr("cx", parseInt(centreX))
  .attr("cy", parseInt(centreY))
  .attr("label", label)


  return myPoint
}


function pointArray(centreX, centreY, label, array) {
  // Allows creating a point with a centre and a label.
  // An alternate version which adds the point to an already-defined array (such as var pointsArray = [ ]; )
  // reduces var A = {cx:80, cy:160, label:"A"}; to A = new point( 80, 160, "A");
  this.cx = centreX;
  this.cy = centreY;
  this.label = label;
  array.push(this);
}

function lineFromTwoPoints( A, B, strokeWidth, colour ) {
  if (typeof colour == 'undefined'){
    colour = "rgba(0,0,50,1)";
  }
  if (typeof strokeWidth == 'undefined'){
    strokeWidth = 1;
  }

  var myLine = drawing.append("svg:line")
  //x to the left
  .attr("x1", A.attr("cx"))
  .attr("y1", A.attr("cy"))
  .attr("x2", B.attr("cx"))
  .attr("y2", B.attr("cy"))
  .attr("stroke-width", strokeWidth)
  .style("stroke", colour);

  return myLine;
}

function extrapolateThirdPointFromTwoPointsRough (pointA, pointB, distance){
  lineLength = Math.sqrt(Math.pow((pointB.attr("cx") - pointA.attr("cx")), 2) + Math.pow((pointB.attr("cy") - pointA.attr("cy")), 2));
  console.log(lineLength);

  extrapolatedPoint = new point((pointA.attr("cx") + (pointB.attr("cx") - pointA.attr("cx")) * (lineLength + distance) / lineLength), (pointA.attr("cy") + (pointB.attr("cy") - pointA.attr("cy")) * (lineLength + distance) / lineLength));
  return extrapolatedPoint;
}

function extrapolateThirdPointFromTwoPoints (pointA, pointB, distance){
//  var scale = 1000000000;

  lineLengthScaled = Math.sqrt(
    Math.pow(
      ((pointB.attr("cx") * scale) - (pointA.attr("cx") * scale)), 2)
    + Math.pow(
      ((pointB.attr("cy") * scale) - (pointA.attr("cy") * scale)), 2)
  );

  if (typeof distance == 'undefined'){
    distance = lineLengthScaled / scale;
  }

  extrapolatedPointScaled = new point(
    Math.round(
      (pointA.attr("cx") *scale) + ((pointB.attr("cx") *scale) - (pointA.attr("cx") *scale))
      * (lineLengthScaled + (distance *scale))
      / lineLengthScaled
    ) / scale,
    Math.round(
      (pointA.attr("cy") *scale) + ((pointB.attr("cy") * scale) - (pointA.attr("cy") *scale))
      * (lineLengthScaled + (distance * scale))
      / lineLengthScaled
    ) / scale
  , "ExtrapolatedPoint");

  return extrapolatedPointScaled;
}


function circle(point, radius, colour){
  // Simply draws a circle. Returns an object such as "circle1 = new circle(A, 50)"
  if (typeof colour == 'undefined'){
    colour = "black";
  }
  myCircle = drawing.append("circle")
  .style("stroke", colour)
  .style("fill", "none")
  .attr("r", radius)
  .attr("cx", point.attr("cx"))
  .attr("cy", point.attr("cy"))
  .attr("label", point.attr("label"))

  return myCircle;
}

function circleFilled (point, radius, colour){
  // Simply draws a circle. Does not create variables such as "circle1 = new circle(A, 50)"

  if (typeof colour == 'undefined'){
    colour = "black";
  }
  myFilledCircle = drawing.append("circle")
  .style("stroke", "none")
  .style("fill", colour)
  .attr("r", radius)
  .attr("cx", point.attr("cx"))
  .attr("cy", point.attr("cy"))
  .attr("label", point.attr("label"));

  return myFilledCircle;
}

function labelAPoint (point, label){
  if (typeof label == 'undefined'){
    label = point.attr("label");
  }

  myLabel = drawing.append("text")
	.attr("x", parseInt(point.attr("cx")) + parseInt(point.attr("r")))
	.attr("y", parseInt(point.attr("cy")) - parseInt(point.attr("r")))
	.text(label);

  return myLabel;
}

function pointsOnACircle (whichpoint, numberOfPoints, cx, cy, radius) {
  //Returns a point along the outside of a circle, starting at (whichpoint=1) = 0 degress
  //Could be simpler, but ran in to problems when debugging: Adding all points to an array filled the array with a single point
  //Edited to introduce a scale, which should help with rounding errors

  //Normally used with:
  //       for (var i = 1; i < (numberOfPoints+1); i++) {
  //           pointsOnACircleArray[pointsOnACircleArray.length] = new pointsOnACircle (i, numberOfPoints, cx, cy, radius);
  //       }
  eachpoint = whichpoint * 2 * Math.PI /numberOfPoints;

  //var thisPoint = new point (cx + (radius * Math.sin(eachpoint)), cy - (radius * Math.cos(eachpoint)))
  // ^ without scaling
//  var scale = 1000000000; //defined globally
  var eachpoint = (whichpoint * 2 * Math.PI /numberOfPoints);
  //We don't want to scale eachpoint

  var cxScaled = cx * scale;
  var cyScaled = cy * scale;
  var radiusScaled = radius * scale;

  var thisPointScaled = new point (Math.round(cxScaled + (radiusScaled * Math.sin(eachpoint))) / scale, Math.round(cyScaled - (radiusScaled * Math.cos(eachpoint))) /scale);
  return thisPointScaled;

}


function findWhereTwoCirclesInteract(CircleA, CircleB) {
  // There was a quite a bit of precision missing here due to double-float rounding errors: it's even obvious at 100% scale
  // Fixed by doing all math with a scale of 1,000,000,000

  // function intersection(x0, y0, r0, x1, y1, r1) {

  //                 x0 = CircleA.attr("cx")
  //                 y0 = CircleA.attr("cy")
  //                 r0 = CircleA.attr("r")


  //                 x1 = CircleB.attr("cx")
  //                 y1 = CircleB.attr("cy")
  //                 r1 = CircleB.attr("r")

  var a, dx, dy, d, h, rx, ry;
  var x2, y2;
//   var scale = 1000000000/1; //defined globally

  // dx and dy are the vertical and horizontal distances between
  // the circle centers.

  dx = (CircleB.attr("cx") * scale) - (CircleA.attr("cx") * scale);
  dy = (CircleB.attr("cy") * scale) - (CircleA.attr("cy") * scale);

  /* Determine the straight-line distance between the centers. */
  d = Math.sqrt((dy*dy) + (dx*dx));

  /* Check for solvability. */
  if (d > ((CircleA.attr("r") * scale) + (CircleB.attr("r") * scale))) {
    /* no solution. circles do not intersect. */
    console.log("no solution. circles do not intersect.");
    return false;
  }
  if (d < Math.abs((CircleA.attr("r") * scale) - (CircleB.attr("r") * scale))) {
    /* no solution. one circle is contained in the other */
    console.log("no solution. one circle is contained in the other.");
    return false;
  }

  //      'point 2' is the point where the line through the circle
  //      intersection points crosses the line between the circle
  //      centers.


  /* Determine the distance from point 0 to point 2. */
  a = (((CircleA.attr("r") * scale) * (CircleA.attr("r") * scale)) - ((CircleB.attr("r") * scale) * (CircleB.attr("r") * scale)) + (d*d)) / (2.0 * d) ;

  /* Determine the coordinates of point 2. */
  x2 = (CircleA.attr("cx") * scale) + (dx * a/d);
  y2 = (CircleA.attr("cy") * scale) + (dy * a/d);

  //                 Determine the distance from point 2 to either of the
  //                 intersection points.

  h = Math.sqrt(((CircleA.attr("r") * scale) * (CircleA.attr("r") * scale)) - (a*a));

  /* Now determine the offsets of the intersection points from
         * point 2.
         */
  rx = -dy * (h/d);
  ry = dx * (h/d);

  /* Determine the absolute intersection points. */
  var xi = Math.round((x2 + rx)) /scale;
  var xi_prime = Math.round(x2 - rx) /scale;
  var yi = Math.round(y2 + ry) /scale;
  var yi_prime = Math.round(y2 - ry) /scale;

  var point1 = new point(xi, yi);
  var point2 = new point(xi_prime, yi_prime);

  //                 return [xi, xi_prime, yi, yi_prime];
  return [ point1, point2 ]; //In the case of a single point, it will return two points that are the same. This needs some logic somewhere


}

function polyFromPoints (arrayOfPolyPoints, colour) {
  //Takes an array of points, and creates a closed polygon that joins them (in order)
  if (typeof colour == 'undefined'){
    colour = "black";
  }
  var myPoly = drawing.selectAll("drawing")
  .data([arrayOfPolyPoints])
  .enter().append("polygon")
  .attr("points",function(d) {
    return d.map(function(d) {
      return [d.attr("cx"), d.attr("cy")].join(",");
    }).join(" ");
  })
  .attr("stroke", colour)
  .attr("stroke-width",.5)
  .attr("fill", "none");

  return myPoly;
}

function polyFromPointsFilled (arrayOfPolyPointsToFill, colour) {
  //Takes an array of points, and creates a closed polygon that joins them (in order)
  if (typeof colour == 'undefined'){
    colour = "black";
  }
  filledPoly = drawing.selectAll("drawing")
  .data([arrayOfPolyPointsToFill])
  .enter().append("polygon")
  .attr("points",function(d) {
    return d.map(function(d) {
      return [d.attr("cx"), d.attr("cy")].join(",");
    }).join(" ");
  })
  .attr("stroke","none")
  .attr("stroke-width", .5)
  .attr("fill", colour);

  return filledPoly;
}


function hexToRgb(hex, alpha) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var toString = function () {
    if (this.alpha == undefined) {
      return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
    }
    if (this.alpha > 1) {
      this.alpha = 1;
    } else if (this.alpha < 0) {
      this.alpha = 0;
    }
    return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.alpha + ")";
  }
  if (alpha == undefined) {
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      toString: toString
    } : null;
  }
  if (alpha > 1) {
    alpha = 1;
  } else if (alpha < 0) {
    alpha = 0;
  }
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    alpha: alpha,
    toString: toString
  } : null;
}


function grid(width, height, divisor, strokeWidth) {
  // Brute force method for drawing a grid
  // Possible improvements:
  // -Is there a Built-in function for D3 that will accomplish this?
  // -Ability to label the lines with numbers

  if (typeof strokeWidth == 'undefined'){
    strokeWidth = 0.5;
  }

  for (var i = 0; i < (divisor + 1); i++) {
    var myLine = drawing.append("svg:line")
    //Draw the horizontal grid
    .attr("x1", width / divisor * i)
    .attr("y1", 0)
    .attr("x2", width / divisor * i)
    .attr("y2", height)
    .attr("stroke-width",strokeWidth)
    .attr("class","horizontalGrid")
    .style("stroke", "rgb(0,0,50)");
  }

  for (var i = 0; i < (divisor + 1); i++) {
    //Draw the vertical grid
    var myLine = drawing.append("svg:line")
    .attr("y1", height / divisor * i)
    .attr("x1", 0)
    .attr("y2", height / divisor * i)
    .attr("x2", width)
    .attr("stroke-width",strokeWidth)
    .style("class", "veriticalGrid")
    .style("stroke", "rgb(0,0,50)");
  }
}

function gridFromCentrePoint(point, width, height, divisor, strokeWidth) {
  if (typeof strokeWidth == 'undefined'){
    strokeWidth = 0.5;
  }

  for (var i = 0; i < ((divisor / 2) + 1); i++) {
    var myLine = drawing.append("svg:line")
    //x to the left
    .attr("x1", parseInt(point.attr("cx")) - (width / divisor * i))
    .attr("y1", 0)
    .attr("x2", parseInt(point.attr("cx")) - (width / divisor * i))
    .attr("y2", height)
    .attr("stroke-width",strokeWidth)
    .style("stroke", "rgb(0,0,50)");
  }

  for (var i = 1; i < ((divisor / 2) + 1); i++) {
    var myLine = drawing.append("svg:line")
    //x to the right
    .attr("x1", parseInt(point.attr("cx")) + (width / divisor * i))
    .attr("y1", 0)
    .attr("x2", parseInt(point.attr("cx")) + (width / divisor * i))
    .attr("y2", height)
    .attr("stroke-width",strokeWidth)
    .style("stroke", "rgb(0,0,50)");
  }

  for (var i = 0; i < ((divisor / 2) + 1); i++) {
    var myLine = drawing.append("svg:line")
    //y to the top
    .attr("x1", 0)
    .attr("y1", parseInt(point.attr("cy")) - (height / divisor * i))
    .attr("x2", width)
    .attr("y2", parseInt(point.attr("cy")) - (height / divisor * i))
    .attr("stroke-width", strokeWidth)
    .style("stroke", "rgb(0,0,50)");
  }

  for (var i = 1; i < ((divisor / 2) + 1); i++) {
    var myLine = drawing.append("svg:line")
    //y to the bottom
    .attr("x1", 0)
    .attr("y1", parseInt(point.attr("cy")) + (height / divisor * i))
    .attr("x2", width)
    .attr("y2", parseInt(point.attr("cy")) + (height / divisor * i))
    .attr("stroke-width", strokeWidth)
    .style("stroke", "rgb(0,0,50)");
  }
}
