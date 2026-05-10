export interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];       // first 4 are real answers, last is always "I don't know"
  correctIndex: number;    // 0-3 (never points to the "I don't know" option)
  explanation: string;
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert';
  points: number;
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // ── BASIC (1 pt each, IDs 1-5) ──────────────────────────────────────────────
  {
    id: 1,
    question: 'What does `len([1, 2, 3])` return?',
    options: ['2', '3', '4', '1', "🤷 I don't know this one"],
    correctIndex: 1,
    explanation:
      '`len()` counts the number of items in a list. The list [1, 2, 3] has 3 items, so `len([1, 2, 3])` returns 3.',
    difficulty: 'basic',
    points: 1,
  },
  {
    id: 2,
    question: 'Which line of code prints the numbers 1 to 5?',
    options: [
      'for i in range(5):',
      'for i in range(1, 6):',
      'while i < 5:',
      'for i in range(6):',
      "🤷 I don't know this one",
    ],
    correctIndex: 1,
    explanation:
      '`range(1, 6)` generates numbers starting at 1 and stopping before 6, giving you 1, 2, 3, 4, 5. `range(5)` starts at 0, so it would give 0-4 instead.',
    difficulty: 'basic',
    points: 1,
  },
  {
    id: 3,
    question: 'Which keyword is used to define a function in Python?',
    options: ['func', 'def', 'function', 'define', "🤷 I don't know this one"],
    correctIndex: 1,
    explanation:
      'In Python, you use the `def` keyword to define a function. For example: `def my_function():` starts a new function called my_function.',
    difficulty: 'basic',
    points: 1,
  },
  {
    id: 4,
    question: 'What is the value of `"hello"[1]`?',
    options: ['h', 'e', 'l', 'he', "🤷 I don't know this one"],
    correctIndex: 1,
    explanation:
      'Python indexes strings starting at 0. So index 0 is "h", index 1 is "e", index 2 is "l", and so on. `"hello"[1]` gives us "e".',
    difficulty: 'basic',
    points: 1,
  },
  {
    id: 5,
    question: 'How do you add the number 7 to a list called `nums`?',
    options: ['nums.add(7)', 'nums.append(7)', 'nums.push(7)', 'nums.insert(7)', "🤷 I don't know this one"],
    correctIndex: 1,
    explanation:
      '`append()` is the correct list method to add a single item to the end of a list in Python. `add()` is used for sets, `push()` does not exist in Python, and `insert()` requires a position index as its first argument.',
    difficulty: 'basic',
    points: 1,
  },

  // ── INTERMEDIATE (2 pts each, IDs 6-10) ─────────────────────────────────────
  {
    id: 6,
    question: 'What does `{"a": 1, "b": 2}.get("c", 0)` return?',
    options: ['None', 'Error', '0', '"c"', "🤷 I don't know this one"],
    correctIndex: 2,
    explanation:
      'The dictionary `.get(key, default)` method returns the value for the key if it exists, or the default value if it does not. Since "c" is not in the dictionary, it returns the default value 0 instead of raising a KeyError.',
    difficulty: 'intermediate',
    points: 2,
  },
  {
    id: 7,
    question: 'What is the result of `[1, 2, 3, 4, 5][1:4]`?',
    options: ['[1, 2, 3]', '[2, 3, 4]', '[2, 3, 4, 5]', '[1, 2, 3, 4]', "🤷 I don't know this one"],
    correctIndex: 1,
    explanation:
      'List slicing with `[1:4]` starts at index 1 (which is 2) and goes up to but does not include index 4 (which is 5). So you get the elements at indexes 1, 2, and 3 — which are 2, 3, and 4.',
    difficulty: 'intermediate',
    points: 2,
  },
  {
    id: 8,
    question: 'Which code correctly creates the string "Hello, Alice!"?',
    options: [
      '"Hello," + Alice',
      'f"Hello, {Alice}!"',
      "f\"Hello, {'Alice'}!\"",
      '"Hello, " + \'Alice\' + \'!\'',
      "🤷 I don't know this one",
    ],
    correctIndex: 2,
    explanation:
      "In an f-string, variable names go inside curly braces `{}`. To embed a literal string like 'Alice' directly inside an f-string, you wrap it in quotes inside the braces: `{'Alice'}`. Option A is missing quotes around Alice, and option B treats Alice as a variable name.",
    difficulty: 'intermediate',
    points: 2,
  },
  {
    id: 9,
    question: 'What does a `try / except` block do in Python?',
    options: [
      'Defines a function',
      'Loops through items in a list',
      'Handles errors so the program does not crash',
      'Creates a new class',
      "🤷 I don't know this one",
    ],
    correctIndex: 2,
    explanation:
      '`try / except` is Python\'s way of handling errors gracefully. Code inside `try` is attempted, and if an error (exception) occurs, the code inside `except` runs instead of crashing the whole program.',
    difficulty: 'intermediate',
    points: 2,
  },
  {
    id: 10,
    question: 'What is the purpose of `__init__` inside a Python class?',
    options: [
      'It deletes the object when you are done with it',
      'It initialises a new object with its starting values',
      'It prints the object to the screen',
      'It imports a module into the class',
      "🤷 I don't know this one",
    ],
    correctIndex: 1,
    explanation:
      '`__init__` is a special method called automatically when you create a new object from a class. It sets up the object\'s initial state — for example, storing values passed in as arguments into the object\'s attributes.',
    difficulty: 'intermediate',
    points: 2,
  },

  // ── ADVANCED (3 pts each, IDs 11-15) ────────────────────────────────────────
  {
    id: 11,
    question: 'What does `[x**2 for x in range(4)]` produce?',
    options: ['[1, 4, 9, 16]', '[0, 1, 4, 9]', '[0, 2, 4, 6]', '[0, 1, 2, 3]', "🤷 I don't know this one"],
    correctIndex: 1,
    explanation:
      '`range(4)` gives 0, 1, 2, 3. The list comprehension squares each value: 0²=0, 1²=1, 2²=4, 3²=9. So the result is [0, 1, 4, 9]. Note that range(4) starts at 0, not 1.',
    difficulty: 'advanced',
    points: 3,
  },
  {
    id: 12,
    question: 'What does using `*args` in a function definition allow you to do?',
    options: [
      'Return multiple values from the function',
      'Accept any number of positional arguments',
      'Accept any number of keyword arguments',
      'Automatically unpack a list before calling the function',
      "🤷 I don't know this one",
    ],
    correctIndex: 1,
    explanation:
      '`*args` lets a function accept any number of positional arguments. All the extra arguments are collected into a tuple called `args`. This is useful when you do not know in advance how many arguments the caller will pass.',
    difficulty: 'advanced',
    points: 3,
  },
  {
    id: 13,
    question: 'What does `with open("file.txt") as f:` do?',
    options: [
      'Opens the file but never closes it',
      'Opens the file and automatically closes it when the block finishes',
      'Creates a new file and then opens it',
      'Reads all the lines of the file into a list',
      "🤷 I don't know this one",
    ],
    correctIndex: 1,
    explanation:
      'The `with` statement is a context manager. When used with `open()`, it automatically closes the file when the indented block ends — even if an error occurs. This prevents resource leaks and is considered best practice for file handling.',
    difficulty: 'advanced',
    points: 3,
  },
  {
    id: 14,
    question: 'What does `super().__init__()` do inside a child class?',
    options: [
      "Calls the current class's own __init__ again",
      "Calls a sibling class's __init__",
      "Calls the parent class's __init__ method",
      "Calls Python's built-in object initialiser directly by name",
      "🤷 I don't know this one",
    ],
    correctIndex: 2,
    explanation:
      '`super()` returns a reference to the parent (or "super") class. Calling `super().__init__()` runs the parent class\'s initialiser, which lets the child class inherit the parent\'s setup code without rewriting it.',
    difficulty: 'advanced',
    points: 3,
  },
  {
    id: 15,
    question: 'Which dunder (magic) method controls how an object is displayed when you use `print()` on it?',
    options: ['__init__', '__repr__', '__str__', '__print__', "🤷 I don't know this one"],
    correctIndex: 2,
    explanation:
      '`__str__` is called by `print()` and `str()` to get a human-readable string representation of an object. `__repr__` is meant for developers and debugging. `__print__` does not exist in Python.',
    difficulty: 'advanced',
    points: 3,
  },

  // ── EXPERT (4 pts each, IDs 16-20) ──────────────────────────────────────────
  {
    id: 16,
    question: 'What does a decorator do in Python?',
    options: [
      'Changes the colour of text in the terminal',
      'Wraps a function to extend or modify its behaviour',
      'Adds a special attribute to a class',
      'Makes a function run faster automatically',
      "🤷 I don't know this one",
    ],
    correctIndex: 1,
    explanation:
      'A decorator is a function that takes another function as input, adds some extra behaviour around it, and returns the modified function. You apply a decorator using the `@decorator_name` syntax placed above the function definition.',
    difficulty: 'expert',
    points: 4,
  },
  {
    id: 17,
    question: 'A function that calls itself is called what?',
    options: ['Iterative', 'Recursive', 'Lambda', 'Generator', "🤷 I don't know this one"],
    correctIndex: 1,
    explanation:
      'A recursive function is one that calls itself as part of its own body. It must have a base case that stops the recursion, otherwise it would call itself forever. Classic examples include calculating factorials or traversing a folder tree.',
    difficulty: 'expert',
    points: 4,
  },
  {
    id: 18,
    question: 'What is `lambda x: x * 2`?',
    options: [
      'A class method',
      'A for loop in disguise',
      'An anonymous (nameless) function',
      'A decorator',
      "🤷 I don't know this one",
    ],
    correctIndex: 2,
    explanation:
      'A `lambda` expression creates a small, anonymous function — a function without a name. `lambda x: x * 2` takes one argument `x` and returns `x * 2`. It is equivalent to writing `def f(x): return x * 2` but as a one-liner.',
    difficulty: 'expert',
    points: 4,
  },
  {
    id: 19,
    question: 'What does the `yield` keyword do inside a function?',
    options: [
      'Returns a value and immediately ends the function',
      'Pauses the function and returns a value, then resumes from the same point next time',
      'Raises an exception and stops execution',
      'Imports a value from another module',
      "🤷 I don't know this one",
    ],
    correctIndex: 1,
    explanation:
      'When a function contains `yield`, it becomes a generator. Each time `yield` is hit, the function pauses and sends a value to the caller. On the next call, execution resumes right after the `yield`. This lets you produce a sequence of values one at a time without building the whole list in memory.',
    difficulty: 'expert',
    points: 4,
  },
  {
    id: 20,
    question: 'For binary search to work correctly, the list must be:',
    options: [
      'Reversed (highest to lowest)',
      'In a random order',
      'Sorted (in order)',
      'Containing only unique values',
      "🤷 I don't know this one",
    ],
    correctIndex: 2,
    explanation:
      'Binary search works by repeatedly halving the search space — it looks at the middle item and decides whether the target is to the left or right. This only makes sense if the list is sorted, because otherwise there is no reliable way to know which half to search next.',
    difficulty: 'expert',
    points: 4,
  },
];

// Given total points scored, return the id of the module to start on
export function getStartingModule(score: number, maxScore: number): string {
  const pct = score / maxScore;
  if (pct < 0.3) return 'supercharged-variables';
  if (pct < 0.55) return 'function-superpowers';
  if (pct < 0.75) return 'error-defender';
  if (pct < 0.90) return 'comprehension-magic';
  return 'decorator-workshop';
}
