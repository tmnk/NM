A1,A2,A3 = 1.6,0.5,10.
h = 0.2
y0 = 2.
x0 = 0
x12,y12,yk,xk,dtyk,tyk = [],[],[],[],[],[]

def f(y,yl):  #формула
    return A1*y*(1. - yl/A3)
def tr(x): #зависет от шага и запаз. арг.
    return int(x/(h/2) + 5.)
    
def CRy12(x, y, yl):
    return y + h/2 * f(y, yl)
def CRyk(yk, y12, yd):
    return yk + h * f(y12, yd)#A1 * y12 * (1 - yd / A3)
class Array:
    def __init__(self):
        self.arr = [0 for i in range(100)]
        b = - A2 #A2 - запаздывающий коефицент
        while b <= 0:
            self.arr[tr(round(b,3))] = y0
            b += h/2
    def i(self, t):
        return self.arr[int(tr(round(t,3)))]    
    def add(self, t, data):
        self.arr[tr(round(t,3))] = data
a = Array()
x = x0
for i in range(5):
    x12 = x + h / 2 
    a.add(x12, CRy12(x, a.i(x), a.i(x-A2)))
    a.add(x12 + h/2, CRyk(a.i(x), a.i(x12), a.i(x12-A2)))
    # print(x12, a.i(x12), a.i(x12+h/2))
    ty = a.i(x12-A2)
    # print(x12,a.i(x12), ty)
    print(h*f(a.i(x12), ty))
    x += h 
    print('---------------')