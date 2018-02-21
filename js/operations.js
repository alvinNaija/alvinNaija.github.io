var mapOfCasingComponents;
var mapOfCoiledTubingComponents;
var aggregateData = [];
var graphIndicatorIsDrawn = false;
var x_extent, x_scale, y_extent, y_scale;
var tubingSelection;

function showCasingList(data) {
    "use strict";
    data = sortCasingItems(data);
    mapOfCasingComponents = createCasingMap(data);
    var container = d3.select('.casing-container')
    var selection = container.select('#casing-selection');
    createSelectionOptionForEachCasingDataItem(selection, data);
    selection.on('change', function (e) {
        var selectedComponentData = mapOfCasingComponents[d3.select(this).property('value')];
        if (selectedComponentData) {
            console.log(selectedComponentData[KEY_CASING_GRADE])
            console.log(selectedComponentData[KEY_CASING_OD_M])
            console.log(selectedComponentData[KEY_CASING_ID_M])
            console.log(selectedComponentData[KEY_CASING_WALL_THICKNESS_M])
        }
    })
}

function showCoiledTubing(data) {
    "use strict";
    data = sortCoiledTubingItems(data);
    mapOfCoiledTubingComponents = createCoiledTubingMap(data);
    var container = d3.select('.coiled-tubing-container');
    tubingSelection = container.select('#tubing-selection');
    createSelectionOptionForEachCoiledTubingDataItem(tubingSelection, data);
    drawGraph();
}

function sortCasingItems(data) {
    return data.sort(function (a, b) {
        if (a[KEY_CASING_GRADE] < b[KEY_CASING_GRADE]) {
            return -1;
        }
        else if (a[KEY_CASING_GRADE] > b[KEY_CASING_GRADE]) {
            return 1;
        } else if (a[KEY_CASING_OD_M] < b[KEY_CASING_OD_M]) {
            return -1;
        } else if (a[KEY_CASING_OD_M] > b[KEY_CASING_OD_M]) {
            return 1;
        } else if (a[KEY_CASING_ID_M] < b[KEY_CASING_ID_M])
            return -1;
        else if (a[KEY_CASING_ID_M] > a[KEY_CASING_ID_M]) {
            return 1;
        } else {
            return 0
        }
    });
}

function createCasingMap(data) {
    return d3.nest()
        .key(function (d) {
            return generateKeyFromData(d)
        })
        .rollup(function (d) {
            return d[0];
        })
        .object(data);
}

function createSelectionOptionForEachCasingDataItem(selection, data) {
    selection.selectAll('.casing-selection-item').data(data).enter()
        .append(TAG_OPTION)
        .attr(ATTR_CLASS, 'casing-selection-item')
        .attr(ATTR_VALUE, function (d) {
            return generateKeyFromData(d);
        })
        .text(function (d) {
            return d[KEY_CASING_GRADE] + '    ' + DELIMITER_PIPE + ' ' + d[KEY_CASING_OD_M] + ' ' + DELIMITER_PIPE + ' ' + d[KEY_CASING_ID_M] + ' ' + DELIMITER_PIPE + ' ' + d[KEY_CASING_WALL_THICKNESS_M];
        });
}

function sortCoiledTubingItems(data) {
    return data.sort(function (a, b) {
        if (a[KEY_CASING_GRADE] < b[KEY_CASING_GRADE]) {
            return -1;
        }
        else if (a[KEY_CASING_GRADE] > b[KEY_CASING_GRADE]) {
            return 1;
        } else if (a[KEY_CASING_OD_M] < b[KEY_CASING_OD_M]) {
            return -1;
        } else if (a[KEY_CASING_OD_M] > b[KEY_CASING_OD_M]) {
            return 1;
        } else if (a[KEY_CASING_ID_M] < b[KEY_CASING_ID_M])
            return -1;
        else if (a[KEY_CASING_ID_M] > a[KEY_CASING_ID_M]) {
            return 1;
        } else {
            return 0
        }
    });
}

function createCoiledTubingMap(data) {
    return d3.nest()
        .key(function (d) {
            return generateKeyFromData(d)
        })
        .rollup(function (d) {
            return d[0];
        })
        .object(data);
}

function createSelectionOptionForEachCoiledTubingDataItem(selection, data) {
    selection.selectAll('.tubing-selection-item').data(data).enter()
        .append(TAG_OPTION)
        .attr(ATTR_CLASS, 'tubing-selection-item')
        .attr(ATTR_VALUE, function (d) {
            return generateKeyFromData(d);
        })
        .text(function (d) {
            return d[KEY_CASING_GRADE] + ' ' + DELIMITER_PIPE + ' ' + d[KEY_CASING_OD_M] + ' ' + DELIMITER_PIPE + ' ' + d[KEY_CASING_ID_M] + ' ' + DELIMITER_PIPE + ' ' + d[KEY_CASING_WALL_THICKNESS_M];
        });
}

function generateKeyFromData(d) {
    var values = d[KEY_CASING_GRADE] + DELIMITER_UNDERSCORE + d[KEY_CASING_OD_M] + DELIMITER_UNDERSCORE
        + d[KEY_CASING_ID_M] + DELIMITER_UNDERSCORE + d[KEY_CASING_WALL_THICKNESS_M];
    values = values.replace(/(\.|-)/g, '_');
    return values;
}

function validate(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

function drawGraph() {
    var Y_AXIS_KEY = 'y_axis';
    var minData = {'od_m': '-0.1000', 'y_axis': -20}, maxData = {'od_m': '1.0000', 'y_axis': 1099}
    aggregateData = aggregateData.concat([minData, maxData]);
    console.log(aggregateData);
    d3.select('#graph-container').append(TAG_SVG).attr(STYLE_WIDTH, SVG_WIDTH).attr(STYLE_HEIGHT, SVG_HEIGHT)
    x_extent = d3.extent(aggregateData, function (d) {
        return d[KEY_CASING_OD_M];
    });
    x_scale = d3.scaleLinear().range([SVG_MARGIN, SVG_WIDTH - SVG_MARGIN])
        .domain([-0.05, 1.000]);
    y_extent = d3.extent(aggregateData, function (d) {
        return d['y_axis'];
    });
    y_scale = d3.scaleLinear().range([SVG_MARGIN, SVG_HEIGHT - SVG_MARGIN])
        .domain([-50, 1050]);
    d3.select(TAG_SVG).append(TAG_SVG_G).attr(ATTR_CLASS, 'x axis')
        .attr(ATTR_TRANSFORM, 'translate(0,' + (y_scale(0)) + ')')
        .call(d3.axisTop(x_scale).tickSizeOuter(0).tickValues([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.1]));

    d3.select(TAG_SVG)
        .append(TAG_SVG_G)
        .attr(ATTR_CLASS, "y axis")
        .attr(ATTR_TRANSFORM, 'translate(' + (x_scale(0)) + ',0 )')
        .call(d3.axisLeft(y_scale).tickSizeOuter(0).tickValues([100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]));

    /*  d3.select(TAG_SVG).append("polyline")      // attach a polyline
     .style("stroke", "black")  // colour the line
     .style("fill", "#eeeeee")     // remove any fill colour
     .attr("points", x_scale(0.01)+" "+ y_scale(0) + ", " + x_scale(0.01)+ " "+ y_scale(400) + " " +  x_scale(0.07)+ " "+ y_scale(400)
     + " " +x_scale(0.07)+ " "+ y_scale(0));*/
    /* d3.select(TAG_SVG).append("polyline")      // attach a polyline
     .style("stroke", "black")  // colour the line
     .style("stroke-width", "1")
     .style("fill", "white")     // remove any fill colour
     .attr("points", x_scale(0.03)+" "+ y_scale(0) + ", " + x_scale(0.03)+ " "+ y_scale(200) + " " +  x_scale(0.05)+ " "+ y_scale(200)
     + " " +x_scale(0.05)+ " "+ y_scale(0));*/
}

function drawComponent() {
    var selectedComponentData = mapOfCasingComponents[d3.select('#casing-selection').property('value')];
    var wallThickness;
    var innerDiameter;
    var depthOd;
    var origin_x;
    wallThickness = (x_scale(0.005) - x_scale(0));
    innerDiameter = (x_scale(selectedComponentData[KEY_CASING_ID_M])  - x_scale(0)) +x_scale(0.1)-x_scale(0);
    depthOd = d3.select('#depth-od').property('value');
    origin_x = x_scale(0.25);
    d3.select(TAG_SVG).select('#hole').remove();
    d3.select(TAG_SVG).append("rect")
        .attr('id', 'hole')
        .attr('x',origin_x)
        .attr('y', y_scale(0))
        .style("stroke-width", 1)
        .attr('width', ( innerDiameter - (wallThickness / 2)))
        .attr('height', y_scale(depthOd) - y_scale(0) + y_scale(50)-y_scale(0))
        .style("fill", "#eeeeee")
        .style('stroke', 'black')
        .style('stroke-dasharray',  "5");


    if (selectedComponentData) {
        wallThickness = (x_scale(selectedComponentData[KEY_CASING_WALL_THICKNESS_M]) - x_scale(0));
        innerDiameter = (x_scale(selectedComponentData[KEY_CASING_ID_M]) - x_scale(0));
        depthOd = d3.select('#depth-od').property('value');
        origin_x = x_scale(0.3);
        d3.select(TAG_SVG).select('#outer').remove();
        d3.select(TAG_SVG).append("rect")
            .attr('id', 'outer')
            .attr('x', (origin_x + (wallThickness / 2)))
            .attr('y', y_scale(0))
            .style("stroke-width", wallThickness)
            .attr('width', ( innerDiameter - (wallThickness / 2)))
            .attr('height', y_scale(depthOd) - y_scale(0))
            .style("fill", "white")
            .style('stroke', 'black')
            .style('stroke-dasharray',  "0, " + ( innerDiameter - (wallThickness / 2)) + " " + (y_scale(depthOd)-y_scale(0)) + " " +( innerDiameter - (wallThickness / 2))
            +" " +(y_scale(depthOd)-y_scale(0)));
    }
    selectedComponentData = mapOfCoiledTubingComponents[d3.select('#tubing-selection').property('value')];
    if (selectedComponentData) {
        origin_x = (origin_x + (innerDiameter / 2));
        wallThickness = (x_scale(selectedComponentData[KEY_CASING_WALL_THICKNESS_M]) - x_scale(0));
        innerDiameter = (x_scale(selectedComponentData[KEY_CASING_ID_M]) - x_scale(0));
        origin_x = origin_x - (innerDiameter / 2);
        depthOd = d3.select('#depth-id').property('value');
        d3.select(TAG_SVG).select('#inner').remove();
        /*d3.select(TAG_SVG).append("polyline")
            .attr('id', 'inner')
            .style("stroke", "black")
            .style("fill", "white")
            .style("stroke-width", wallThickness)
            .attr("points", (origin_x + (wallThickness / 2)) + " " + y_scale(0) + ", " + (origin_x + (wallThickness / 2)) + " " + y_scale(depthOd) + " " + (origin_x + innerDiameter - (wallThickness / 2)) + " " + y_scale(depthOd)
                + " " + (origin_x + innerDiameter - (wallThickness / 2)) + " " + y_scale(0));*/
        d3.select(TAG_SVG).append("rect")
            .attr('id', 'inner')
            .attr('x', (origin_x + (wallThickness / 2)))
            .attr('y', y_scale(0))
            .style("stroke-width", wallThickness)
            .attr('width', ( innerDiameter - (wallThickness / 2)))
            .attr('height', y_scale(depthOd) - y_scale(0))
            .style("fill", "white")
            .style('stroke', 'black')
            .style('stroke-dasharray',  "0, " + ( innerDiameter - (wallThickness / 2)) + " " + (y_scale(depthOd)-y_scale(0)) + " " +( innerDiameter - (wallThickness / 2))
                +" " +(y_scale(depthOd)-y_scale(0)));
    }

}