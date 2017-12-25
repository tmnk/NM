import numpy as np
import math as mt
import matplotlib.pyplot as plt


eps = 10e-5
#xy'' + 2y' - xy = 0
#y(1) = 0
#y(2) = 0,5e(-2)
#y(x) = e(-x)/x

def f1(x, y, z):
	return y - (2*z/ x)

def first():
	return 1/ np.exp(1)

def second():
	return 1/2 * (1/np.exp(2))

def F1(x):
	return np.exp(-x) / x

def roungeKutt(x0, b, y0, z0, h):
	X = np.arange(x0, b+h, h, dtype=np.float_)
	if X.max() > np.fabs(b + eps):
		X = np.delete(X, [len(X) - 1])

	Y0 = []
	Z = []
	for x0 in X :
		Y0 = np.append(Y0, [y0])
		Z = np.append(Z, [z0])

		K1 = h*z0
		L1 = h*f1(x0, y0, z0)
		K2 = h*(z0 + 0.5*L1)
		L2 = h*f1(x0 + 0.5*h, y0 + 0.5*K1, z0 + 0.5*L1)
		K3 = h*(z0 + 0.5*L2)
		L3 = h*f1(x0 + 0.5*h, y0 + 0.5*K2, z0 + 0.5*L2)
		K4 = h*(z0 + L3)
		L4 = h*f1(x0 + h, y0 + K3, z0 + L3)

		dy = (1/6)*(K1 + 2*K2 + 2*K3 + K4)
		dz = (1/6)*(L1 + 2*L2 + 2*L3 + L4)

		y0 = y0 + dy
		z0 = z0 + dz

	return (X, Y0, Z)


def adams(x0, b, y0, z0, h):
	(_, f, z) = roungeKutt(x0, x0 + 3*h, y0, z0, h)

	X = np.arange(x0, b + h, h, dtype=np.float_)
	if X.max() > np.fabs(b + eps):
		X = np.delete(X, [len(X) - 1])


	Y0 = np.append([], f)
	Y = np.append([], [F1(X[0:4])])
	Z0 = np.append([], z)

	coeff = np.array([55, -59, 37, -9])
	h /= 24
	y0 = Y0[3]
	z0 = Z0[3]


	F = np.array(f1(X[0:4], Y0, Z0))[::-1]
	z = z[::-1]

	for x0 in X[4:]:
		y1 = y0 + h*np.dot(coeff, z)
		z1 = z0 + h*np.dot(coeff, F)
		z = np.append([z1], z[0:3])
		if x0 != X[-1]:
			F = np.append([f1(x0, y1, z1)], F[0:3])
		y0 = y1
		z0 = z1
		Y0 = np.append(Y0, [y0])
		Z0 = np.append(Z0, [z0])
		Y  = np.append(Y, [F1(x0)])

	return (X, Y0, Z0)

def shooting_method(h):
    b = 2
    a = 1
    eps = 0.0001
    alpha0 = 0
    alpha1 = 1
    (_, Y, Z) = roungeKutt(a, b, alpha0, 0, h)
    count = 0
    one = False
    two = False
    while np.fabs(Y[-1] - second()) >= eps:
        count+=1
        c = (alpha0 + alpha1) / 2
        (_, Y, Z) = roungeKutt(a, b, c, 0, h)
        if Y[-1] >= second():
            alpha1 = c
            one = True
        else:
            alpha0 = c
            one = False
    if one == False:
        print(alpha0)
        (X, Y, Z) = roungeKutt(a, b, alpha0, 0, h)
        return (X,Y)
    else:
        print(alpha1)
        (X, Y, Z) = roungeKutt(a, b, alpha1, 0, h)
        return (X, Y)


def rounge(Y, Y1, p):
	return Y[len(Y)-1] + (Y[len(Y)-1] - Y1[len(Y1)-1])/(2**p - 1)

h = 0.1

(X,Y) = shooting_method(h)
(X1, Y1) = shooting_method(2*h)
print("шаг 0.1 = ",X)
print("шаг 0.1 = ", Y)
plt.plot(X,F1(X), c = 'blue', label='Точное')
plt.plot(X, Y, c = 'black', label='h = 0.1')
plt.plot(X1, Y1, color = 'red', label='h = 0.2')
plt.legend()
plt.show()

print(np.fabs(rounge(Y, Y1, 1)-F1(2)))

import numpy as np
import matplotlib.pyplot as plt

eps = 10e-5

def tsolve(a, b, c, d):

    n = len(b)
    a = a[1:] if len(a) == n else a
    c = c[:n - 1] if len(c) == n else c
    (a, b, c, d) = map(lambda x: x.copy(), (a, b, c, d))

    for i in range( 1, n ):
        a[i-1] = a[i-1] / b[i - 1]
        b[i] = b[i] - a[i - 1] * c[i - 1]

    x = np.zeros(n)
    x[0] = d[0]
    for i in range( 1, n ):
        x[i] = d[i] - a[i - 1] * x[i - 1]
    x[n-1] = x[n-1] / b[n - 1]
    for i in range( n-2, -1, -1 ):
        x[i] = ( x[i] - c[i] * x[i+1] ) / b[i]
    return x

#(x*x-1)y'' + (x - 3)y' - y = 0
#y'(0) = 0
#y'(1) + y(1) = -0.75
#

def f1(x, y, z):
    return (y - (x-3)*z) / (x**2 - 1)

def F1(x):
    return x - 3 + 1/(x+1)


def p(x):
    return (x-3)/(x**2 - 1)
def q(x):
    return (-1/(x**2 - 1))

def endsMethod(a, b, h, preprocess=False):
    X = np.arange(a, b + eps, h, dtype=np.float_)
    n = int((b-a)/h) + 1
    a = np.empty(n)
    b = np.empty(n)
    c = np.empty(n)
    d = np.empty(n)
    i = 0
    a[i] = 0
    b[i] = (-1/h)
    c[i] = (1/h)
    d[i] = 0
    i += 1
    for x0 in X[1:n-1]:
        a[i] = (1-p(x0)*h/2)
        b[i] = -2+(h**2)*q(x0)
        c[i] = 1+p(x0)*h/2
        d[i] = 0
        i += 1
    a[i] = (-1/h)
    b[i] = (1 + 1/h)
    c[i] = 0
    d[i] = - 0.75

    Y = tsolve(a, b, c, d)
    plt.plot(X, Y, label="h = "+str(h))

    if(preprocess):
        plt.plot(X, F1(X), c = 'black', label='Точное решение')
        plt.legend()
        plt.show()
    return (X, Y)

def rounge(Y, Y1, p):
    return Y[len(Y)-1] + (Y[len(Y)-1] - Y1[len(Y1)-1])/(2**p - 1)

a = 0
b = 1

h = 0.05

(X, Y1) = endsMethod(a, b, 2*h)
(X,Y)= endsMethod(a, b, h)
print("X =", X)
print("Y =", Y)
print("Rounge:", np.fabs(rounge(Y, Y1, 1)-F1(b)))
(X,Y)= endsMethod(a, b, h/10, True)



