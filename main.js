
var canvas;
var ctx;
var image;
var level = [ 
    ['#','#','#','#','#','#'],
    ['#',' ','@',' ',' ','#'],
    ['#',' ','B','.',' ','#'],
    ['#',' ','B','.',' ','#'],
    ['#',' ',' ',' ',' ','#'],
    ['#','#','#','#','#','#'],
];
var dest;
var px, py;

var resetButton;
//var upButton;

window.onload = function() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    //resetButton = document.getElementById("reset").onclick = resetClick;
    resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClick, false);

    document.getElementById('up').addEventListener('click', function() {
        if (move(0, -1))  {
            draw();
        }
    }, false);
    document.getElementById('down').addEventListener('click', function() {
        if (move(0, 1))  {
            draw();
        }
    }, false);
    document.getElementById('left').addEventListener('click', function() {
        if (move(-1, 0))  {
            draw();
        }
    }, false);
    document.getElementById('right').addEventListener('click', function() {
        if (move(1, 0))  {
            draw();
        }
    }, false);

    //canvas.addEventListener("keydown", doKeyDown, true);
    document.onkeydown = doKeyDown;

    image = new Image(); 
    image.src = "sokobox.gif"; 
    image.onload = function() {
        init();
    };
}

function resetClick() {
    reset();
}

function init() {
    dest = JSON.parse(JSON.stringify( level )); // deep copy

    for (var y = 0; y < level.length; y++) {
        for (var x = 0; x < level[y].length; x++) {
            if (get(x, y) == '@') {
                px = x;
                py = y;
                level[y][x] = ' ';
                break;
            }
        }
    }
    draw();
}

function reset() {
    level = JSON.parse(JSON.stringify( dest )); // deep copy

    for (var y = 0; y < level.length; y++) {
        for (var x = 0; x < level[y].length; x++) {
            if (get(x, y) == '@') {
                px = x;
                py = y;
                level[y][x] = ' ';
                break;
            }
        }
    }
    draw();
}

function get(x, y) {
    return level[y][x];
}

function move(dx, dy) {
    if (get(px+dx, py+dy) == '#')  {
        return false;
    }
    if (get(px+dx, py+dy) == 'B') {
        if (get(px+dx*2, py+dy*2) == ' ' ||
            get(px+dx*2, py+dy*2) == '.'
        )  {
            if (dest[py+dy][px+dx] == '.') {
                level[py+dy][px+dx] = '.';
            } else {
                level[py+dy][px+dx] = ' ';
            }
            level[py+dy*2][px+dx*2] = 'B';
        } else {
            //dx = dy = 0;
            return false;
        }
    }
    px += dx;
    py += dy;
    return true;
}

function draw() {
    var completed = true;
    for (var y = 0; y < level.length; y++) {
        for (var x = 0; x < level[y].length; x++) {
            if (level[y][x] == '.') {
                completed = false;
            }
        }
    }

    ctx.clearRect( 0, 0, 400, 300 );

    for (var y = 0; y < level.length; y++) {
        for (var x = 0; x < level[y].length; x++) {
            switch (get(x, y)) {
                case '#':
                ctx.drawImage(image, 40*1, 0, 40, 40, x*40, y*40, 40, 40);
                break;
                case ' ':
                ctx.drawImage(image, 40*7, 0, 40, 40, x*40, y*40, 40, 40);
                break;
                case 'B':     
                if (dest[y][x] == '.') {
                    ctx.drawImage(image, 40*5, 0, 40, 40, x*40, y*40, 40, 40);
                } else {
                    ctx.drawImage(image, 40*4, 0, 40, 40, x*40, y*40, 40, 40);
                }
                break;
                case '.':
                ctx.drawImage(image, 40*6, 0, 40, 40, x*40, y*40, 40, 40);
                break;
            }
        }
    }
    ctx.drawImage(image, 40*2, 0, 40, 40, px*40, py*40, 40, 40);

    if (completed) {
        ctx.font = '48px serif';
        var tm = ctx.measureText('CLEAR');
        ctx.fillStyle = "rgb(255, 165, 0)";
        ctx.fillText('CLEAR', (400-tm.width)/2, (300)/2); // fillText strokeText
    }
}

function doKeyDown(e) {
    console.log(e.keyCode);
    switch (e.keyCode) {
        case 37: // left
        if (move(-1, 0))  {
            draw();
        }
        break;
        case 39: // right
        if (move(1, 0))  {
            draw();
        }
        break;
        case 38: // up
        if (move(0, -1))  {
            draw();
        }
        break;
        case 40: // down
        if (move(0, 1))  {
            draw();
        }
        break;
        case 8: // backspace
        reset();
        break;
    }
}
