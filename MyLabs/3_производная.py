import numpy as np
#xq = 0.2
n = 5
xi = [0., 0.1, 0.2, 0.3, 0.4]
yi = np.array([1.0, 1.1052, 1.2214, 1.3499, 1.4918])

xq = 0.2
#xi = [-0.2, 0., 0.2, 0.4, 0.6]
#yi = np.array([-0.20136, 0., 0.20136, 0.41152, 0.64350])

def left(x):
    i = xi.index(x)
    return (yi[i] - yi[i-1])/(xi[i] - xi[i-1])
def right(x):
    i = xi.index(x)
    return (yi[i+1] - yi[i])/(xi[i+1] - xi[i])


def first_derivative(x):
    i = xi.index(x)
    return left(x) + ((right(x) - left(x))/(xi[i+1] - xi[i-1]))*(2*x-xi[i-1]-xi[i])

def second_derivative(x):
    i = xi.index(x)
    return 2.*(right(x) - left(x))/(xi[i+1] - xi[i-1])

print(left(xq))
print(right(xq))
print(first_derivative(xq))
print(second_derivative(xq))