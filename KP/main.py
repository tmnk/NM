import matplotlib.pyplot as plt
from math import *
A1,A2,A3 = 1.,0.5,15.
h = 0.01
y0 = 0.3
x0 = 0
x12,y12,yk,xk,dtyk,tyk = [],[],[],[],[],[]

def f(y,yl):  #формула
    return A2 - A1*y - yl*yl
def tr(x): #зависет от шага и запаз. арг.
    return int(x/(h/2) + A3/(h/2))
    
def CRy12(x, y, yl):
    return y + h/2 * f(y, yl)
def CRyk(yk, y12, yd):
    return yk + h * f(y12, yd)#A1 * y12 * (1 - yd / A3)

Time = 25000
class Array:
    def __init__(self):
        self.arr = [0 for i in range(Time * 3 + int(A3/(h/2)))]
        b = - A3 #A3 - запаздывающий коефицент
        while b <= 0:
            self.arr[tr(round(b,3))] = y0
            b += h/2
    def i(self, t):
        return self.arr[int(tr(round(t,3)))]    
    def add(self, t, data):
        self.arr[tr(round(t,3))] = data

k = 1
A1,A2,A3 = 1.5,0.5,10.
for j in range(1):
	a = Array()
	x = x0
	for i in range(Time):
	    x12 = x + h / 2 
	    a.add(x12, CRy12(x, a.i(x), a.i(x-A3)))
	    a.add(x12 + h/2, CRyk(a.i(x), a.i(x12), a.i(x12-A3)))
	    ty = a.i(x12-A3)
	    x += h 
	A2 += 0.5
	x = [h * i for i in range(Time)]
	y = [a.i(i) for i in x]
	plt.plot(x, y)
A1,A2,A3 = 1.,0.5,15.
for j in range(1):
	a = Array()
	x = x0
	for i in range(Time):
	    x12 = x + h / 2 
	    a.add(x12, CRy12(x, a.i(x), a.i(x-A3)))
	    a.add(x12 + h/2, CRyk(a.i(x), a.i(x12), a.i(x12-A3)))
	    ty = a.i(x12-A3)
	    x += h 
	A2 += 0.5
	x = [h * i for i in range(Time)]
	y = [a.i(i) for i in x]
	plt.plot(x, y)
plt.show()
A1,A2,A3 = 1.5,2.5,10.
for j in range(1):
	a = Array()
	x = x0
	for i in range(Time):
	    x12 = x + h / 2 
	    a.add(x12, CRy12(x, a.i(x), a.i(x-A3)))
	    a.add(x12 + h/2, CRyk(a.i(x), a.i(x12), a.i(x12-A3)))
	    ty = a.i(x12-A3)
	    x += h 
	A2 += 0.5
	x = [h * i for i in range(Time)]
	y = [a.i(i) for i in x]
	plt.plot(x, y)
A1,A2,A3 = 1.,1.,15.
for j in range(1):
	a = Array()
	x = x0
	for i in range(Time):
	    x12 = x + h / 2 
	    a.add(x12, CRy12(x, a.i(x), a.i(x-A3)))
	    a.add(x12 + h/2, CRyk(a.i(x), a.i(x12), a.i(x12-A3)))
	    ty = a.i(x12-A3)
	    x += h 
	A2 += 0.5
	x = [h * i for i in range(Time)]
	y = [a.i(i) for i in x]
	plt.plot(x, y)
plt.show()
A1,A2,A3 = 1.5,4.5,10.
for j in range(1):
	a = Array()
	x = x0
	for i in range(Time):
	    x12 = x + h / 2 
	    a.add(x12, CRy12(x, a.i(x), a.i(x-A3)))
	    a.add(x12 + h/2, CRyk(a.i(x), a.i(x12), a.i(x12-A3)))
	    ty = a.i(x12-A3)
	    x += h 
	A2 += 0.5
	x = [h * i for i in range(Time)]
	y = [a.i(i) for i in x]
	plt.plot(x, y)
x = [h * i for i in range(Time)]
plt.show()
