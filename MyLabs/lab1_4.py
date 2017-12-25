import math
import numpy as np
A = np.array([ [  -7,   -6,  8],
            [-6, 3,  -7],
            [8, -7,  4]], dtype='float64')
eps = 0.01


def SrchMaxUpDig(M):
    n = M.shape[0]
    mmax, mi, mj = 0, 0, 0
    for i in range(n - 1):
        for j in range(i + 1, n):
            if mmax < abs(M[i, j]):
                mmax = abs(M[i, j])
                mi, mj = i, j
    return mmax, mi, mj


M = np.copy(A)
X = np.matrix(np.full(M.shape, 1))

k = 0

mmax, i, j = SrchMaxUpDig(M)
while mmax > eps:
    angle = math.atan(2 * M[i, j] / (M[i, i] - M[j, j])) / 2
    H = np.matrix(np.identity(M.shape[0]))
    H[i, j], H[j, i] = -math.sin(angle), math.sin(angle)
    H[i, i] = H[j, j] = math.cos(angle)

    M = H.transpose() * M * H
    if k == 0:
        X = H
    else:
        X *= H
    mmax, i, j = SrchMaxUpDig(M)
    k += 1


print(np.diag(M), "\n", X, k)