
var nx = 50
var ny = 50

function empty(a) {
    var t = [];
    for (var i = 0; i < a; i++) {
        t.push(0);
    }
    return t;
}
function empty2(a, b) {
    var t = [];
    for (var i = 0; i < a; i++) {
        var tt = [];
        for (var j = 0; j < b; j++) {
            tt.push(0);
        }
        t.push(tt)
    }
    return t;
}

function copy(u) {
    var t = [];
    for (var i = 0; i < u.length; i++) {
        var tt = [];
        for (var j = 0; j < u[0].length; j++) {
            tt.push(u[i][j]);
        }
        t.push(tt)
    }
    return t;
}

function arange(s, e, h) {
    var t = [];
    var stop = s;
    for (var i = 0; stop < e; i++) {
        t.push(s + i * h);
        stop = s + i * h;
    }
    return t;
}

function div(u, v) {
    var t = [];
    for (var i = 0; i < u.length; i++) {
        var tt = [];
        for (var j = 0; j < u[0].length; j++) {
            tt.push(u[i][j] - v[i][j]);
        }
        t.push(tt)
    }
    return t;
}

function meshgrid(x, y) {
    var X = [];
    var Y = [];
    for (var i = 0; i < y.length; i++) {
        X.push(x)
        var tt = []
        for (var j = 0; j < x.length; j++) {
            tt.push(y[i]);
        }
        Y.push(tt)
    }
    return [X,Y];
}

var x0 = 0;
var xl = Math.PI / 2;
var y0 = 0;
var yl = Math.PI / 2;
var It = empty(0);
var E = empty(0);


function phi_y(x, y) {
    if (x == 0) return Math.cos(y)
    if (x == Math.PI / 2) return 0
}


function phi_x(x, y) {
    if (y == 0) return Math.cos(x)
    if (y == Math.PI / 2)  return 0
}


function U(x, y) {
    return Math.cos(x)*Math.cos(y);
}


function norm(u, v) {
    var z = div(u, v)
    var min_el = 100;
    var max_el = 0
    var n = z.length
    var m = z[0].length
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < m; j++) {
            if ((z[i][j]) < min_el) {min_el = (z[i][j])}
            if ((z[i][j]) > max_el) {max_el = (z[i][j])}
        }
    }
    return [min_el, max_el]
}



function linear_interpolation(nx, ny, hx, hy) {
    var u0 = empty2(nx+1, ny+1);

    var x = 0;
    var y = 0;
    for (var i = 0; i < nx+1; i++) {
        u0[i][0] = phi_x(x, 0)
        u0[i][ny] = phi_x(x, yl)
        x += hx
    }
    for (var j = 0; j < ny+1; j++) {
        u0[0][j] = phi_y(0, y)
        u0[nx][j] = phi_y(xl, y)
        y += hy
    }
    var y = hx;
    for (var j = 1; j < ny; j++) {
        x = hx
        for (var i = 1; i < nx; i++) {
            u0[i][j] = phi_y(0, y) + phi_y(xl, y)*x/xl
            x += hx
        }
        y += hy
    }
    return u0
}

function recalc(u, nx, ny, hx, hy) {
    var u_new = copy(u)
    var w = 1.9
    for (var j = 1; j < ny; j++) {
        for (var i = 1; i < nx; i++) {
            if (_method == 0)
                u_new[i][j] = (-2 * u[i+1][j] / hx - u[i+1][j] / hx ** 2 -
                               u[i-1][j] / hx ** 2 - u[i][j+1]/hy**2 -
                               u[i][j-1]/hy**2) / (3 - 2 / hx - 2 / hx**2 -
                                                   2 / hy**2)

            if (_method == 1)
                u_new[i][j] = (-2 * u[i+1][j] / hx - u[i+1][j] / hx ** 2 -
                               u_new[i-1][j] / hx ** 2 - u[i][j+1]/hy**2 -
                               u_new[i][j-1]/hy**2) / (3 - 2 / hx - 2 / hx**2 -
                                                       2 / hy**2)

            if (_method == 2)
                u_new[i][j] = (1 - w)*u[i][j] + w*(-2 * u[i+1][j] / hx - u[i+1][j] / hx ** 2 -
                               u_new[i-1][j] / hx ** 2 - u[i][j+1]/hy**2 -
                               u_new[i][j-1]/hy**2) / (3 - 2 / hx - 2 / hx**2 -
                                                       2 / hy**2)
        }
    }

    return u_new
}

function solver() {
    var eps = 0.001
    var hx = (xl - x0) / nx
    var hy = (yl - y0) / ny

    var X = arange(x0, xl+hx, hx)
    var Y = arange(y0, yl+hy, hy)

    if (X.length > nx + 1)
        X.pop()

    if (Y.length > ny + 1)
        Y.pop()

    var F = empty2(nx+1, ny+1)
    var x = 0
    var y = 0
    for (var j = 0; j < ny+1; j++) {
        x = 0
        for (var i = 0; i < nx+1; i++) {
            // alert(x,y)
            F[i][j] = U(x, y)
            x += hx
        }
        y += hy
    }

    var u = linear_interpolation(nx, ny, hx, hy)
    var norm_val = 1
    var k = 0
    It = []
    E = []
    var max = 100;
    while (norm_val > eps) { //norm_val < eps N  norm_val > eps holm max > eps func
        max = 0
        var v = copy(u)
        u = recalc(u, nx, ny, hx, hy)
        var g = norm(u, v)
        norm_val = g[0]
        max = g[1]
        It.push(k)
        E .push(norm_val)
        k += 1
    }

    [X, Y] = meshgrid(X, Y)
    return [X,Y,F,u, It, E]
    // F = nj.transpose(F)
    // u = nj.transpose(u) 
    // ax.plot_surface(X, Y, F, color='blue')
    // ax.plot_surface(X, Y, u, color='green')
}

