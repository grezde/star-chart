
function getFile(url, cb, errorCB) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4) {
            if(xhttp.status == 200)
                cb(xhttp.responseText);
            else
                errorCB();
        }
    };
    xhttp.open('GET', url, true);
    xhttp.send(null);
}

function getTable(url, cb) {
    getFile(url, function(text) {
        text = text.split(/\r?\n/).map(line => line.split(','));
        var data = {};
        for(var i=0; i<text[0].length; i++) {
            data[text[0][i]] = [];
            for(var j=1; j<text.length; j++) {
                var a = Number(text[j][i]);
                data[text[0][i]].push(Number.isNaN(a) ? text[j][i] : a);
            }
        }
        cb(data);
    }, () => console.error('Could not get '+url));
}

var cnv, ctx;
var data = null;

window.onresize = function() {
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;
};

window.onload = function() {
    cnv = document.getElementById('board');
    ctx = cnv.getContext('2d');
    window.onresize();
    getTable('/data/hyg_edited.csv', table => data = table);
    requestAnimationFrame(redraw);
};

function redraw() {
    if(data == null) {
        ctx.font = '48px Helvetica';
        ctx.fillStyle = 'white';
        ctx.fillText('Loading...', cnv.width/2 - 100, cnv.height/2 - 12);
    }
    requestAnimationFrame(redraw);
}