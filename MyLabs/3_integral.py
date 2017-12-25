import numpy as np
#import math as m
from math import log
from sympy import *
x = symbols('x')

left = -1.
right = 1.
h1 = 0.5
h2 = 0.25
k = 2.

def f(x):
    #return x/((3.*x + 4.)**2)
    return x /((2*x + 7)*(3*x + 4))

def integr():
    return integrate(f(x), (x,-1.,1.))
    
True_integral = integr()
print("Точное значениие интеграла", True_integral)

def make_xi(left, right, step):
    return np.arange(left, right + step, step)

def make_yi(xi):
    return [x for x in map(lambda x: f(x), xi)]

def RRR(Fh, Fkh, k):
    return Fh + (Fh-Fkh)/(k**2-1)

def rect(xi, h, c):
    if c == 0:
        return 0
    tmp = xi[:c].copy()
    res = 0
    for i in range(len(tmp)):
        res += f((xi[i] + xi[i+1])/2)
    return res*h

def make_rect(left, right, h):
    xi = make_xi(left, right, h)
    #print(xi)
    yi = make_yi(xi)    
    #print(yi)
    return [x for x in map(lambda x: rect(xi, h, int(np.where(xi==x)[0])), xi)]

# Метод прямоугольников

print("\nМетод прямоугольников:")
Fkh = make_rect(left, right, h1)[-1]
Fh = make_rect(left, right, h2)[-1]
print(" при шаге",h1, Fkh)
print(" при шаге",h2, Fh)

rrr = RRR(Fh, Fkh, k)
print("ПОгрешность: ", rrr)
#print("абсолютная погрешность", abs(True_integral - rrr))

# Метод трапеции

def trap(xi, h, c):
    if c == 0:
        return 0
    tmp = xi[:c].copy()
    res = 0
    for i in range(len(tmp)+1):
        if i == 0 or i == (len(tmp)):
            res += f(xi[i])/2
        else:
            res += f(xi[i])
    return h*res

def make_trap(left, right, h):
    xi = make_xi(left, right, h)
    #print(xi)

    yi = make_yi(xi)    
    #print(yi)
    return [x for x in map(lambda x: trap(xi, h, int(np.where(xi==x)[0])), xi)]

print("\nМетод трапеций:")
Fkh = make_trap(left, right, h1)[-1]
Fh = make_trap(left, right, h2)[-1]
print(" при шаге",h1, Fkh)
print(" при шаге",h2, Fh)

rrr = RRR(Fh, Fkh, k)
print("Погрешность: ", rrr)
#print("абсолютная погрешность", abs(True_integral - rrr))

# Метод Симпсона
def sim(xi, h, c):
    if c == 0:
        return 0
    tmp = xi[:c].copy()
    res = 0
    for i in range(len(tmp)+1):
        if i == 0 or i == (len(tmp)):
            res += f(xi[i])
        elif i%2 == 0:
            res += 2*f(xi[i])
        elif i%2 != 0:
            res += 4*f(xi[i])
    return h*res/3
Simpson = []

def make_sim(left, right, h):
    xi = make_xi(left, right, h)
    #print(xi)

    yi = make_yi(xi)    
    #print(yi)
    res = np.array((len(xi)/2)+1)
    for i in range(len(xi)):
        if i%2 == 0:
            Simpson.append(sim(xi,h,i))
    return Simpson

print("\nМетод Симпсона:")
Fkh = make_sim(left, right, h1)[-1]
Fh = make_sim(left, right, h2)[-1]
print(" при шаге",h1, Fkh)
print(" при шаге",h2, Fh)

rrr = RRR(Fh, Fkh, k)
print("Погрешность: ", rrr)

#print("абсолютная погрешность", abs(True_integral - rrr))