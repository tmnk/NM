import numpy as np
import matplotlib.pyplot as plt

eps = 10e-5

def f1(x, y, z) :
    return (-4*x*z - (4*x**2 + 2)*y)

def F1(x):
    return ((1+x)*np.exp(-x**2))


def euler(x0, y0, z0, h, p = False) :
    X = np.arange(x0, b+h, h)
    if X.max() > np.fabs(2.0 + eps):
        X = np.delete(X, [len(X) - 1])

    Y0 = []
    Y = []
    for x0 in X:
        y1 = y0 + h * z0
        z1 = z0 + h * f1(x0, y0, z0)
        Y0 = np.append(Y0, [y0])
        Y = np.append(Y, [F1(x0)])
        z0 = z1
        y0 = y1


    if p == False:
        plt.axhline(0, color='black')
        plt.axvline(0, color='black')
        plt.grid(True)
        plt.plot(X, Y)
        plt.plot(X, Y0, color = 'black')
        plt.show()

    return (X, Y0)

def rounge(Y, Y1, p):
    return Y[len(Y)-1] + (Y[len(Y)-1] - Y1[len(Y1)-1])/(2**p - 1)


def roungeKutt(x0, b, y0, z0, h, p = False):
    X = np.arange(x0, b+h, h, dtype=np.float_)
    if X.max() > np.fabs(b + eps):
        X = np.delete(X, [len(X) - 1])

    Y0 = []
    Y = []
    Z = []
    for x0 in X :
        Y0 = np.append(Y0, [y0])
        Y = np.append(Y, [F1(x0)])
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

    if p == False :
        plt.axhline(0, color='black')
        plt.axvline(0, color='black')
        plt.grid(True)
        plt.plot(X, Y,color = 'blue')
        plt.plot(X, Y0, color = 'black')

        plt.show()
    return (X, Y0, Z)


def adams(x0, y0, z0, h, p= False):
    (_, f, z) = roungeKutt(x0, x0 + 3*h, y0, z0, h, True)
    X = np.arange(x0, b + h, h, dtype=np.float_)
    if X.max() > np.fabs(2.0 + eps):
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

    for x0 in X[4::]:
        y1 = y0 + h*np.dot(coeff, z)
        z1 = z0 + h*np.dot(coeff, F)
        z = np.append([z1], z[0:3])
        F = np.append([f1(x0, y1, z1)], F[0:3])
        y0 = y1
        z0 = z1
        Y0 = np.append(Y0, [y0])
        Z0 = np.append(Z0, [z0])
        Y  = np.append(Y, [F1(x0)])

    if p == False:
        plt.axhline(0, color='black')
        plt.axvline(0, color='black')
        plt.grid(True)
        plt.plot(X, Y, color = 'black')
        plt.plot(X, Y0, color = 'blue')
        plt.show()

    return (X, Y0, Z0)


a = 0.
b = 1.
h = 0.1

x = a
y = 1
z = 1

(X, Y) = euler(x, y, z, h)
(X1, Y1) = euler(x, y, z, 2*h,True)
print("Rounge for Euler method : ", np.fabs(rounge(Y, Y1, 1)-F1(b)))

(X,Y, _) = roungeKutt(x, b, y, z, h)
(X, Y1, _) = roungeKutt(x, b, y, z, 2*h, True)
print("Rounge for Rounge-Kutt method : ", np.fabs(rounge(Y, Y1, 4)-F1(b)))

(X, Y, _) = adams(x, y, z, h)
(X, Y1, _) = adams(x, y, z, 2*h, True)
print("Rounge for Adams method : ", np.fabs(rounge(Y, Y1, 4)-F1(b)))


