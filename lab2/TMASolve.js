function getArray(m, n){
    var A = new Array(m);
    for(var i = 0; i < m; i++){
        A[i] = new Array(n);
    }

    for (var i = 0; i < m; i++){
        for (var j = 0; j < n; j++){
            A[i][j] = 0.0;
        }
    }

    return A;
}


function SolveTMA(A, B){
    var n = A.length;
    var P = getArray(1, n)[0];
    var Q = getArray(1, n)[0];

    P[0] = -A[0][1] / A[0][0];
    Q[0] = B[0] / A[0][0];

    for(var i = 1; i < n-1; i++){
        var a = A[i][i-1];
        var b = A[i][i];
        var c = A[i][i+1];

        P[i] = -c / (b + a * P[i-1]);
        Q[i] = (B[i] - a * Q[i-1]) / (b + a * P[i-1]);

    }

    var resUp = B[n-1] - A[n-1][n-2]*Q[n-2];
    var resDown = A[n-1][n-1] + A[n-1][n-2]*P[n-2];

    var x = getArray(1, n)[0];
    Q[n-1] = resUp / resDown;
    x[n-1] = Q[n-1];

    for(var i = n-2; i >= 0; i--){
        x[i] = P[i] * x[i+1] + Q[i];
    }

    return x;
}