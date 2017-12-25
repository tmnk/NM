/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Неявная схема                                                                                        //
//Алгоритм                                                                                             //
//1) Вычислить U_i на нулевом слое = psi1(X[i]) i = 0...N (N - разбиение X)                            //
//2) Вычислить U_i на первом слое используем формулы в которых аппроксимируем второе                   //
//   начальное условие (первый или второй порядок точности по dt) i = 0...N                            //
//3) Решение СЛАУ с трехдиагональной матрицей                                                          //
//4) Вычисляем U_0 и U_n на k слое (k=2), аппроксимируя граничные условия по двум точкам               //
//   первого порядка, по двум точкам второго, по трем точкам второго.                                  //
//5) k = k + 1 --> 3) 4)                                                                               //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function SolveMethodImplicit(aT1, aT2){
    var PI = Math.PI;
    var a = m_a;
    var e = m_e;
    var b = m_b;
    var c = m_c;
    var alpha = m_alpha;
    var beta = m_beta;
    var gama = m_gamma;
    var delta = m_delta;
    var xl = 0;
    var xr = Math.PI / 2;
    var tl = 0;
    var tr = 1;

    var m = m_tau;
    var n = h;

    var dt = (tr - tl) / (m-1);
    var dx = (xr - xl) / (n-1);

    var T = getArray(1,m)[0];
    var X = getArray(1,n)[0];

    for(var i = 0; i < m; i++){
        T[i] = tl + i*dt;
    }

    for(var i = 0; i < n; i++){
        X[i] = xl + i*dx;
    }

    var U = getArray(m,n);

    //1)
    for (var i = 0; i < n; i++){
        U[0][i] = psi1(X[i]);
    }
    //2)
    switch (aT2){
        case(0):
            for (var i = 0; i < n; i++){
                U[1][i] = U[0][i] + dt*psi2(X[i]);
            }
            break;

        case(1):
            // Зависит от варианта
            // psi1_x - первая производная по x от psi1
            // psi1_xx - вторая производная по x от psi1
            var psi1_x = function(x){ return Math.cos(x);};
            var psi1_xx = function(x) {return -Math.sin(x);};

            for (var i = 0; i < n; i++){
                U[1][i] = psi1(X[i]) + psi2(X[i])*dt;
                U[1][i] += 0.5*(dt*dt)*(-e*psi2(X[i]) + a*psi1_xx(X[i]) + b*psi1_x(X[i]) + c*psi1(X[i]) + f(X[i], 0));
            }
            break;
    }

    //3) 4)
    var M = getArray(n,n);
    var V = getArray(1,n)[0];

    for (var k = 2; k < m; k++){


        for (var i = 1; i < n-1; i++){
            var s1 = 2*a - dx*b;
            var s2 = 2*dx*dx*(-e / (2*dt) - 1/(dt*dt) + c) - 4*a;
            var s3 = dx*b + 2*a;
            M[i][i-1] = s1;
            M[i][i] = s2;
            M[i][i+1] = s3;
            V[i] = (-4*dx*dx / (dt*dt))*U[k-1][i] + (2*dx*dx / (dt*dt) - (e*dx*dx) / dt)*U[k-2][i] - 2*dx*dx*f(X[i], T[k]);
        }
        switch (aT1){
            case(0):
                M[0][0] = (beta*dx - alpha);
                M[0][1] = -alpha;
                V[0] = dx*fi0(T[k]);

                M[n-1][n-2] = -gama;
                M[n-1][n-1] = (delta*dx + gama);
                V[n-1] = dx*fi1(T[k]);

                U[k] = SolveTMA(M,V);
                break;

            case(1):
                M[0][0] = 2*beta*dx - 3*alpha;
                M[0][1] = 4*alpha;
                M[0][2] = -alpha;
                V[0] = 2*dx*fi0(T[k]);

                M[n-1][n-3] = gama;
                M[n-1][n-2] = -4*gama;
                M[n-1][n-1] = (2*delta*dx + 3*gama);
                V[n-1] = 2*dx*fi1(T[k]);

                U[k] = numeric.solve(M,V);
                break;

            case(2):
                M[0][0] = 2*beta*dx - 3*alpha;
                M[0][1] = 4*alpha;
                M[0][2] = -alpha;
                V[0] = 2*dx*fi0(T[k]);

                M[n-1][n-3] = gama;
                M[n-1][n-2] = -4*gama;
                M[n-1][n-1] = (2*delta*dx + 3*gama);
                V[n-1] = 2*dx*fi1(T[k]);

                U[k] = numeric.solve(M,V);
                break;
        }
    }



    return {X,U}
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Явная схема                                                                                          //
//Алгоритм:                                                                                            //
//1) Вычислить U_i на нулевом слое = psi1(X[i]) i = 0...N (N - разбиение X)                            //
//2) Вычислить U_i на первом слое используем формулы в которых аппроксимируем второе                   //
//   начальное условие (первый или второй порядок точности по dt) i = 0...N                            //
//3) Вычислить U_i на k слое, k = 2, i = 1...N-1                                                       //
//4) Вычисляем U_0 и U_n на k слое (k=2), аппроксимируя граничные условия по двум точкам               //
//   первого порядка, по двум точкам второго, по трем точкам второго.                                  //
//5) k=k+1 --> 3) 4) вычисляем U_i на k слое (k = 3) по известным слоям k = 1 и k = 2 (k-1, k-2) и т.д.//
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function SolveMethodExplicit(aT1, aT2){
    var PI = Math.PI;
    var a = m_a;
    var e = m_e;
    var b = m_b;
    var c = m_c;
    var alpha = m_alpha;
    var beta = m_beta;
    var gama = m_gamma;
    var delta = m_delta;
    var xl = 0;
    var xr = Math.PI / 2;
    var tl = 0;
    var tr = 1;

    var m = m_tau;
    var n = h;

    var dt = (tr - tl) / (m-1);
    var dx = (xr - xl) / (n-1);

    var T = getArray(1,m)[0];
    var X = getArray(1,n)[0];

    for(var i = 0; i < m; i++){
        T[i] = tl + i*dt;
    }

    for(var i = 0; i < n; i++){
        X[i] = xl + i*dx;
    }

    var U = getArray(m,n);

    //1)
    for (var i = 0; i < n; i++){
        U[0][i] = psi1(X[i]);
    }
    //2)
    switch (aT2){
        case(0):
            for (var i = 0; i < n; i++){
                U[1][i] = U[0][i] + dt*psi2(X[i]);
            }
            break;

        case(1):
            // Зависит от варианта
            // psi1_x - первая производная по x от psi1
            // psi1_xx - вторая производная по x от psi1
            var psi1_x = function(x){ return Math.cos(x);};
            var psi1_xx = function(x) {return -Math.sin(x);};

            for (var i = 0; i < n; i++){
                U[1][i] = psi1(X[i]) + psi2(X[i])*dt;
                U[1][i] += 0.5*(dt*dt)*(-e*psi2(X[i]) + a*psi1_xx(X[i]) + b*psi1_x(X[i]) + c*psi1(X[i]) + f(X[i], 0));
            }
            break;
    }

    //3) 4)
    for (var k = 2; k < m; k++){
        for (var i = 1; i < n-1; i++){
            var mA = ((2*a*dt*dt) / (dx*dx)) * (U[k-1][i-1] - 2*U[k-1][i] + U[k-1][i+1]);
            var mB = ((b*dt*dt) / dx) * (U[k-1][i+1] - U[k-1][i-1]);
            var mC = (e*dt - 2) * U[k-2][i];
            var mD = 4*U[k-1][i];
            var mE = 2*dt*dt*(c*U[k-1][i] + f(X[i], T[k-1])); //возможно T[k] в f
            U[k][i] = (1 / (2 + e*dt)) * (mD + mC + mA + mB + mE);
        }
        switch (aT1){
            case(0):
                U[k][0] = (alpha / (alpha - beta*dx))*U[k][1] + (dx / (beta*dx - alpha))*fi0(T[k]);
                U[k][n-1] = (gama / (gama + delta*dx))*U[k][n-2] + (dx / (delta*dx + gama))*fi1(T[k]);
                break;

            case(1):
                U[k][0] = (alpha / (2*beta*dx - 3*alpha))*(U[k][2] - 4*U[k][1]) + (2*dx / (2*beta*dx - 3*alpha))*fi0(T[k]);
                U[k][n-1] = (gama / (2*delta*dx + 3*gama))*(4*U[k][n-2] - U[k][n-3]) + (2*dx / (2*delta*dx + 3*gama))*fi1(T[k]);
                break;

            case(2):
                //U[k][0] = (2*dx*fi0(T[k])+alpha*U[k][2] - 4*alpha*U[k][1]) / (2*beta*dx - 3*alpha);
                //U[k][n-1] = (2*dx*fi1(T[k]) - gama*U[k][n-2] + 4*U[k][n-1]) / (3*gama + 2*delta*dx);
                U[k][0] = (alpha / (2*beta*dx - 3*alpha))*(U[k][2] - 4*U[k][1]) + (2*dx / (2*beta*dx - 3*alpha))*fi0(T[k]);
                U[k][n-1] = (gama / (2*delta*dx + 3*gama))*(4*U[k][n-2] - U[k][n-3]) + (2*dx / (2*delta*dx + 3*gama))*fi1(T[k]);
                break;
        }
    }



    return {X,U}

}


function SolveMethod(a, b, c){
    var R;
    switch(a){
        case(0):
            R = SolveMethodExplicit(b, c);
            break;
        case(1):
            R = SolveMethodImplicit(b, c);
            break;
    }
    return R;
}