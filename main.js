
var canvas;
var ctx;
var image;
var joyImage;

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

window.onload = function() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    canvas.addEventListener('click', function(event) {
        clickJoystick(event.offsetX, event.offsetY);
    }, false);

    //resetButton = document.getElementById("reset").onclick = resetClick;
    resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClick, false);

    //canvas.addEventListener("keydown", doKeyDown, true);
    document.onkeydown = doKeyDown;

    image = new Image(); 
    image.src = "sokobox.gif"; 
    image.onload = function() {
        //init();
    };

    joyImage = new Image(); 
    joyImage.src = "joystick.png"; 
    joyImage.onload = function() {
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

function clickJoystick(x, y) {
    //ctx.drawImage(joyImage, 20, canvas.height-20-joyImage.height);

    if (x > 20 && x < 20 + 160
        && y > canvas.height - 20 - 160 && y <  canvas.height-20) {

        console.log(x);
        if (y > canvas.height-20-53) // down
        {
            if (move(0, 1))  {
                draw();
            }
        }
        else if (y > canvas.height-20-53-53) // up
        {
            if (x < 20+(160/2)) {
                if (move(-1, 0))  {
                    draw();
                }
            } else {
                if (move(1, 0))  {
                    draw();
                }
            }
        }
        else // up
        {
            if (move(0, -1))  {
                draw();
            }
        }
    }
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

    var cx = canvas.width - (level[0].length*40);
    var cy = canvas.height - (level.length*40);

    ctx.clearRect( 0, 0, canvas.width, canvas.height );
    
    ctx.save();
    ctx.translate(cx/2, cy/2);

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

    ctx.restore();
    ctx.drawImage(joyImage, 20, canvas.height-20-joyImage.height);

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
