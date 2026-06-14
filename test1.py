"""
Utility toolkit demonstrating a variety of distinct Python techniques:
data structures, algorithms, OOP, decorators, generators, and more.
"""

import functools
import time
import random
import json
from collections import defaultdict, deque
from dataclasses import dataclass, field


# ── 1. Decorators ────────────────────────────────────────────────────────────

def timed(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.6f}s")
        return result
    return wrapper


def memoize(func):
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper


# ── 2. Recursion + memoization ──────────────────────────────────────────────

@memoize
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


def gcd(a, b):
    while b:
        a, b = b, a % b
    return a


# ── 3. Sorting algorithms ────────────────────────────────────────────────────

def quicksort(items):
    if len(items) <= 1:
        return items
    pivot = items[len(items) // 2]
    left  = [x for x in items if x < pivot]
    mid   = [x for x in items if x == pivot]
    right = [x for x in items if x > pivot]
    return quicksort(left) + mid + quicksort(right)


def insertion_sort(items):
    items = items[:]
    for i in range(1, len(items)):
        key = items[i]
        j = i - 1
        while j >= 0 and items[j] > key:
            items[j + 1] = items[j]
            j -= 1
        items[j + 1] = key
    return items


# ── 4. Searching ─────────────────────────────────────────────────────────────

def binary_search(items, target):
    lo, hi = 0, len(items) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1


# ── 5. Graph traversal (BFS/DFS) ─────────────────────────────────────────────

class Graph:
    def __init__(self):
        self.adjacency = defaultdict(list)

    def add_edge(self, u, v):
        self.adjacency[u].append(v)
        self.adjacency[v].append(u)

    def bfs(self, start):
        visited, order, queue = {start}, [], deque([start])
        while queue:
            node = queue.popleft()
            order.append(node)
            for neighbor in self.adjacency[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        return order

    def dfs(self, start, visited=None):
        if visited is None:
            visited = set()
        visited.add(start)
        order = [start]
        for neighbor in self.adjacency[start]:
            if neighbor not in visited:
                order.extend(self.dfs(neighbor, visited))
        return order


# ── 6. Generators / iterators ────────────────────────────────────────────────

def primes_up_to(limit):
    sieve = [True] * (limit + 1)
    sieve[0:2] = [False, False]
    for num in range(2, int(limit ** 0.5) + 1):
        if sieve[num]:
            for multiple in range(num * num, limit + 1, num):
                sieve[multiple] = False
    for num, is_prime in enumerate(sieve):
        if is_prime:
            yield num


def sliding_window(iterable, size):
    window = deque(maxlen=size)
    for item in iterable:
        window.append(item)
        if len(window) == size:
            yield tuple(window)


# ── 7. Dataclasses + OOP ──────────────────────────────────────────────────────

@dataclass
class Employee:
    name: str
    department: str
    salary: float
    skills: list = field(default_factory=list)

    def annual_salary(self):
        return self.salary * 12

    def has_skill(self, skill):
        return skill.lower() in (s.lower() for s in self.skills)


class Company:
    def __init__(self, name):
        self.name = name
        self.employees = []

    def hire(self, employee):
        self.employees.append(employee)

    def total_payroll(self):
        return sum(e.annual_salary() for e in self.employees)

    def find_by_skill(self, skill):
        return [e for e in self.employees if e.has_skill(skill)]

    def department_breakdown(self):
        breakdown = defaultdict(int)
        for e in self.employees:
            breakdown[e.department] += 1
        return dict(breakdown)


# ── 8. String processing ─────────────────────────────────────────────────────

def word_frequencies(text):
    counts = defaultdict(int)
    for word in text.lower().split():
        cleaned = "".join(ch for ch in word if ch.isalnum())
        if cleaned:
            counts[cleaned] += 1
    return dict(sorted(counts.items(), key=lambda kv: -kv[1]))


def is_palindrome(s):
    cleaned = [ch.lower() for ch in s if ch.isalnum()]
    return cleaned == cleaned[::-1]


# ── 9. JSON / data shaping ────────────────────────────────────────────────────

def build_report(company):
    return json.dumps({
        "company": company.name,
        "headcount": len(company.employees),
        "total_payroll": company.total_payroll(),
        "departments": company.department_breakdown(),
    }, indent=2)


# ── 10. Demo entry point ──────────────────────────────────────────────────────

@timed
def main():
    print("Fibonacci(20):", fibonacci(20))
    print("GCD(48, 18):", gcd(48, 18))

    nums = [random.randint(1, 100) for _ in range(10)]
    print("Original:", nums)
    print("Quicksort:", quicksort(nums))
    print("Insertion sort:", insertion_sort(nums))

    sorted_nums = sorted(nums)
    target = sorted_nums[3]
    print(f"Binary search for {target}:", binary_search(sorted_nums, target))

    g = Graph()
    for a, b in [(1, 2), (1, 3), (2, 4), (3, 4), (4, 5)]:
        g.add_edge(a, b)
    print("BFS from 1:", g.bfs(1))
    print("DFS from 1:", g.dfs(1))

    print("Primes < 30:", list(primes_up_to(30)))
    print("Sliding windows:", list(sliding_window(range(6), 3)))

    company = Company("Acme Corp")
    company.hire(Employee("Alice", "Engineering", 9000, ["python", "sql"]))
    company.hire(Employee("Bob", "Sales", 6000, ["negotiation"]))
    company.hire(Employee("Cara", "Engineering", 9500, ["python", "rust"]))

    print("Python devs:", [e.name for e in company.find_by_skill("python")])
    print(build_report(company))

    text = "A man a plan a canal Panama"
    print("Palindrome check:", is_palindrome(text))
    print("Word frequencies:", word_frequencies("the quick brown fox the lazy fox"))


if __name__ == "__main__":
    main()
