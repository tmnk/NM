import numpy as np 

A = np.array([ [  28,   9,  -3,   -7   ],
            [-5, 21,  -5, -3],
            [-8, 1,  -16,   5],
            [  0,  -2, 5, 8]], dtype='float64')
b = np.array([-159.,63.,-45.,24.])


eps = 0.01

a = np.zeros((len(b),len(b)))
for i in range(len(b)):
	for j in range(len(b)):
		if i == j:
			a[i][j] = 0
			continue
		a[i][j] = -A[i][j] / A[i][i]
	b[i] /= A[i][i]

prev, curr = np.zeros(len(b)), np.array(b) 
def dif(a,b):
	return sum(abs(a[i] - b[i]) for i in range(len(b))) 

itr = 0
while dif(curr, prev) >= eps:
	prev = np.array(curr)
	for i in range(len(curr)):
		curr[i] = np.dot(curr, a[i]) + b[i]
	itr += 1
print(curr, itr)





