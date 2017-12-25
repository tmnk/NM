from numpy import *
import numpy as np
def swap_rows(a, i, j):
    a[[i, j], :] = a[[j, i], :]


def get_p(a):
    n = a.shape[0]
    p = [0]*(n+1)

    for i in range(0, n+1):
        p[i] = i

    for i in range(0, n):
        max = i
        for j in range(i, n):
            if abs(a[j, i]) > abs(a[max, i]):
                max = j
        if(max != i):
            p[max], p[i] = p[i], p[max]
            p[n] += 1

    return ( p )



def pa(a, p):
    n = a.shape[0]
    A = a.copy()

    for i in range(0, n, 2):
        swap_rows(A, i, p[i])

    return ( A )

def pb(b, p):
    n = b.__len__()
    B = [0]*n

    for i in range(0, n):
        B[i] = b[p[i]]

    return ( B )

def lup(a):

    n = a.shape[0]
    p = get_p(a)

    A = pa(a, p)

    l = np.matrix(np.zeros([n,n]))
    u = np.matrix(np.zeros([n,n]))

    u[:] = A
    np.fill_diagonal(l, 1)

    for i in range(0, n-1):
        for j in range(i+1,n):
            l[j,i] = u[j,i]/u[i,i]
            u[j,i:] = u[j,i:]-l[j,i]*u[i,i:]
            u[j,i] = 0
    return ( l,u,p )

def solve_lu(a, b):
    n = a.shape[0]
    l, u, p = lup(a)
    z = [0]*n
    x = [0]*n

    B = pb(b, p)

    for i in range(0, n):
        sum = 0
        for k in range(0, i):
            sum += l[i, k] * z[k]
        z[i] = (B[i] - sum)/ l[i, i]

    for i in range(n-1, -1, -1):
        sum = 0
        for k in range(n-1, i, -1):
            sum += u[i, k]*x[k]
        x[i] = (z[i] - sum)/u[i, i]

    return ( x )

def det(a):
    n = a.shape[0]
    l, u, p = lup(a)

    det = u[0, 0]

    for i in range(1, n):
        det *= u[i, i]

    if ((p[n] -n)%2 == 0):
        return ( det )
    else:
        return ( -det )

def invert(a):
    n = a.shape[0]
    l, u, p = lup(a)

    inv = np.matrix(np.zeros([n,n]))
    for j in range(0, n):
        for i in range(0, n):
            if(p[i] == j):
                inv[i, j] = 1.
            else:
                inv[i, j] = 0.
            for k in range(0, i):
                inv[i, j] -= l[i, k] * inv[k, j]

        for i in range(n-1, -1, -1):
            for k in range(i+1, n):
                inv[i, j] -= u[i,k]*inv[k,j]
            inv[i,j] = inv[i,j] / u[i,i]

    return ( inv )

def round_data(a, e=4):
    return (list(map(lambda x: round(x, e), a)))
A = array([ [  -7,   3,  -4,   7   ],
            [8, -1,  -7, 6],
            [9, 9,  3,   -6],
            [  -7,  -9, -8, -5]], dtype='float64')
b = array([-126.,29.,27.,34.])

l, u, p = lup(A)
res = solve_lu(A, b)
print (A, 'x = ', b, '.T')
print ("\nL = ")
print (l.round(4))
print ("\nU = ")
print (u.round(4))
print ("\nb = ")
print (round_data(res, 4))
print ('\ndet = ', det(A))
print ('\ninv = ')
print (invert(A).round(4))
print ('\n A * invertA = ')
print (np.dot(A,invert(A)).round(4))