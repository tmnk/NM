var dx = 0.05;
var dt = dx*dx/2
var a = 1;
var b = 0;
var c = 0;
var alpha = 0;
var beta = 1;
var gamma = 0;
var delta = 1;
var leftX = 0;
var rightX = 1;
var leftT = 0;
var rightT = 1;
var boundCond;
var answ;
var vecX;
var phi0;
var phi1;
var ux0;
var funcD;

function setBoundCondCoeff(a, b, c, d, k) {
    alpha = a;
    beta = b;
    gamma = c;
    delta = d;
    boundCond = k;
}

function setCoeff(_a, _b, _c) {
    a = _a;
    b = _b;
    c = _c;
}

function FiniteDifference(_leftX, _rightX, _leftT, _rightT, _dx, _dt) {
    leftX = _leftX;
    rightX = _rightX;
    leftT = _leftT;
    rightT = _rightT;
    dx = _dx;
    dt = dx*dx/2;
}

function explicit() {
    return cnm(0);
}

function implicit() {
    return cnm(1);
}

function cnm() {
    return cnm(0.5);
}

function cnm(theta) {
    answ = new Matrix(parseInt((rightX - leftX)/dx + 1), parseInt((rightT - leftT)/dt + 1));
    vecX = new Vector(parseInt((rightX - leftX)/dx + 1));

    for (var i = 0; i < answ.colSize(); i++) {
        answ.set(0, i, phi0(leftT + i * dt, 0));
        answ.set(answ.rowSize() - 1, i, phi1(leftT + i * dt, 0));
    }

    for (var i = 0; i < answ.rowSize(); i++) {
        vecX.set(i, leftX + dx * i);
        answ.set(i, 0, ux0(0, dx * i + leftX));
    }

    var X = new Matrix(answ.rowSize(), answ.rowSize());
    var ans = new Vector(3);
    var Y = new Vector(answ.rowSize());
    var c1 = 0, c2 = 0;
    var q1 = 0, q2 = 0;

    var sigma1 = a / (dx * dx);
    var sigma2 = b / (2 * dx);
    var sigma3 = c ;
    var coefA = -sigma1 * theta + sigma2 * theta;
    var coefB = (1 / dt) + (2 * sigma1 * theta) - sigma3 * theta;
    var coefC = -(sigma1 * theta + sigma2 * theta);

    for (var j = 1; j < X.rowSize() - 1; j++) {
        X.set(j, j - 1, coefA);
        X.set(j, j, coefB);
        X.set(j, j + 1, coefC);
    }

    if (boundCond === 0) {
      X.set(0, 0, beta - alpha / dx);
      X.set(0, 1, alpha / dx);

      X.set(X.rowSize() - 1, X.colSize() - 2, -gamma / dx);
      X.set(X.rowSize() - 1, X.colSize() - 1, delta + gamma / dx);
    }
    else if (boundCond === 1) {
        if (alpha == 0) {
          X.set(0, 0, beta);
          X.set(0, 1, 0);
        }
        else {
          X.set(0, 0, (2 * a / dx) + (dx / dt) - (c * dx) - (beta / alpha * (2 * a + b * dx)));
          X.set(0, 1, - 2 * a / dx);
        }

        if (gamma == 0) {
          X.set(X.rowSize() - 1, X.colSize() - 2, 0);
          X.set(X.rowSize() - 1, X.colSize() - 1, delta);
        }
        else {
          X.set(X.rowSize() - 1, X.colSize() - 2, - 2 * a / dx);
          X.set(X.rowSize() - 1, X.colSize() - 1, (2 * a / dx) + (dx / dt) - (c * dx) - (delta / gamma * (2 * a + b * dx)));
        }
      }
      else if (boundCond === 2) {
        X.set(0, 0, (beta - 3 * alpha / (2 * dx)));
        X.set(0, 1, (4 * alpha / (2 * dx)));
        X.set(0, 2, (-alpha / (2 * dx)));

        X.set(X.rowSize() - 1, X.colSize() - 3, (gamma / (2 * dx)));
        X.set(X.rowSize() - 1, X.colSize() - 2, -4 * gamma / (2 * dx));
        X.set(X.rowSize() - 1, X.colSize() - 1, delta + 3 * gamma / (2 * dx));

        if (X.get(0,2) == 0.0) {
          q1 = 0;
          c1 = 0;
        }
        else {
          if (X.get(1,2) == 0) {
            c1 = 2;
            q1 = X.get(0,2) / X.get(2, 2);
          }
          else {
            c1 = 1;
            q1 = X.get(0,2) / X.get(1, 2);
          }

          X.set(0, 0, X.get(0, 0) - q1 * X.get(c1, 0));
          X.set(0, 1, X.get(0, 1) - q1 * X.get(c1, 1));
          X.set(0, 2, X.get(0, 2) - q1 * X.get(c1, 2));
        }

        if (X.get(X.rowSize() - 1, X.colSize() - 3) == 0) {
          q2 = 0;
          c2 = 0;
        }
        else {
          if (X.get(X.rowSize() - 2, X.colSize() - 3) == 0) {
            c2 = X.rowSize() - 3;
            q2 = X.get(X.rowSize() - 1, X.colSize() - 3) / X.get(X.rowSize() - 3, X.colSize() - 3);
          }
          else {
            c2 = X.rowSize() - 2;
            q2 = X.get(X.rowSize() - 1, X.colSize() - 3) / X.get(X.rowSize() - 2, X.colSize() - 3);
          }

          X.set(X.rowSize() - 1, X.rowSize() - 1, X.get(X.rowSize() - 1, X.rowSize() - 1) - q2 * X.get(c2, X.rowSize() - 1));
          X.set(X.rowSize() - 1, X.rowSize() - 2, X.get(X.rowSize() - 1, X.rowSize() - 2) - q2 * X.get(c2, X.rowSize() - 2));
          X.set(X.rowSize() - 1, X.rowSize() - 3, X.get(X.rowSize() - 1, X.rowSize() - 3) - q2 * X.get(c2, X.rowSize() - 3));
        }
          }


    for (var k = 0; k < answ.colSize(); k++) {
        for (var j = 1; j < X.rowSize() - 1; j++) {
          var d = 0;
          d += (((1 - theta) * sigma1) - ((1 - theta) * sigma2)) * answ.get(j - 1, k);
          d += ((1 / dt) - 2 * ((1 - theta) * sigma1) + ((1 - theta) * sigma3)) * answ.get(j, k);
          d += (((1 - theta) * sigma1) + ((1 - theta) * sigma2)) * answ.get(j + 1, k);
          d += funcD(leftT + k * dt, leftX + j * dx);
          Y.set(j, d);
        }

        if (boundCond === 0) {
          Y.set(0, phi0(leftT + (k + 1) * dt, 0));
          Y.set(Y.size() - 1, phi1(leftT + (k + 1) * dt, 0));
        }
        else if (boundCond === 1) {
          if (alpha == 0) Y.set(0, phi0(leftT + (k + 1) * dt, 0));
          else Y.set(0, dx / dt * answ.get(0, k) - phi0(leftT + (k + 1) * dt, 0) * (2*a - b * dx) / alpha);
          if (gamma == 0)   Y.set(Y.size() - 1, phi1(leftT + (k + 1) * dt, 0));
          else   Y.set(Y.size() - 1, dx / dt * answ.get(answ.rowSize(), k) - phi0(leftT + (k + 1) * dt, 0) * (2 * a - b * dx) / gamma);
        }
        else if (boundCond === 2) {
          Y.set(0, phi0(leftT + (k + 1) * dt, 0) - q1 * Y.get(c1));
          Y.set(Y.size() - 1, phi1(leftT + (k + 1) * dt, 0) - q2 * Y.get(c2));
        }
        var solver = new Tridiagonal();
        solver.solve(X, Y);
        ans = solver.get_X();

        for (var i = 0; i < answ.colSize(); i++) {
            answ.set(i, k + 1, ans.get(i));
        }
        return [vecX, answ]
    }
}
