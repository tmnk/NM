import numpy as np
import matplotlib.pyplot as plt

def h(X):
    return [X[i] - X[i-1] for i in range(1, len(X))]

def solve(a, b, c, d):
    P = np.array([0., 0., 0.])
    Q = np.array([0., 0., 0.])
    P[0] = -c[0]/b[0]
    Q[0] = d[0]/b[0]
    n = len(d) - 1
    for i in range(1, n):
        P[i] = -c[i]/(b[i] + a[i]*P[i-1])
        Q[i] = (d[i] - a[i]*Q[i-1])/(b[i] + a[i]*P[i-1])
    P[n] = 0
    Q[n] = (d[n] - a[n]*Q[n-1])/(b[n]+a[n]*P[n-1])

    x = np.array([0., 0., 0.])
    x[n] = Q[n]
    for i in range(1, len(x)):
        x[n - i] = P[n-i]*x[n - i + 1] + Q[n-i]
    return x

def  makeSolve(h, Y) :
    a = np.array([0., 0., 0.])
    b = np.array([0., 0., 0.])
    c = np.array([0., 0., 0.])
    V = np.array([0., 0., 0.])

    b[0] = 2*(h[0] + h[1])
    c[0] = h[1]
    V[0] = 3*((Y[2]-Y[1])/h[1] - (Y[1]-Y[0])/h[0])
    n = len(Y)-1
    for i in range(2, n-1):
        a[i-1] = h[i-1]
        b[i-1] = 2*(h[i-1] + h[i])
        c[i-1] = h[i]
        V[i-1] = 3*((Y[i+1] - Y[i])/h[i] - (Y[i] - Y[i-1])/h[i-1])
    a[n-2] = h[n-2]
    b[n-2] = 2*(h[n-2] + h[n-1])
    V[n-2] = 3*((Y[n]-Y[n-1])/h[n-1] - (Y[n-1]-Y[n-2])/h[n-2])
    return solve(a, b, c, V)


def findSplineAttrib(c, f, h):
    a = np.array([0., 0., 0., 0.])
    b = np.array([0., 0., 0., 0.])
    d = np.array([0., 0., 0., 0.])
    n = len(b) - 1
    for i in range(len(a)):
        a[i] = f[i]
    for i in range(1, n+1):
        b[i-1] = (f[i]-f[i-1])/h[i-1] - (1/3) * \
                    (h[i-1])*(c[i] + 2*c[i-1])
        d[i-1] = (c[i] - c[i-1]) / (3 * h[i-1])

    b[n] = (f[n+1] - f[n]) / (h[n]) - (2/3) * h[n]*c[n]
    d[n] = -c[n]/(3 * h[n])
    return (a, b, c, d)


def ans(a, b, c, d, x, X, prnt = False):
    idx = 0
    for i in range(len(X)):
        if x <= X[i]:
            idx = i-1
            break
    dx = x - X[idx]
    ans = a[idx] + b[idx] * dx + c[idx] * dx**2 + \
        d[idx] * dx**3
    if prnt == True:
        print("F(x) = " + str(a[idx]) + "+" + str(b[idx]) + "*" + "(x - " + str(X[idx]) + ")" + "+" + str(c[idx])  + "*" + "(x - " + str(X[idx]) + ")^2" + "+" + str(d[idx])  + "*" + "(x - " + str(X[idx]) + ")^3")
    return ans


def secondDerivateLeft(a, b, c, d, x, X) :
    idx = 0
    for i in range(len(X)):
        if x <= X[i]:
            idx = i - 1
            break
    dx = x - X[idx]
    ans = 2 * c[idx] + \
          6 * d[idx] * dx

    return ans

def secondDerivateRight(a, b, c, d, x, X) :
    idx = 0
    for i in range(len(X)):
        if x <= X[i]:
            idx = i - 1
            break

    dx = x - X[idx+1]
    print("dx = ", dx)
    ans = 2 * c[idx+1] + \
          6 * d[idx+1] * dx
    return ans

X = np.array([0.0, 1.7, 3.4, 5.1, 6.8])
Y = np.array([0., 3.0038, 5.2439, 7.3583, 9.4077])
x = 1.5

h = h(X)
(c2, c3, c4) = makeSolve(h, Y)
c = np.array([0., c2, c3, c4])
(a, b, c, d) = findSplineAttrib(c, Y, h)

ans(a, b, c, d, x, X, True)

x0 = 0.
n = 10000
Y_r = np.array([0.]*n)
X_r = np.linspace(0.1, 6.7, n)

for i in range(0, n):
    Y_r[i] = ans(a, b, c, d, X_r[i], X)

for i in range(1, len(X) - 1):
    print("x = ", X[i], "Left = ", secondDerivateLeft(a, b, c, d, X[i], X), "Right = ", secondDerivateRight(a, b, c, d, X[i], X))

plt.plot(X_r, Y_r)
plt.scatter(X[1:len(X)-1], Y[1:len(X)-1], color="red")
plt.show()
