import numpy as np
from math import *

def norma(a):
    return ( sqrt(sum([i**2 for i in a])) )

def QR(a):
    n = a.shape[0]
    A_i = a.copy()
    Q = np.eye(n)
    E = np.eye(n)
    for i in range(0, n-1):
        x = [l[0] for l in A_i[:, i:i+1].tolist()]
        for l in range(0, i):
            x[l] = 0
        v_i = x
        v_i[i] = A_i[i, i] + np.sign(A_i[i, i]) * norma(x)
        mv_i = np.matrix(v_i)
        mv_i_T = np.matrix(v_i).transpose()
        H_i = E - ((2/(mv_i * mv_i_T)[0, 0]) * (mv_i_T * mv_i))
        Q = Q * H_i
        A_i = H_i * A_i
    for i in range(1, n):
        for j in range(0, i):
            A_i[i, j] = 0
    return ( Q, A_i )

def get_root(a, b, c, d, eps):
    r1 = 0
    r2 = 0
    if abs(c * d) < eps:
        return ( a, b )
    D = (a + b)**2 - 4 * (a*b - c*d)
    if D < 0:
        r1 = complex((a + b) / 2, sqrt(abs(D)) / 2)
        r2 = complex((a + b) / 2, -sqrt(abs(D)) / 2)
    elif D > 0:
        r1 = ((a + b) + sqrt(D)) / 2
        r2 = ((a + b) - sqrt(D)) / 2
    return ( r1, r2 )

def get_eig(a, eps):
    A_i = a.copy()
    Aprev = A_i[0, 0]
    n = A_i.shape[0]

    roots_prev = [0]*n
    roots = [0]*n
    cur_eps = 0
    iteration = 0
    while True:
        Q_i, R_i = QR(A_i)
        A_i = R_i * Q_i

        for i in range(0, n-2, 2):
            root1, root2 = get_root(A_i[i, i], A_i[i+1, i+1], A_i[i, i+1], A_i[i+1, i], eps)
            roots[i] = (root1)
            roots[i+1] = (root2)

        if not((n - 1) % 2):
            roots[n-1] = (A_i[n-1, n-1])

        if iteration == 0:
            roots_prev = roots[:]
            iteration += 1
            continue
        cur_eps = max(map(lambda x, y: abs(x-y), roots_prev, roots))
        if cur_eps <= eps:
            return ( roots )
        iteration += 1
        roots_prev = roots[:]

A = np.array([ [-1,4,-4],
            [2,-5,0],
            [-8,-2,0]], dtype='float64')
print(get_eig(A, 0.001))