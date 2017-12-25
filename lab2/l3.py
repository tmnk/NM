import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import tkinter as tk
import tkinter.ttk as ttk


x0 = 0
xl = np.pi / 2
y0 = 0
yl = np.pi / 2
It = np.empty(0)
E = np.empty(0)


def phi_y(x, y):
    if x == 0:
        return np.cos(y)
    if x == np.pi / 2:
        return 0


def phi_x(x, y):
    if y == 0:
        return np.cos(x)
    if y == np.pi / 2:
        return 0


def U(x, y):
    return np.cos(x)*np.cos(y)


def norm(u, v):
    z = u - v
    max_el = 0
    n = np.shape(z)[0]
    m = np.shape(z)[1]
    for i in range(n):
        for j in range(m):
            if np.fabs(z[i][j]) > max_el:
                max_el = np.fabs(z[i][j])
    return max_el


def linear_interpolation(nx, ny, hx, hy):
    u0 = np.empty([nx+1, ny+1])

    x = 0
    y = 0
    for i in range(nx+1):
        u0[i][0] = phi_x(x, 0)
        u0[i][ny] = phi_x(x, yl)
        x += hx

    for j in range(ny+1):
        u0[0][j] = phi_y(0, y)
        u0[nx][j] = phi_y(xl, y)
        y += hy

    y = hx
    for j in range(1, ny):
        x = hx
        for i in range(1, nx):
            u0[i][j] = phi_y(0, y) + phi_y(xl, y)*x/xl
            x += hx
        y += hy

    return u0


def recalc(u, nx, ny, hx, hy, method):
    u_new = u.copy()
    w = 1.9
    for j in range(1, ny):
        for i in range(1, nx):
            if method == 'lol':
                u_new[i][j] = (-2 * u[i+1][j] / hx - u[i+1][j] / hx ** 2 -
                               u[i-1][j] / hx ** 2 - u[i][j+1]/hy**2 -
                               u[i][j-1]/hy**2) / (3 - 2 / hx - 2 / hx**2 -
                                                   2 / hy**2)

            if method == 'kek':
                u_new[i][j] = (-2 * u[i+1][j] / hx - u[i+1][j] / hx ** 2 -
                               u_new[i-1][j] / hx ** 2 - u[i][j+1]/hy**2 -
                               u_new[i][j-1]/hy**2) / (3 - 2 / hx - 2 / hx**2 -
                                                       2 / hy**2)

            if method == 'cheburek':
                u_new[i][j] = (1 - w)*u[i][j] + w*(-2 * u[i+1][j] / hx - u[i+1][j] / hx ** 2 -
                               u_new[i-1][j] / hx ** 2 - u[i][j+1]/hy**2 -
                               u_new[i][j-1]/hy**2) / (3 - 2 / hx - 2 / hx**2 -
                                                       2 / hy**2)

    return u_new


def solver():
    nx = int(10)
    ny = int(10)
    eps = float(0.1)

    method = 'cheburek'
    hx = (xl - x0) / nx
    hy = (yl - y0) / ny

    X = np.arange(x0, xl+hx, hx, dtype=np.float_)
    Y = np.arange(y0, yl+hy, hy, dtype=np.float_)

    if len(X) > nx + 1:
        X = X[0:-1]

    if len(Y) > ny + 1:
        Y = Y[0:-1]

    F = np.empty([nx+1, ny+1])
    x = 0
    y = 0
    for j in range(ny+1):
        x = 0
        for i in range(nx+1):
            F[i][j] = U(x, y)
            x += hx
        y += hy

    u = linear_interpolation(nx, ny, hx, hy)
    norm_val = 1
    k = 0
    global It, E
    It = np.empty(0)
    E = np.empty(0)

    while norm_val > eps:
        v = u.copy()
        u = recalc(u, nx, ny, hx, hy, method)
        norm_val = norm(u, v)
        #print(norm_val)
        It = np.append(It, k)
        E = np.append(E, norm_val)
        k += 1

    X, Y = np.meshgrid(X, Y)
    fig = plt.figure()
    ax = fig.gca(projection='3d')
    F = np.transpose(F)
    u = np.transpose(u)
    ax.plot_surface(X, Y, F, color='blue')
    ax.plot_surface(X, Y, u, color='green')
    plt.show()

solver()