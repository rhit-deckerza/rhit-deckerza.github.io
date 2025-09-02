## Bubble Sort

def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr


## Selection Sort
def selection_sort(arr):
    for k in range (len(arr)):
        index_of_smallest_value = k
        for j in range (k, len(arr)):
            if arr[j] < arr[index_of_smallest_value]:
                index_of_smallest_value = j
        arr[k], arr[index_of_smallest_value] = arr[index_of_smallest_value], arr[k]

def insertion_sort(arr):
    for start_of_unsorted in range (1, len(arr)):
        for j in range (0, start_of_unsorted):
            if arr[start_of_unsorted] < arr[j]:
                k_element = arr.pop(start_of_unsorted)
                arr.insert(j, k_element)
                break

def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[0]
    less = []
    more = []
    for k in range(1, len(arr)):
        if arr[k] < pivot:
            less += [arr[k]]
        else:
            more += [arr[k]]
    return quick_sort(less) + [pivot] + quick_sort(more)
        
            
def test_bubble_sort():
    test_cases = [
        ([], []),
        ([1], [1]),
        ([2, 1], [1, 2]),
        ([3, 2, 1], [1, 2, 3]),
        ([5, 1, 4, 2, 8], [1, 2, 4, 5, 8]),
        ([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]),
        ([5, 4, 3, 2, 1], [1, 2, 3, 4, 5]),
        ([2, 3, 2, 1, 3], [1, 2, 2, 3, 3]),
    ]
    for i, (input_arr, expected) in enumerate(test_cases):
        arr = input_arr.copy()
        bubble_sort(arr)
        print(f"Test case {i+1}:")
        print(f"  Input:    {input_arr}")
        print(f"  Expected: {expected}")
        print(f"  Actual:   {arr}")
        print(f"  Pass:     {arr == expected}\n")
                # Uncomment the following line to run the tests
                # test_bubble_sort()

def test_selection_sort():
    test_cases = [
        ([], []),
        ([1], [1]),
        ([2, 1], [1, 2]),
        ([3, 2, 1], [1, 2, 3]),
        ([5, 1, 4, 2, 8], [1, 2, 4, 5, 8]),
        ([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]),
        ([5, 4, 3, 2, 1], [1, 2, 3, 4, 5]),
        ([2, 3, 2, 1, 3], [1, 2, 2, 3, 3]),
    ]
    for i, (input_arr, expected) in enumerate(test_cases):
        arr = input_arr.copy()
        selection_sort(arr)
        print(f"Selection Sort Test case {i+1}:")
        print(f"  Input:    {input_arr}")
        print(f"  Expected: {expected}")
        print(f"  Actual:   {arr}")
        print(f"  Pass:     {arr == expected}\n")

def test_insertion_sort():
    test_cases = [
        ([], []),
        ([1], [1]),
        ([2, 1], [1, 2]),
        ([3, 2, 1], [1, 2, 3]),
        ([5, 1, 4, 2, 8], [1, 2, 4, 5, 8]),
        ([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]),
        ([5, 4, 3, 2, 1], [1, 2, 3, 4, 5]),
        ([2, 3, 2, 1, 3], [1, 2, 2, 3, 3]),
    ]
    for i, (input_arr, expected) in enumerate(test_cases):
        arr = input_arr.copy()
        insertion_sort(arr)
        print(f"Insertion Sort Test case {i+1}:")
        print(f"  Input:    {input_arr}")
        print(f"  Expected: {expected}")
        print(f"  Actual:   {arr}")
        print(f"  Pass:     {arr == expected}\n")

def test_quick_sort():
    test_cases = [
        ([], []),
        ([1], [1]),
        ([2, 1], [1, 2]),
        ([3, 2, 1], [1, 2, 3]),
        ([5, 1, 4, 2, 8], [1, 2, 4, 5, 8]),
        ([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]),
        ([5, 4, 3, 2, 1], [1, 2, 3, 4, 5]),
        ([2, 3, 2, 1, 3], [1, 2, 2, 3, 3]),
    ]
    for i, (input_arr, expected) in enumerate(test_cases):
        result = quick_sort(input_arr)
        print(f"Quick Sort Test case {i+1}:")
        print(f"  Input:    {input_arr}")
        print(f"  Expected: {expected}")
        print(f"  Actual:   {result}")
        print(f"  Pass:     {result == expected}\n")

test_bubble_sort()
test_selection_sort()
test_insertion_sort()
test_quick_sort()

