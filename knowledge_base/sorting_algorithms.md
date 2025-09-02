# Sorting Algorithms

## Bubble Sort
Repeatedly swaps adjacent elements if out of order.  
Time: O(n^2)  
Extra Space: O(1)

```python
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
```

## Selection Sort
Selects minimum element and swaps to front.  
Time: O(n^2)  
Extra Space: O(1)

```python
def selection_sort(arr):
    for k in range (len(arr)):
        index_of_smallest_value = k
        for j in range (k, len(arr)):
            if arr[j] < arr[index_of_smallest_value]:
                index_of_smallest_value = j
        arr[k], arr[index_of_smallest_value] = arr[index_of_smallest_value], arr[k]
```

## Insertion Sort
Builds sorted array by inserting elements.  
Time: O(n^2)  
Extra Space: O(1)

```python
def insertion_sort(arr):
    for start_of_unsorted in range (1, len(arr)):
        for j in range (0, start_of_unsorted):
            if arr[start_of_unsorted] < arr[j]:
                k_element = arr.pop(start_of_unsorted)
                arr.insert(j, k_element)
                break
```

## Quick Sort
Partition and recurse.  
Time: O(n log n) average, O(n^2) worst  
Extra Space: O(log n)

```python
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
```

## Heap Sort
Builds heap then extracts max.  
Time: O(n log n)  
Extra Space: O(1)

```python
def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and arr[left] > arr[largest]:
        largest = left

    if right < n and arr[right] > arr[largest]:
        largest = right

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)

    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)

    # Extract elements from heap one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)

    return arr
```

## Radix Sort
Sorts by digits using counting sort.  
Time: O(d(n+k))  
Extra Space: O(n+k)


## Bucket Sort
Distributes into buckets then sorts.  
Time: O(n) average  
Extra Space: O(n)


## Counting Sort
Counts occurrences for integers.  
Time: O(n+k)  
Extra Space: O(k)

