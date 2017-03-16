var width, height, center;
var points_0 = parseInt(view.size.width / 250) + 1,
    points_1 = points_0 - 1,
    path = [new Path(), new Path()],
    mouse_pos = view.center / 2,
    path_height = mouse_pos.y;

path[0].fillColor = 'rgba(38, 208, 244, 0.8)';
path[1].fillColor = 'rgba(33, 109, 213, 0.6)';

initializePath();

/*
 * FUNCTIONS
 */

function initializePath(){
    center = view.center;
    width = view.size.width;
    height = view.size.height / 2;

    path[0].segments = path[1].segments = [];

    path[0].add(view.bounds.bottomLeft);
    for(var i = 0; i <= points_0; i++){
        var point = new Point(width / points_0 * i, center.y);
        path[0].add(point);
    }
    path[0].add(view.bounds.bottomRight);

    path[1].add(view.bounds.bottomLeft);
    for(var i = -1; i <= points_1 + 1; i++){
        var point = new Point(width / points_1 * i, center.y);
        path[1].add(point);
    }
    path[1].add(view.bounds.bottomRight);

    path[0].fullySelected = path[1].fullySelected = false;
}

function onFrame(event){
    var pos = height / 2 + 100;

    path_height += (center.y - pos - path_height) / 10;

    for(var i = 1; i <= points_0 + 1; i++){
        var sin_s = event.count + (i + i % 10) * 100,
            sin_h = Math.sin(sin_s / 200) * path_height,
            pos_y = Math.sin(sin_s / 50) * sin_h + height;

        path[0].segments[i].point.y = pos_y;
    }

    for(var i = 1; i <= points_1 + 2; i++){
        var sin_s = event.count + (i + i % 10) * 100,
            sin_h = Math.sin(sin_s / 200) * path_height,
            pos_y = Math.sin(sin_s / 80) * sin_h + height;

        path[1].segments[i].point.y = pos_y;
    }

    path[0].smooth({ type: 'continuous' });
    path[1].smooth({ type: 'continuous' });
}

function onMouseMove(event){
    mouse_pos = event.point;
}

function onResize(event){
    initializePath();
}
