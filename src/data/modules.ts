export interface CodeChallenge {
  prompt: string;
  starterCode: string;
  hints: string[];
  sampleSolution: string;
}

export interface ModuleSection {
  title: string;
  content: string;
  code?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  xpReward: number;
  estimatedMinutes: number;
  prerequisites: string[];
  description: string;
  whatYoullLearn: string[];
  sections: ModuleSection[];
  quiz: QuizQuestion[];
  codeChallenge: CodeChallenge;
}

export const MODULES: Module[] = [
  // ─── MODULE 1 ───────────────────────────────────────────────────────────────
  {
    id: 'supercharged-variables',
    title: 'Supercharged Variables',
    subtitle: 'Level up your variable skills',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-500',
    difficulty: 'beginner',
    xpReward: 150,
    estimatedMinutes: 15,
    prerequisites: [],
    description: 'Go beyond simple variables and discover how Python stores different kinds of data. Learn about types, multiple assignment, and how to check and change what type something is.',
    whatYoullLearn: [
      'How Python figures out what type a variable is',
      'Assigning multiple variables at once',
      'Converting between types like int, float, and str',
      'Using type() and isinstance() to inspect your data',
    ],
    sections: [
      {
        title: 'What Is a Variable Really?',
        content: 'A variable is like a labelled box that holds a piece of data. In Python, the label can point to any kind of data — a number, some text, or even a whole list. Python is clever enough to figure out what kind of data you put in the box without you having to tell it. This is called dynamic typing, and it makes Python very easy to write.',
        code: `# Python figures out the type on its own
score = 42          # int  (whole number)
temperature = 36.6  # float (decimal number)
name = "Alex"       # str  (text)
is_winner = True    # bool (True or False)

# Check the type of any variable
print(type(score))        # <class 'int'>
print(type(temperature))  # <class 'float'>
print(type(name))         # <class 'str'>
print(type(is_winner))    # <class 'bool'>`,
      },
      {
        title: 'Multiple Assignment & Swapping',
        content: 'Python lets you assign several variables on a single line, which saves a lot of typing. You can even swap the values of two variables in one line — no temporary variable needed! This trick works because Python evaluates the right side completely before doing any assignments.',
        code: `# Assign multiple variables at once
x, y, z = 10, 20, 30
print(x, y, z)   # 10 20 30

# All point to the same value
a = b = c = 0
print(a, b, c)   # 0 0 0

# Swap two variables in ONE line (Python magic!)
first = "Alice"
second = "Bob"
first, second = second, first
print(first, second)   # Bob Alice

# Unpack a list into variables
coords = [51.5, -0.1]
latitude, longitude = coords
print(latitude, longitude)  # 51.5 -0.1`,
      },
      {
        title: 'Type Conversion (Casting)',
        content: 'Sometimes you have data in one type but you need it in another. For example, when a user types a number it arrives as text (a string), so you must convert it to an int or float before doing maths. Python provides built-in functions like int(), float(), str(), and bool() to do this conversion, which is called casting.',
        code: `# Convert string input to a number
age_text = "11"
age = int(age_text)
print(age + 1)        # 12

# Float to int chops off the decimal
price = float("3.99")
print(int(price))     # 3

# Number to string so we can join text
score = 250
message = "Your score is " + str(score) + " points!"
print(message)

# Check type before converting
value = "42"
if isinstance(value, str):
    value = int(value)
print(value * 2)      # 84`,
      },
    ],
    quiz: [
      {
        question: 'What does type("hello") return?',
        options: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'bool'>"],
        correctIndex: 1,
        explanation: '"hello" is text, so its type is str (string).',
      },
      {
        question: 'What is the result of: a, b = 5, 10  then  a, b = b, a  then  print(a)?',
        options: ['5', '10', 'Error', 'None'],
        correctIndex: 1,
        explanation: 'After the swap, a gets the old value of b which is 10.',
      },
      {
        question: 'Which function converts the string "3.14" into a decimal number?',
        options: ['int("3.14")', 'float("3.14")', 'str("3.14")', 'bool("3.14")'],
        correctIndex: 1,
        explanation: 'float() converts a string to a floating-point (decimal) number.',
      },
      {
        question: 'What does isinstance(7, int) return?',
        options: ['False', '"int"', 'True', '7'],
        correctIndex: 2,
        explanation: '7 is an integer, so isinstance(7, int) returns True.',
      },
      {
        question: 'If score = 99, how do you join it with the string "Score: "?',
        options: ['"Score: " + score', '"Score: " + str(score)', 'str("Score: ") + score', '"Score: " & score'],
        correctIndex: 1,
        explanation: 'You must convert score to a string with str() before joining it with +.',
      },
    ],
    codeChallenge: {
      prompt: 'Create a temperature converter. Set a variable called celsius to any number you like, then convert it to Fahrenheit using the formula F = C * 9/5 + 32, and print a friendly message with the result rounded to 1 decimal place.',
      starterCode: `# Temperature Converter
# Formula: Fahrenheit = Celsius * 9/5 + 32

celsius = 100  # Change this to any temperature you like!

# Step 1: Apply the formula to get fahrenheit
# Step 2: Round the result to 1 decimal place
# Step 3: Print a friendly message like "100°C is equal to 212.0°F"
`,
      hints: [
        'Multiply celsius by 9/5 then add 32 to get fahrenheit.',
        'Use the round() function: round(number, 1) rounds to 1 decimal place.',
        'Use an f-string for the message: f"{celsius}°C is equal to {fahrenheit}°F"',
      ],
      sampleSolution: `# Temperature Converter
celsius = 100  # Change this to any temperature you like!

# Apply the formula
fahrenheit = celsius * 9 / 5 + 32

# Round to 1 decimal place
fahrenheit_rounded = round(fahrenheit, 1)

# Print a friendly message
print(f"{celsius}°C is equal to {fahrenheit_rounded}°F")
`,
    },
  },

  // ─── MODULE 2 ───────────────────────────────────────────────────────────────
  {
    id: 'list-wizardry',
    title: 'List Wizardry',
    subtitle: 'Master Python lists like a wizard',
    icon: '🧙',
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'beginner',
    xpReward: 175,
    estimatedMinutes: 20,
    prerequisites: ['supercharged-variables'],
    description: 'Lists are one of Python\'s most powerful tools. Learn how to sort, slice, search, and transform lists to store and organise collections of data.',
    whatYoullLearn: [
      'Slicing lists to grab exactly the items you want',
      'Useful list methods: append, insert, remove, sort, reverse',
      'Looping through lists with enumerate and zip',
      'List operations like joining and repeating',
    ],
    sections: [
      {
        title: 'Slicing — Grab a Piece of the List',
        content: 'Slicing lets you cut out a portion of a list just like cutting a slice of pizza. You write the start and stop positions inside square brackets, separated by a colon. Python stops before the stop index, so think of it as "from index 2 up to but NOT including index 5". You can also use a third number to step — for example, every second item.',
        code: `fruits = ["apple", "banana", "cherry", "date", "elderberry", "fig"]

# Basic slice: items from index 1 to 3 (not including 4)
print(fruits[1:4])     # ['banana', 'cherry', 'date']

# From the start up to index 3
print(fruits[:3])      # ['apple', 'banana', 'cherry']

# From index 3 to the end
print(fruits[3:])      # ['date', 'elderberry', 'fig']

# Every second item
print(fruits[::2])     # ['apple', 'cherry', 'elderberry']

# Reverse the whole list with a slice
print(fruits[::-1])    # ['fig', 'elderberry', 'date', 'cherry', 'banana', 'apple']

# Negative index: last item
print(fruits[-1])      # fig`,
      },
      {
        title: 'Power Methods',
        content: 'Lists come with built-in methods that let you add, remove, sort, and rearrange items. Think of methods as special powers attached to the list. The dot (.) between the list name and the method name is how you activate the power. Some methods change the list in place, while others return a new value.',
        code: `numbers = [5, 2, 8, 1, 9, 3]

# Add to the end
numbers.append(7)
print(numbers)          # [5, 2, 8, 1, 9, 3, 7]

# Insert at a specific position
numbers.insert(0, 0)    # put 0 at index 0
print(numbers)          # [0, 5, 2, 8, 1, 9, 3, 7]

# Remove first occurrence of a value
numbers.remove(8)
print(numbers)          # [0, 5, 2, 1, 9, 3, 7]

# Sort in place (ascending)
numbers.sort()
print(numbers)          # [0, 1, 2, 3, 5, 7, 9]

# Reverse in place
numbers.reverse()
print(numbers)          # [9, 7, 5, 3, 2, 1, 0]

# Count how many times a value appears
print([1,2,2,3,2].count(2))  # 3`,
      },
      {
        title: 'Looping Like a Pro',
        content: 'When you loop through a list, you often want to know both the item AND its position. The enumerate() function gives you both at once. The zip() function lets you loop through two lists at the same time, pairing items together like matching socks. These tools make your loops much more powerful.',
        code: `heroes = ["Spider-Man", "Thor", "Hulk"]
powers = ["web-slinging", "lightning", "super strength"]

# enumerate gives index AND value
for i, hero in enumerate(heroes):
    print(f"{i + 1}. {hero}")
# 1. Spider-Man
# 2. Thor
# 3. Hulk

# zip pairs two lists together
for hero, power in zip(heroes, powers):
    print(f"{hero} uses {power}")
# Spider-Man uses web-slinging
# Thor uses lightning
# Hulk uses super strength

# Combine enumerate and a condition
scores = [88, 45, 92, 67, 78]
for i, score in enumerate(scores):
    if score >= 80:
        print(f"Student {i+1} passed with {score}")`,
      },
    ],
    quiz: [
      {
        question: 'Given items = [10, 20, 30, 40, 50], what does items[1:4] return?',
        options: ['[10, 20, 30]', '[20, 30, 40]', '[20, 30, 40, 50]', '[10, 20, 30, 40]'],
        correctIndex: 1,
        explanation: 'Slicing starts at index 1 (value 20) and goes up to but not including index 4 (value 50), giving [20, 30, 40].',
      },
      {
        question: 'Which method adds an item to the END of a list?',
        options: ['insert()', 'add()', 'append()', 'push()'],
        correctIndex: 2,
        explanation: 'append() adds an item to the end of the list.',
      },
      {
        question: 'What does items[::-1] do?',
        options: ['Returns the last item', 'Returns every second item', 'Reverses the list', 'Removes all items'],
        correctIndex: 2,
        explanation: 'A step of -1 goes through the list backwards, creating a reversed copy.',
      },
      {
        question: 'What does enumerate(["a","b","c"]) produce when looped?',
        options: ['Just the items a, b, c', 'Just the numbers 0, 1, 2', 'Pairs like (0,"a"), (1,"b"), (2,"c")', 'A dictionary'],
        correctIndex: 2,
        explanation: 'enumerate() gives you (index, value) pairs so you know both the position and the item.',
      },
      {
        question: 'What does [1, 2, 3].count(2) return?',
        options: ['3', '2', '1', 'True'],
        correctIndex: 2,
        explanation: 'count() counts how many times the value appears. 2 appears once, so the answer is 1.',
      },
    ],
    codeChallenge: {
      prompt: 'Write a program that takes a list of 5 student scores, finds the highest and lowest scores, calculates the average, and prints a sorted leaderboard.',
      starterCode: `# Student Score Analyser
scores = [78, 92, 65, 88, 71]

# Step 1: Find the highest score using max()
# Step 2: Find the lowest score using min()
# Step 3: Calculate the average
# Step 4: Sort and print the leaderboard
`,
      hints: [
        'Python has built-in max() and min() functions that work on lists.',
        'Average = sum of all scores divided by the number of scores. Use sum() and len().',
        'Use scores.sort(reverse=True) to sort from highest to lowest.',
      ],
      sampleSolution: `# Student Score Analyser
scores = [78, 92, 65, 88, 71]

highest = max(scores)
lowest = min(scores)
average = sum(scores) / len(scores)

print(f"Highest: {highest}")
print(f"Lowest:  {lowest}")
print(f"Average: {average:.1f}")

# Sort descending for leaderboard
scores.sort(reverse=True)
print("\\nLeaderboard:")
for rank, score in enumerate(scores, start=1):
    print(f"  {rank}. {score} points")
`,
    },
  },

  // ─── MODULE 3 ───────────────────────────────────────────────────────────────
  {
    id: 'dictionary-detective',
    title: 'Dictionary Detective',
    subtitle: 'Crack the code of key-value pairs',
    icon: '🕵️',
    color: 'from-green-500 to-teal-500',
    difficulty: 'beginner',
    xpReward: 175,
    estimatedMinutes: 20,
    prerequisites: ['list-wizardry'],
    description: 'Dictionaries store data as key-value pairs, like a real dictionary stores words and their meanings. Learn to create, update, search, and loop through dictionaries to build more powerful programs.',
    whatYoullLearn: [
      'Creating and accessing dictionaries with keys',
      'Adding, updating, and deleting entries safely',
      'Looping through keys, values, and items',
      'Nesting dictionaries inside dictionaries',
    ],
    sections: [
      {
        title: 'Your First Dictionary',
        content: 'A dictionary is like a real-world phonebook — you look up a name (the key) to find a phone number (the value). In Python, you write dictionaries with curly braces and separate each key-value pair with a colon. Keys must be unique, just like you can\'t have two entries for the same name in a phonebook.',
        code: `# Create a dictionary for a game character
character = {
    "name": "Luna",
    "level": 5,
    "health": 100,
    "weapon": "magic wand"
}

# Access a value by its key
print(character["name"])    # Luna
print(character["level"])   # 5

# Safe access with .get() — returns None if key missing
print(character.get("speed"))         # None
print(character.get("speed", 0))      # 0 (default value)

# Check if a key exists
if "weapon" in character:
    print("Has a weapon:", character["weapon"])`,
      },
      {
        title: 'Modifying Dictionaries',
        content: 'Dictionaries are mutable, which means you can change them after creating them. You can add new key-value pairs, update existing ones, or delete ones you no longer need. The pop() method removes a key and gives you back its value at the same time, which is useful when you want to use the value before removing it.',
        code: `inventory = {"gold": 50, "arrows": 20, "potions": 3}

# Add a new item
inventory["sword"] = 1
print(inventory)

# Update an existing value
inventory["gold"] = 75
print(inventory["gold"])   # 75

# Delete an entry
del inventory["arrows"]
print(inventory)

# pop() removes AND returns the value
potions_left = inventory.pop("potions")
print(f"Used potions: now have {potions_left} left... wait, those are gone!")

# Update multiple keys at once with update()
inventory.update({"arrows": 30, "shield": 1})
print(inventory)`,
      },
      {
        title: 'Looping & Nesting',
        content: 'Looping through a dictionary lets you process every key-value pair. The .items() method gives you both the key and value together. You can also store dictionaries inside other dictionaries — this is called nesting, and it\'s great for organising complex data like a list of students each with their own information.',
        code: `# Loop through keys and values together
grades = {"Maths": 95, "Science": 88, "English": 91}

for subject, grade in grades.items():
    print(f"{subject}: {grade}/100")

# Loop through only keys
for subject in grades.keys():
    print(subject)

# Loop through only values
total = sum(grades.values())
print(f"Total marks: {total}")

# Nested dictionary — a dictionary of dictionaries
students = {
    "Alice": {"age": 11, "score": 92},
    "Bob":   {"age": 12, "score": 85},
}

for name, info in students.items():
    print(f"{name} is {info['age']} and scored {info['score']}")`,
      },
    ],
    quiz: [
      {
        question: 'How do you safely get a value from a dictionary without causing an error if the key is missing?',
        options: ['dict[key]', 'dict.get(key)', 'dict.find(key)', 'dict.fetch(key)'],
        correctIndex: 1,
        explanation: '.get() returns None (or a default you choose) instead of raising a KeyError when the key is missing.',
      },
      {
        question: 'Which method gives you both keys AND values when looping?',
        options: ['.keys()', '.values()', '.pairs()', '.items()'],
        correctIndex: 3,
        explanation: '.items() returns (key, value) pairs so you can access both in your loop.',
      },
      {
        question: 'What happens if you use the same key twice when creating a dictionary?',
        options: ['You get an error', 'Both values are kept', 'The second value overwrites the first', 'Python picks randomly'],
        correctIndex: 2,
        explanation: 'Keys must be unique. The second assignment overwrites the first value.',
      },
      {
        question: 'How do you remove a key AND get its value back?',
        options: ['del dict[key]', 'dict.remove(key)', 'dict.pop(key)', 'dict.delete(key)'],
        correctIndex: 2,
        explanation: 'pop(key) removes the key and returns its value so you can use it.',
      },
      {
        question: 'Which of these correctly accesses the nested value in: data = {"user": {"age": 11}}?',
        options: ['data["age"]', 'data["user", "age"]', 'data["user"]["age"]', 'data.user.age'],
        correctIndex: 2,
        explanation: 'You access nested dictionaries by chaining square brackets: first get "user" dict, then get "age" from that.',
      },
    ],
    codeChallenge: {
      prompt: 'Build a simple contact book. Store at least 3 contacts (each with a name, phone, and email). Then set search_name to one of the names and print their details nicely. Also handle what happens when the name is not found.',
      starterCode: `# Contact Book
contacts = {
    # Add your contacts here as nested dictionaries
    # Example: "Alice": {"phone": "555-1234", "email": "alice@example.com"}
}

# Set this to the name you want to look up
search_name = "Alice"

# Look up the contact and print their details
# Handle the case where the name is not found
`,
      hints: [
        'Each contact should be a dictionary with keys like "phone" and "email".',
        'Use .get() on the outer dictionary to safely look up the name.',
        'Use an if/else to print either the contact details or a "not found" message.',
      ],
      sampleSolution: `# Contact Book
contacts = {
    "Alice": {"phone": "555-1234", "email": "alice@example.com"},
    "Bob":   {"phone": "555-5678", "email": "bob@example.com"},
    "Carol": {"phone": "555-9012", "email": "carol@example.com"},
}

search_name = "Alice"  # Try changing this to "Bob", "Carol", or "Dave"
contact = contacts.get(search_name)

if contact:
    print(f"--- {search_name} ---")
    print(f"Phone: {contact['phone']}")
    print(f"Email: {contact['email']}")
else:
    print(f"No contact found for '{search_name}'")
`,
    },
  },

  // ─── MODULE 4 ───────────────────────────────────────────────────────────────
  {
    id: 'string-sorcery',
    title: 'String Sorcery',
    subtitle: 'Cast powerful spells with text',
    icon: '🔮',
    color: 'from-pink-500 to-rose-500',
    difficulty: 'beginner',
    xpReward: 175,
    estimatedMinutes: 20,
    prerequisites: ['dictionary-detective'],
    description: 'Strings are much more than just text. Learn powerful string methods to search, replace, split, and format text like a true sorcerer.',
    whatYoullLearn: [
      'Essential string methods: upper, lower, strip, replace, split, join',
      'Searching strings with find, in, and startswith/endswith',
      'Formatting strings beautifully with f-strings',
      'Working with multi-line strings and special characters',
    ],
    sections: [
      {
        title: 'String Methods Spellbook',
        content: 'Strings have dozens of built-in methods that let you transform and inspect text. Because strings are immutable in Python, these methods always return a new string rather than changing the original. Think of each method as a spell that transforms your text into something new and useful.',
        code: `message = "  Hello, Python World!  "

# Remove leading/trailing spaces
clean = message.strip()
print(repr(clean))          # 'Hello, Python World!'

# Change case
print(clean.upper())        # HELLO, PYTHON WORLD!
print(clean.lower())        # hello, python world!
print(clean.title())        # Hello, Python World!

# Replace text
new_msg = clean.replace("Python", "Magic")
print(new_msg)              # Hello, Magic World!

# Split into a list of words
words = clean.split(", ")
print(words)                # ['Hello', 'Python World!']

# Join a list back into a string
parts = ["one", "two", "three"]
print(" - ".join(parts))    # one - two - three`,
      },
      {
        title: 'Searching Inside Strings',
        content: 'You can search inside a string to find whether certain text exists, where it starts, or whether it starts/ends with something specific. The "in" keyword is the easiest way to check if something exists. The find() method tells you the exact position (index) where the text appears, and returns -1 if it is not found.',
        code: `sentence = "The quick brown fox jumps over the lazy dog"

# Check if a word exists
print("fox" in sentence)         # True
print("cat" in sentence)         # False

# Find position of a word (returns index or -1)
pos = sentence.find("fox")
print(pos)                        # 16

# startswith and endswith
url = "https://www.python.org"
print(url.startswith("https"))    # True
print(url.endswith(".org"))       # True

# Count occurrences
print(sentence.count("the"))      # 1 (case-sensitive)
print(sentence.lower().count("the"))  # 2

# Check what kind of string it is
print("12345".isdigit())   # True
print("hello".isalpha())   # True
print("abc123".isalnum())  # True`,
      },
      {
        title: 'F-Strings & Formatting',
        content: 'F-strings (formatted string literals) are the modern and easiest way to insert variables into text. You put an "f" before the opening quote and then wrap any variable or expression in curly braces. You can even control how numbers look — how many decimal places, how wide the text is, and much more.',
        code: `name = "Luna"
score = 1234.5678
level = 7

# Basic f-string
print(f"Player {name} is on level {level}")

# Format a float to 2 decimal places
print(f"Score: {score:.2f}")          # Score: 1234.57

# Pad numbers for alignment
for i in range(1, 4):
    print(f"Item {i:2d}: {'*' * i}")
# Item  1: *
# Item  2: **
# Item  3: ***

# Expressions inside f-strings
a, b = 6, 7
print(f"6 times 7 = {a * b}")        # 6 times 7 = 42

# Multi-line string (triple quotes)
poem = """
Roses are red,
Violets are blue,
Python is awesome,
And so are you!
"""
print(poem)`,
      },
    ],
    quiz: [
      {
        question: 'What does "  hello  ".strip() return?',
        options: ['"  hello  "', '"hello"', '"hello  "', '"  hello"'],
        correctIndex: 1,
        explanation: 'strip() removes all leading and trailing whitespace (spaces, tabs, newlines).',
      },
      {
        question: 'What does "a-b-c".split("-") return?',
        options: ['"abc"', '["a-b-c"]', '["a","b","c"]', '("a","b","c")'],
        correctIndex: 2,
        explanation: 'split("-") divides the string at every hyphen and returns a list of the parts.',
      },
      {
        question: 'What is the output of f"Level: {3 * 4}"?',
        options: ['"Level: 3 * 4"', '"Level: {12}"', '"Level: 12"', 'Error'],
        correctIndex: 2,
        explanation: 'F-strings evaluate expressions inside curly braces. 3 * 4 = 12, so the output is "Level: 12".',
      },
      {
        question: 'What does "python".find("on") return?',
        options: ['True', '4', '2', '-1'],
        correctIndex: 1,
        explanation: '"on" starts at index 4 in "python" (p=0, y=1, t=2, h=3, o=4, n=5).',
      },
      {
        question: 'Which method checks if a string contains ONLY letters?',
        options: ['isdigit()', 'isalpha()', 'isalnum()', 'istext()'],
        correctIndex: 1,
        explanation: 'isalpha() returns True if every character in the string is a letter.',
      },
    ],
    codeChallenge: {
      prompt: 'Write a username validator. Set username to a string of your choice. It must be 3-15 characters long, contain only letters and numbers, and start with a letter. Print whether it is valid and explain why if it is not.',
      starterCode: `# Username Validator
username = "CodeNinja42"  # Change this to test different usernames!

# Check the rules:
# 1. Length must be between 3 and 15 characters
# 2. Must contain only letters and numbers (isalnum)
# 3. Must start with a letter (isalpha on first character)
`,
      hints: [
        'Use len() to check the length of the username.',
        'username.isalnum() checks if all characters are letters or digits.',
        'username[0].isalpha() checks if the first character is a letter.',
      ],
      sampleSolution: `# Username Validator
username = "CodeNinja42"  # Try "ab", "123bad", "!nvalid", or "ThisNameIsWayTooLongForOurRules"

if len(username) < 3 or len(username) > 15:
    print("Invalid: Username must be 3-15 characters long.")
elif not username.isalnum():
    print("Invalid: Username can only contain letters and numbers.")
elif not username[0].isalpha():
    print("Invalid: Username must start with a letter.")
else:
    print(f"'{username}' is a valid username! Welcome!")
`,
    },
  },

  // ─── MODULE 5 ───────────────────────────────────────────────────────────────
  {
    id: 'function-superpowers',
    title: 'Function Superpowers',
    subtitle: 'Write functions that do amazing things',
    icon: '🦸',
    color: 'from-violet-500 to-purple-600',
    difficulty: 'intermediate',
    xpReward: 200,
    estimatedMinutes: 25,
    prerequisites: ['string-sorcery'],
    description: 'Take your functions to the next level with default arguments, keyword arguments, and functions that accept any number of inputs. You\'ll also learn about scope — where variables live and die.',
    whatYoullLearn: [
      'Default parameter values to make functions flexible',
      '*args to accept any number of arguments',
      '**kwargs to accept any number of keyword arguments',
      'Variable scope: local vs global variables',
    ],
    sections: [
      {
        title: 'Default & Keyword Arguments',
        content: 'Default arguments give a parameter a value in case the caller forgets to provide one. They make your functions more flexible and easier to use. Keyword arguments let you pass values by name instead of position, so you can skip around and be very clear about what each value means.',
        code: `# Default argument: volume defaults to 50
def play_sound(sound_name, volume=50, loops=1):
    print(f"Playing '{sound_name}' at volume {volume}, {loops} time(s)")

play_sound("laser")               # uses defaults
play_sound("explosion", 80)       # volume=80, loops=1
play_sound("music", loops=3)      # volume=50, loops=3 (keyword!)

# Keyword arguments make code self-documenting
def create_hero(name, power, level=1, health=100):
    return f"{name} (Lv{level}) — Power: {power}, HP: {health}"

hero = create_hero(name="Zara", power="telepathy", level=5)
print(hero)  # Zara (Lv5) — Power: telepathy, HP: 100`,
      },
      {
        title: '*args — Accept Any Number of Arguments',
        content: 'What if you want a function that can take 2 numbers, or 5, or 100? The *args trick lets a function accept ANY number of positional arguments. Inside the function, args is just a regular tuple you can loop through. The star (*) before the name is what makes the magic happen — the name "args" is just a convention.',
        code: `# *args collects all extra positional arguments as a tuple
def calculate_total(*prices):
    print(f"Calculating {len(prices)} prices: {prices}")
    return sum(prices)

print(calculate_total(5))               # 5
print(calculate_total(10, 20, 30))      # 60
print(calculate_total(1.5, 2.5, 3.0, 4.0))  # 11.0

# Mix regular and *args (regular must come first)
def greet_all(greeting, *names):
    for name in names:
        print(f"{greeting}, {name}!")

greet_all("Hello", "Alice", "Bob", "Carol")
# Hello, Alice!
# Hello, Bob!
# Hello, Carol!`,
      },
      {
        title: '**kwargs & Variable Scope',
        content: 'Just like *args collects extra positional arguments, **kwargs collects extra keyword arguments into a dictionary. Scope refers to where a variable can be seen and used. Variables made inside a function are "local" — they only exist inside that function. Variables made outside are "global" and can be seen everywhere, but you need the global keyword to change them inside a function.',
        code: `# **kwargs collects keyword arguments as a dictionary
def build_profile(**details):
    print("Profile:")
    for key, value in details.items():
        print(f"  {key}: {value}")

build_profile(name="Sam", age=11, city="London", hobby="coding")

# Scope example
high_score = 0   # global variable

def update_score(new_score):
    global high_score  # tell Python to use the global one
    if new_score > high_score:
        high_score = new_score
        print(f"New high score: {high_score}!")

update_score(150)
update_score(200)
update_score(180)
print(f"Final high score: {high_score}")`,
      },
    ],
    quiz: [
      {
        question: 'In def greet(name, message="Hello"): what happens if you call greet("Alex")?',
        options: ['Error — message is required', 'greet is called with name="Alex" and message="Hello"', 'greet is called with name="Hello" and message="Alex"', 'Nothing happens'],
        correctIndex: 1,
        explanation: 'Default arguments are used automatically when the caller does not provide a value. message defaults to "Hello".',
      },
      {
        question: 'What type is *args inside the function?',
        options: ['list', 'dict', 'tuple', 'set'],
        correctIndex: 2,
        explanation: '*args collects extra positional arguments into a tuple (immutable sequence).',
      },
      {
        question: 'What type is **kwargs inside the function?',
        options: ['list', 'dict', 'tuple', 'set'],
        correctIndex: 1,
        explanation: '**kwargs collects extra keyword arguments into a dictionary of name-value pairs.',
      },
      {
        question: 'A variable created inside a function is called a __ variable.',
        options: ['global', 'local', 'private', 'scoped'],
        correctIndex: 1,
        explanation: 'Variables created inside a function are local — they only exist while the function is running.',
      },
      {
        question: 'What keyword do you use to modify a global variable from inside a function?',
        options: ['outer', 'public', 'global', 'extern'],
        correctIndex: 2,
        explanation: 'The "global" keyword tells Python that you want to use and modify the global variable, not create a new local one.',
      },
    ],
    codeChallenge: {
      prompt: 'Write a function called "quiz_score" that accepts a student name and any number of quiz scores (*args). It should calculate the average, find the highest score, and print a summary. Then call it with at least two different students.',
      starterCode: `# Quiz Score Calculator
def quiz_score(student_name, *scores):
    # Calculate average, max score, and print summary
    pass

# Call your function with at least 2 students
quiz_score("Alice", 85, 92, 78, 95)
quiz_score("Bob", 70, 88, 65)
`,
      hints: [
        'Use sum(scores) and len(scores) to calculate the average.',
        'Use max(scores) to find the highest score.',
        'Use an f-string to print a nicely formatted summary.',
      ],
      sampleSolution: `# Quiz Score Calculator
def quiz_score(student_name, *scores):
    if not scores:
        print(f"{student_name} has no scores yet.")
        return
    average = sum(scores) / len(scores)
    best = max(scores)
    print(f"--- {student_name} ---")
    print(f"  Scores:  {scores}")
    print(f"  Average: {average:.1f}")
    print(f"  Best:    {best}")

quiz_score("Alice", 85, 92, 78, 95)
quiz_score("Bob", 70, 88, 65)
`,
    },
  },

  // ─── MODULE 6 ───────────────────────────────────────────────────────────────
  {
    id: 'error-defender',
    title: 'Error Defender',
    subtitle: 'Handle errors like a pro',
    icon: '🛡️',
    color: 'from-red-500 to-orange-600',
    difficulty: 'intermediate',
    xpReward: 200,
    estimatedMinutes: 20,
    prerequisites: ['function-superpowers'],
    description: 'Errors happen to every programmer — the skill is handling them gracefully. Learn to catch exceptions, raise your own errors, and write code that never crashes unexpectedly.',
    whatYoullLearn: [
      'Understanding different types of Python errors',
      'Using try/except to catch and handle errors',
      'Raising your own exceptions with raise',
      'The finally block for cleanup code that always runs',
    ],
    sections: [
      {
        title: 'Types of Errors',
        content: 'Python errors are called exceptions. There are many types — SyntaxError happens when you write Python incorrectly, TypeError happens when you use the wrong type (like adding a number to a string), and ValueError happens when a value is the wrong kind (like converting "hello" to an int). Understanding which type of error you have helps you fix it faster.',
        code: `# These would each cause a different error:
# SyntaxError — wrong Python grammar (caught by the editor)
# print("hello"   # missing closing bracket

# TypeError — wrong type operation
# result = "5" + 5   # can't add str and int

# ValueError — right type, wrong value
# number = int("hello")  # "hello" can't be a number

# NameError — using a variable that doesn't exist
# print(unknown_variable)

# ZeroDivisionError — dividing by zero
# result = 10 / 0

# IndexError — list index out of range
# items = [1, 2, 3]
# print(items[10])

# KeyError — dictionary key not found
# data = {"a": 1}
# print(data["z"])
print("Understanding error types is the first step!")`,
      },
      {
        title: 'Try & Except — Your Safety Net',
        content: 'The try/except block is your safety net. You put risky code inside the try block, and if something goes wrong, Python jumps to the except block instead of crashing. You can catch specific error types to handle different problems differently, and you can use "as e" to get the actual error message.',
        code: `# Basic try/except
try:
    number = int("25")  # Try changing "25" to "abc" or "0" to see different errors
    result = 100 / number
    print(f"100 divided by {number} = {result}")
except ValueError:
    print("That's not a valid number!")
except ZeroDivisionError:
    print("You can't divide by zero!")

# Catch multiple errors in one block
def safe_divide(a, b):
    try:
        return a / b
    except (TypeError, ZeroDivisionError) as e:
        print(f"Error: {e}")
        return None

print(safe_divide(10, 2))    # 5.0
print(safe_divide(10, 0))    # Error: division by zero
print(safe_divide(10, "x"))  # Error: unsupported operand`,
      },
      {
        title: 'Raise & Finally',
        content: 'Sometimes you want to create your own errors to tell the user they did something wrong. The raise keyword lets you throw any exception with a custom message. The finally block runs no matter what — whether an error happened or not. This is perfect for cleanup tasks like closing files or showing a "game over" message.',
        code: `# Raise your own exception
def set_health(value):
    if not isinstance(value, int):
        raise TypeError("Health must be an integer")
    if value < 0 or value > 100:
        raise ValueError("Health must be between 0 and 100")
    return value

try:
    hp = set_health(150)
except ValueError as e:
    print(f"Invalid health: {e}")

# finally always runs
def load_data(filename):
    print(f"Opening {filename}...")
    try:
        raise FileNotFoundError("File not found!")
    except FileNotFoundError as e:
        print(f"Error: {e}")
    finally:
        print("Cleanup: closing file connection")  # always runs

load_data("scores.txt")`,
      },
    ],
    quiz: [
      {
        question: 'Which error type occurs when you try to convert "hello" to an integer?',
        options: ['TypeError', 'NameError', 'ValueError', 'SyntaxError'],
        correctIndex: 2,
        explanation: 'ValueError occurs when a function receives a value of the right type but wrong content — "hello" is a string but cannot represent an integer.',
      },
      {
        question: 'What is the purpose of the "finally" block?',
        options: ['It only runs if an error occurred', 'It only runs if no error occurred', 'It always runs, error or not', 'It stops the program'],
        correctIndex: 2,
        explanation: 'The finally block always executes regardless of whether an exception was raised, making it ideal for cleanup code.',
      },
      {
        question: 'How do you raise your own custom error?',
        options: ['throw ValueError("message")', 'raise ValueError("message")', 'error ValueError("message")', 'except ValueError("message")'],
        correctIndex: 1,
        explanation: 'The "raise" keyword is used to throw an exception. You can raise any built-in exception type with a custom message.',
      },
      {
        question: 'What does "except Exception as e:" do?',
        options: ['Ignores all errors', 'Catches any exception and stores it in variable e', 'Only catches ValueError', 'Raises a new exception'],
        correctIndex: 1,
        explanation: '"as e" stores the exception object so you can print its message with print(e).',
      },
      {
        question: 'In a try/except block, if no error occurs, what happens to the except block?',
        options: ['It runs anyway', 'It is skipped', 'It causes an error', 'Python asks which block to run'],
        correctIndex: 1,
        explanation: 'If no exception is raised in the try block, Python skips the except block entirely.',
      },
    ],
    codeChallenge: {
      prompt: 'Write a safe calculator function that takes two numbers and an operator (+, -, *, /). Handle all possible errors: division by zero, and invalid operators. Return the result or an error message.',
      starterCode: `# Safe Calculator
def safe_calc(a, b, operator):
    # Handle: invalid operator, division by zero
    # Return the result or a helpful error message
    pass

# Test your calculator
print(safe_calc(10, 2, "+"))
print(safe_calc(10, 0, "/"))
print(safe_calc(10, 2, "?"))
`,
      hints: [
        'Use if/elif to handle each operator (+, -, *, /).',
        'Raise a ValueError if the operator is not one of the four valid ones.',
        'Wrap the division in a try/except to catch ZeroDivisionError.',
      ],
      sampleSolution: `# Safe Calculator
def safe_calc(a, b, operator):
    try:
        if operator == "+":
            return a + b
        elif operator == "-":
            return a - b
        elif operator == "*":
            return a * b
        elif operator == "/":
            if b == 0:
                return "Error: Cannot divide by zero"
            return a / b
        else:
            raise ValueError(f"Unknown operator: {operator}")
    except ValueError as e:
        return f"Error: {e}"

print(safe_calc(10, 2, "+"))   # 12
print(safe_calc(10, 0, "/"))   # Error: Cannot divide by zero
print(safe_calc(10, 2, "?"))   # Error: Unknown operator: ?
`,
    },
  },

  // ─── MODULE 7 ───────────────────────────────────────────────────────────────
  {
    id: 'file-wizard',
    title: 'File Wizard',
    subtitle: 'Read and write files like magic',
    icon: '📁',
    color: 'from-amber-500 to-yellow-600',
    difficulty: 'intermediate',
    xpReward: 200,
    estimatedMinutes: 25,
    prerequisites: ['error-defender'],
    description: 'Learn to save data permanently by reading and writing files. Your programs will be able to remember information even after they finish running.',
    whatYoullLearn: [
      'Opening and reading files safely with "with" statements',
      'Writing and appending to text files',
      'Reading all lines into a list for easy processing',
      'Handling file errors gracefully',
    ],
    sections: [
      {
        title: 'Reading Files',
        content: 'Files let your program remember data between runs — like saving a game. The best way to open a file in Python is with the "with" statement, which automatically closes the file when you are done, even if an error happens. You can read the whole file at once, read it line by line, or read all lines into a list.',
        code: `# Writing a sample file first so we can read it
with open("hello.txt", "w") as f:
    f.write("Line 1: Hello, World!\\n")
    f.write("Line 2: Python is awesome!\\n")
    f.write("Line 3: Keep coding!\\n")

# Read the entire file as one string
with open("hello.txt", "r") as f:
    content = f.read()
    print(content)

# Read line by line
with open("hello.txt", "r") as f:
    for line in f:
        print(line.strip())   # strip removes the \\n

# Read all lines into a list
with open("hello.txt", "r") as f:
    lines = f.readlines()
    print(f"File has {len(lines)} lines")`,
      },
      {
        title: 'Writing & Appending',
        content: 'When you open a file with "w" (write mode), Python creates the file if it does not exist, or completely replaces it if it does. If you want to add new content to an existing file without deleting what is already there, use "a" (append mode). Always remember that newline characters (\\n) are what move to the next line in a file.',
        code: `# Write mode: creates or overwrites
with open("scores.txt", "w") as f:
    f.write("High Scores\\n")
    f.write("==========\\n")

    scores = [("Alice", 9500), ("Bob", 8700), ("Carol", 7200)]
    for name, score in scores:
        f.write(f"{name}: {score}\\n")

# Append mode: adds to existing file
with open("scores.txt", "a") as f:
    f.write("Dave: 6100\\n")  # added without deleting old content

# Verify by reading back
with open("scores.txt", "r") as f:
    print(f.read())`,
      },
      {
        title: 'Safe File Handling',
        content: 'Files might not exist, or you might not have permission to read them. Using try/except around file operations keeps your program from crashing. The FileNotFoundError is raised when the file does not exist. You can also use the os.path.exists() function to check before you try to open a file.',
        code: `import os

def read_file_safely(filename):
    if not os.path.exists(filename):
        print(f"File '{filename}' not found!")
        return None
    try:
        with open(filename, "r") as f:
            return f.read()
    except PermissionError:
        print(f"No permission to read '{filename}'")
        return None

def save_list(filename, items):
    try:
        with open(filename, "w") as f:
            for item in items:
                f.write(str(item) + "\\n")
        print(f"Saved {len(items)} items to {filename}")
    except IOError as e:
        print(f"Could not save: {e}")

save_list("shopping.txt", ["apples", "bread", "milk"])
content = read_file_safely("shopping.txt")
if content:
    print(content)`,
      },
    ],
    quiz: [
      {
        question: 'What does opening a file with mode "w" do if the file already exists?',
        options: ['Adds to the end of the file', 'Raises an error', 'Overwrites (replaces) the file', 'Creates a backup first'],
        correctIndex: 2,
        explanation: '"w" mode (write) creates the file if new, or completely overwrites it if it already exists.',
      },
      {
        question: 'What is the advantage of using "with open(...) as f:"?',
        options: ['It makes reading faster', 'It automatically closes the file when done', 'It works without a filename', 'It encrypts the file'],
        correctIndex: 1,
        explanation: 'The "with" statement is a context manager that automatically closes the file when the block ends, even if an error occurs.',
      },
      {
        question: 'Which mode would you use to add text to the end of an existing file?',
        options: ['"w"', '"r"', '"a"', '"e"'],
        correctIndex: 2,
        explanation: '"a" (append) mode opens the file and positions the write pointer at the end, so new content is added without removing old content.',
      },
      {
        question: 'What does f.readlines() return?',
        options: ['A single string with the whole file', 'The number of lines', 'A list of strings, one per line', 'A dictionary'],
        correctIndex: 2,
        explanation: 'readlines() reads the entire file and returns a list where each element is one line (including the \\n character).',
      },
      {
        question: 'What error is raised when you try to open a file that does not exist?',
        options: ['ValueError', 'TypeError', 'FileNotFoundError', 'MissingFileError'],
        correctIndex: 2,
        explanation: 'FileNotFoundError is raised when Python cannot find a file at the given path.',
      },
    ],
    codeChallenge: {
      prompt: 'Build a simple diary program. It should let the user write diary entries (with today\'s date) and save them to "diary.txt" in append mode. Then read and display all previous entries.',
      starterCode: `# Simple Diary
from datetime import date

def add_entry(message):
    # Save the entry to diary.txt with today's date
    pass

def show_entries():
    # Read and display all entries from diary.txt
    pass

add_entry("Today I learned about file handling!")
add_entry("Python is getting more interesting every day.")
show_entries()
`,
      hints: [
        'Use date.today() to get today\'s date, then str() to convert it.',
        'Open "diary.txt" in "a" mode to append, "r" mode to read.',
        'Use try/except FileNotFoundError when reading in case the file is new.',
      ],
      sampleSolution: `# Simple Diary
from datetime import date
import os

def add_entry(message):
    today = str(date.today())
    with open("diary.txt", "a") as f:
        f.write(f"[{today}] {message}\\n")
    print("Entry saved!")

def show_entries():
    if not os.path.exists("diary.txt"):
        print("No diary entries yet.")
        return
    print("=== My Diary ===")
    with open("diary.txt", "r") as f:
        for line in f:
            print(line.strip())

add_entry("Today I learned about file handling!")
add_entry("Python is getting more interesting every day.")
show_entries()
`,
    },
  },

  // ─── MODULE 8 ───────────────────────────────────────────────────────────────
  {
    id: 'oop-builder',
    title: 'OOP Builder',
    subtitle: 'Build your own objects and classes',
    icon: '🏗️',
    color: 'from-sky-500 to-blue-600',
    difficulty: 'intermediate',
    xpReward: 225,
    estimatedMinutes: 30,
    prerequisites: ['file-wizard'],
    description: 'Object-Oriented Programming (OOP) lets you create your own custom types called classes. Think of a class as a blueprint and objects as the actual things built from that blueprint.',
    whatYoullLearn: [
      'Defining classes with attributes and methods',
      'The __init__ method and "self"',
      'Creating multiple objects from one class',
      'String representation with __str__',
    ],
    sections: [
      {
        title: 'Classes and Objects',
        content: 'A class is like a blueprint for building things. For example, a "Dog" blueprint describes what every dog has (name, breed, age) and what every dog can do (bark, sit, fetch). An object is one actual dog built from that blueprint. You can build many different dogs from the same blueprint — they all follow the same structure but have different values.',
        code: `# Define the Dog blueprint (class)
class Dog:
    def __init__(self, name, breed, age):
        self.name = name
        self.breed = breed
        self.age = age

    def bark(self):
        print(f"{self.name} says: Woof!")

    def describe(self):
        print(f"{self.name} is a {self.age}-year-old {self.breed}")

# Create objects from the class
dog1 = Dog("Rex", "Labrador", 3)
dog2 = Dog("Bella", "Poodle", 5)

dog1.bark()        # Rex says: Woof!
dog2.describe()    # Bella is a 5-year-old Poodle
print(dog1.name)   # Rex`,
      },
      {
        title: 'Attributes and Methods',
        content: 'Attributes are like variables that belong to an object — they store the object\'s data. Methods are like functions that belong to an object — they describe what the object can do. The word "self" refers to the specific object the method is being called on. It\'s how an object refers to itself, like saying "my name" instead of just "name".',
        code: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self.transactions = []

    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            self.transactions.append(f"+{amount}")
            print(f"Deposited {amount}. Balance: {self.balance}")

    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient funds!")
        else:
            self.balance -= amount
            self.transactions.append(f"-{amount}")
            print(f"Withdrew {amount}. Balance: {self.balance}")

    def show_history(self):
        print(f"Transactions for {self.owner}: {self.transactions}")

account = BankAccount("Luna", 100)
account.deposit(50)
account.withdraw(30)
account.show_history()`,
      },
      {
        title: 'The __str__ Method',
        content: 'When you print an object, Python normally shows something ugly like "<__main__.Dog object at 0x...>". You can fix this by defining a special __str__ method, which tells Python what string to use when printing your object. Any method surrounded by double underscores is called a "dunder" (double underscore) method, and they have special powers in Python.',
        code: `class GameCharacter:
    def __init__(self, name, hero_class, level, health):
        self.name = name
        self.hero_class = hero_class
        self.level = level
        self.health = health

    def __str__(self):
        return (f"[{self.hero_class}] {self.name} "
                f"| Level {self.level} | HP: {self.health}")

    def level_up(self):
        self.level += 1
        self.health += 20
        print(f"{self.name} levelled up to level {self.level}!")

hero = GameCharacter("Zara", "Mage", 1, 80)
print(hero)       # [Mage] Zara | Level 1 | HP: 80

hero.level_up()
print(hero)       # [Mage] Zara | Level 2 | HP: 100`,
      },
    ],
    quiz: [
      {
        question: 'What is the purpose of __init__ in a class?',
        options: ['It deletes the object', 'It runs automatically when an object is created', 'It prints the object', 'It copies the object'],
        correctIndex: 1,
        explanation: '__init__ is the constructor — it runs automatically when you create a new object and sets up its initial attributes.',
      },
      {
        question: 'What does "self" refer to inside a method?',
        options: ['The class itself', 'The specific object the method is called on', 'The parent class', 'The module'],
        correctIndex: 1,
        explanation: '"self" is a reference to the specific instance (object) that the method is being called on.',
      },
      {
        question: 'If cat = Cat("Whiskers"), how do you access its name attribute?',
        options: ['Cat.name', 'cat["name"]', 'cat.name', 'self.name'],
        correctIndex: 2,
        explanation: 'You access object attributes using dot notation: object_name.attribute_name.',
      },
      {
        question: 'What does defining __str__ on a class do?',
        options: ['Converts all attributes to strings', 'Controls what print() shows for the object', 'Renames the class', 'Adds string methods'],
        correctIndex: 1,
        explanation: '__str__ is called by print() to get the string representation of an object.',
      },
      {
        question: 'How do you create a new object from a class called "Car"?',
        options: ['Car.new("red")', 'new Car("red")', 'car = Car("red")', 'Car.create("red")'],
        correctIndex: 2,
        explanation: 'You create an object by calling the class name like a function: Car("red") calls __init__ and returns a new Car object.',
      },
    ],
    codeChallenge: {
      prompt: 'Create a class called "Student" with name, age, and a list of grades. Add methods to add a grade, calculate the average grade, and print a report card. Create 2 students and test all methods.',
      starterCode: `# Student Class
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.grades = []

    def add_grade(self, grade):
        pass

    def average(self):
        pass

    def report_card(self):
        pass

s1 = Student("Alice", 11)
s1.add_grade(88)
s1.add_grade(92)
s1.report_card()
`,
      hints: [
        'Use self.grades.append(grade) to add a grade.',
        'Average = sum(self.grades) / len(self.grades). Check len > 0 first.',
        'Use an f-string to print a nicely formatted report.',
      ],
      sampleSolution: `# Student Class
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.grades = []

    def add_grade(self, grade):
        self.grades.append(grade)

    def average(self):
        if not self.grades:
            return 0
        return sum(self.grades) / len(self.grades)

    def report_card(self):
        avg = self.average()
        grade_letter = "A" if avg >= 90 else "B" if avg >= 80 else "C"
        print(f"=== Report Card: {self.name} (Age {self.age}) ===")
        print(f"  Grades:  {self.grades}")
        print(f"  Average: {avg:.1f} ({grade_letter})")

s1 = Student("Alice", 11)
s1.add_grade(88)
s1.add_grade(92)
s1.add_grade(95)
s1.report_card()

s2 = Student("Bob", 12)
s2.add_grade(72)
s2.add_grade(68)
s2.report_card()
`,
    },
  },

  // ─── MODULE 9 ───────────────────────────────────────────────────────────────
  {
    id: 'inheritance-quest',
    title: 'Inheritance Quest',
    subtitle: 'Pass down powers through class families',
    icon: '👑',
    color: 'from-emerald-500 to-green-600',
    difficulty: 'intermediate',
    xpReward: 225,
    estimatedMinutes: 30,
    prerequisites: ['oop-builder'],
    description: 'Inheritance lets one class borrow all the features of another class and add its own extras. Build powerful class hierarchies where child classes extend and customise their parent.',
    whatYoullLearn: [
      'Creating child classes that inherit from a parent',
      'Using super() to call the parent class methods',
      'Overriding methods to change inherited behaviour',
      'Checking object types with isinstance()',
    ],
    sections: [
      {
        title: 'Parent and Child Classes',
        content: 'Inheritance is like a family tree. A parent class (also called a base class) has general features. A child class (subclass) inherits everything from the parent and can add new things or change existing ones. This saves you from writing the same code twice — the child class gets all the parent\'s code for free!',
        code: `# Parent class (the general blueprint)
class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound

    def speak(self):
        print(f"{self.name} says {self.sound}!")

    def describe(self):
        print(f"I am {self.name}, an animal.")

# Child class — inherits from Animal
class Dog(Animal):
    def __init__(self, name):
        super().__init__(name, "Woof")  # call parent's __init__
        self.tricks = []

    def learn_trick(self, trick):
        self.tricks.append(trick)
        print(f"{self.name} learned: {trick}")

rex = Dog("Rex")
rex.speak()             # Rex says Woof! (inherited)
rex.describe()          # I am Rex, an animal. (inherited)
rex.learn_trick("sit")  # Rex learned: sit (new!)`,
      },
      {
        title: 'Overriding Methods',
        content: 'When a child class defines a method with the same name as the parent, it overrides it — the child\'s version replaces the parent\'s version for objects of that child class. You can still call the parent\'s version using super() if you want to extend it rather than completely replace it.',
        code: `class Vehicle:
    def __init__(self, make, speed):
        self.make = make
        self.speed = speed

    def describe(self):
        return f"{self.make} (max {self.speed} km/h)"

    def move(self):
        return f"{self.make} is moving!"

class ElectricCar(Vehicle):
    def __init__(self, make, speed, battery_range):
        super().__init__(make, speed)
        self.battery_range = battery_range

    def describe(self):   # OVERRIDES parent's describe
        parent_desc = super().describe()
        return f"{parent_desc} | Range: {self.battery_range} km (electric)"

    def charge(self):
        return f"{self.make} is charging..."

car = ElectricCar("TeslaTron", 250, 500)
print(car.describe())  # TeslaTron (max 250 km/h) | Range: 500 km (electric)
print(car.move())      # TeslaTron is moving! (inherited)
print(car.charge())    # TeslaTron is charging...`,
      },
      {
        title: 'isinstance() and Multiple Inheritance',
        content: 'The isinstance() function checks if an object is an instance of a class — or any of its parent classes. A Dog object is an instance of Dog AND of Animal. This is very useful for writing code that works with different types of objects. Python also supports multiple inheritance, where a class can inherit from more than one parent.',
        code: `class Animal:
    def breathe(self):
        return "breathing air"

class Pet:
    def is_domesticated(self):
        return True

# Multiple inheritance — Cat gets features from both!
class Cat(Animal, Pet):
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f"{self.name} says Meow!"

whiskers = Cat("Whiskers")
print(whiskers.speak())
print(whiskers.breathe())         # from Animal
print(whiskers.is_domesticated()) # from Pet

# isinstance checks class AND all parent classes
print(isinstance(whiskers, Cat))    # True
print(isinstance(whiskers, Animal)) # True
print(isinstance(whiskers, Pet))    # True`,
      },
    ],
    quiz: [
      {
        question: 'What does super().__init__() do in a child class?',
        options: ['Creates a new parent object', 'Calls the parent class constructor', 'Deletes the parent class', 'Copies the parent class'],
        correctIndex: 1,
        explanation: 'super().__init__() calls the parent\'s __init__ method so you can set up the parent\'s attributes without rewriting that code.',
      },
      {
        question: 'If class Bird(Animal): — what does Bird inherit?',
        options: ['Nothing — it starts fresh', 'Only Animal\'s attributes, not methods', 'All of Animal\'s attributes and methods', 'Only Animal\'s methods, not attributes'],
        correctIndex: 2,
        explanation: 'A child class inherits ALL attributes and methods from the parent class.',
      },
      {
        question: 'When a child class defines a method with the same name as the parent, what happens?',
        options: ['An error occurs', 'Both methods run', 'The child\'s method overrides the parent\'s', 'The parent\'s method is deleted'],
        correctIndex: 2,
        explanation: 'Method overriding means the child class\'s version replaces the parent\'s version for instances of the child class.',
      },
      {
        question: 'isinstance(rex, Animal) where rex is a Dog(Animal) object returns:',
        options: ['False', 'True', '"Dog"', 'Error'],
        correctIndex: 1,
        explanation: 'isinstance returns True if the object is an instance of the class OR any of its parent classes.',
      },
      {
        question: 'What is the term for a class that another class inherits from?',
        options: ['Child class', 'Subclass', 'Parent/Base class', 'Module class'],
        correctIndex: 2,
        explanation: 'The class being inherited from is called the parent class or base class. The class that inherits is called the child class or subclass.',
      },
    ],
    codeChallenge: {
      prompt: 'Create a class hierarchy for a simple RPG game. Make a base "Character" class with name and health. Then create "Warrior" (extra armor, shield_block method) and "Mage" (extra mana, cast_spell method) classes that inherit from it.',
      starterCode: `# RPG Character Hierarchy
class Character:
    def __init__(self, name, health):
        self.name = name
        self.health = health

    def attack(self):
        pass

class Warrior(Character):
    def __init__(self, name, health, armor):
        pass

    def shield_block(self):
        pass

class Mage(Character):
    def __init__(self, name, health, mana):
        pass

    def cast_spell(self):
        pass
`,
      hints: [
        'Use super().__init__(name, health) inside Warrior and Mage.',
        'The attack() method can return f"{self.name} attacks for 10 damage!".',
        'Test with isinstance() to confirm that Warrior objects are also Characters.',
      ],
      sampleSolution: `# RPG Character Hierarchy
class Character:
    def __init__(self, name, health):
        self.name = name
        self.health = health

    def attack(self):
        return f"{self.name} attacks for 10 damage!"

    def __str__(self):
        return f"{self.name} (HP: {self.health})"

class Warrior(Character):
    def __init__(self, name, health, armor):
        super().__init__(name, health)
        self.armor = armor

    def shield_block(self):
        return f"{self.name} blocks with shield! (armor: {self.armor})"

    def __str__(self):
        return super().__str__() + f" [Warrior, Armor: {self.armor}]"

class Mage(Character):
    def __init__(self, name, health, mana):
        super().__init__(name, health)
        self.mana = mana

    def cast_spell(self):
        if self.mana >= 10:
            self.mana -= 10
            return f"{self.name} casts a fireball for 25 damage!"
        return f"{self.name} is out of mana!"

w = Warrior("Thor", 120, 50)
m = Mage("Merlin", 80, 100)
print(w)
print(w.attack())
print(w.shield_block())
print(m)
print(m.cast_spell())
print(isinstance(w, Character))  # True
`,
    },
  },

  // ─── MODULE 10 ──────────────────────────────────────────────────────────────
  {
    id: 'python-secrets',
    title: 'Python Secrets',
    subtitle: 'Discover hidden Python features',
    icon: '🔒',
    color: 'from-slate-500 to-gray-600',
    difficulty: 'intermediate',
    xpReward: 225,
    estimatedMinutes: 25,
    prerequisites: ['inheritance-quest'],
    description: 'Python is full of clever tricks and hidden gems. Discover useful features like generators, magic dunder methods, and smart operators that make your code smarter and more Pythonic.',
    whatYoullLearn: [
      'Dunder (magic) methods to customise class behaviour',
      'Generators and the yield keyword',
      'The ternary operator for compact conditions',
      'Unpacking and the walrus operator',
    ],
    sections: [
      {
        title: 'Magic (Dunder) Methods',
        content: 'Dunder methods have double underscores on each side like __add__ or __len__. They are called "magic" because Python calls them automatically in certain situations. For example, when you write a + b, Python secretly calls a.__add__(b). By defining these methods in your class, you make your objects work with Python\'s built-in operators and functions.',
        code: `class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Vector({self.x}, {self.y})"

    def __add__(self, other):  # enables v1 + v2
        return Vector(self.x + other.x, self.y + other.y)

    def __len__(self):  # enables len(v)
        return int((self.x**2 + self.y**2) ** 0.5)

    def __eq__(self, other):  # enables v1 == v2
        return self.x == other.x and self.y == other.y

v1 = Vector(3, 4)
v2 = Vector(1, 2)
print(v1)          # Vector(3, 4)
print(v1 + v2)     # Vector(4, 6)
print(len(v1))     # 5  (magnitude)
print(v1 == v2)    # False`,
      },
      {
        title: 'Generators and yield',
        content: 'A generator is a special kind of function that produces values one at a time instead of all at once. Instead of "return", you use "yield". Each time you ask for the next value, the function continues from where it left off. Generators are memory-efficient — perfect for huge sequences because they don\'t store everything in memory at once.',
        code: `# Normal function builds the whole list in memory
def make_squares_list(n):
    return [i * i for i in range(n)]

# Generator yields one at a time — much more efficient!
def make_squares_gen(n):
    for i in range(n):
        yield i * i   # pause here, give back i*i, then resume

# Using the generator
for sq in make_squares_gen(6):
    print(sq, end=" ")   # 0 1 4 9 16 25
print()

# A generator that counts up on demand
def count_up(start=0):
    n = start
    while True:
        yield n
        n += 1

counter = count_up(10)
print(next(counter))  # 10
print(next(counter))  # 11
print(next(counter))  # 12`,
      },
      {
        title: 'Ternary, Unpacking & Walrus',
        content: 'The ternary operator lets you write a simple if/else on one line. Unpacking lets you assign multiple values from a sequence at once, including using * to capture the "rest". The walrus operator (:=) lets you assign a variable and use its value in the same expression — very handy inside while loops and comprehensions.',
        code: `# Ternary operator: value_if_true if condition else value_if_false
age = 11
status = "teen" if age >= 13 else "child"
print(status)   # child

# Unpacking with *rest
first, *middle, last = [1, 2, 3, 4, 5]
print(first)    # 1
print(middle)   # [2, 3, 4]
print(last)     # 5

# Walrus operator := (assign and use in one step)
numbers = [15, 3, 28, 7, 42, 1]
for n in numbers:
    if (big := n) > 20:
        print(f"Found big number: {big}")
        break

# Useful in while loops — simulate rolling until 6
import random
random.seed(42)
while (roll := random.randint(1, 6)) != 6:
    print(f"Rolled {roll}, try again...")
print("Got a 6!")`,
      },
    ],
    quiz: [
      {
        question: 'Which dunder method is called when you use + between two objects?',
        options: ['__plus__', '__sum__', '__add__', '__combine__'],
        correctIndex: 2,
        explanation: '__add__ is the magic method Python calls when you use the + operator between two objects.',
      },
      {
        question: 'What keyword does a generator function use instead of return?',
        options: ['send', 'produce', 'yield', 'emit'],
        correctIndex: 2,
        explanation: '"yield" pauses the generator function and sends back a value. The function resumes from that point when the next value is requested.',
      },
      {
        question: 'What does "A" if x > 0 else "B" evaluate to when x = -1?',
        options: ['"A"', '"B"', 'Error', 'None'],
        correctIndex: 1,
        explanation: 'This is the ternary operator. Since x is not > 0, it evaluates to the else branch: "B".',
      },
      {
        question: 'In: first, *rest = [1,2,3,4] — what is rest?',
        options: ['[1,2,3,4]', '[2,3,4]', '(2,3,4)', '2'],
        correctIndex: 1,
        explanation: '*rest captures all remaining items after the first one, giving a list [2, 3, 4].',
      },
      {
        question: 'What does the walrus operator (:=) do?',
        options: ['Compares two values', 'Assigns a value AND returns it in the same expression', 'Deletes a variable', 'Creates a generator'],
        correctIndex: 1,
        explanation: 'The walrus operator := assigns a value to a variable while also returning that value, useful for combining assignment with a condition.',
      },
    ],
    codeChallenge: {
      prompt: 'Create a class called "Countdown" that supports len() and str(). Also write a separate generator function countdown_gen(start) that yields numbers from start down to 1.',
      starterCode: `# Countdown with dunder methods
class Countdown:
    def __init__(self, start):
        self.start = start

    def __len__(self):
        pass

    def __str__(self):
        pass

def countdown_gen(start):
    # Generator that yields start, start-1, ... 1
    pass

c = Countdown(5)
print(len(c))  # 5
print(c)       # Countdown from 5: [5, 4, 3, 2, 1]
for n in countdown_gen(5):
    print(n, end=" ")
`,
      hints: [
        'For __len__, just return self.start.',
        'For __str__, build the list with list(range(self.start, 0, -1)).',
        'In countdown_gen, use a while loop: start at n=start, yield n, then n -= 1 while n >= 1.',
      ],
      sampleSolution: `# Countdown with dunder methods
class Countdown:
    def __init__(self, start):
        self.start = start

    def __len__(self):
        return self.start

    def __str__(self):
        nums = list(range(self.start, 0, -1))
        return f"Countdown from {self.start}: {nums}"

def countdown_gen(start):
    n = start
    while n >= 1:
        yield n
        n -= 1

c = Countdown(5)
print(len(c))
print(c)
for n in countdown_gen(5):
    print(n, end=" ")
print()
`,
    },
  },

  // ─── MODULE 11 ──────────────────────────────────────────────────────────────
  {
    id: 'comprehension-magic',
    title: 'Comprehension Magic',
    subtitle: 'Build lists, sets, and dicts in one line',
    icon: '✨',
    color: 'from-fuchsia-500 to-pink-600',
    difficulty: 'advanced',
    xpReward: 250,
    estimatedMinutes: 25,
    prerequisites: ['python-secrets'],
    description: 'Comprehensions are a superpower that lets you build lists, dictionaries, and sets in a single, elegant line. They are faster than loops and instantly make your code look like a Python expert wrote it.',
    whatYoullLearn: [
      'List comprehensions to transform data in one line',
      'Filtering with conditions inside comprehensions',
      'Dictionary and set comprehensions',
      'Nested comprehensions for 2D data',
    ],
    sections: [
      {
        title: 'List Comprehensions',
        content: 'A list comprehension is a compact way to create a new list by applying an expression to every item in an existing sequence. The pattern is: [expression for item in iterable]. Think of it as saying "give me X for every Y in Z". It is shorter, faster, and often more readable than a traditional for loop that builds a list.',
        code: `# Traditional loop to build a list
squares_loop = []
for n in range(1, 6):
    squares_loop.append(n * n)
print(squares_loop)   # [1, 4, 9, 16, 25]

# Same thing as a list comprehension — one line!
squares = [n * n for n in range(1, 6)]
print(squares)        # [1, 4, 9, 16, 25]

# Transform strings
fruits = ["apple", "banana", "cherry"]
upper_fruits = [f.upper() for f in fruits]
print(upper_fruits)   # ['APPLE', 'BANANA', 'CHERRY']

# Use any expression
names = ["alice", "bob", "carol"]
greetings = [f"Hello, {name.title()}!" for name in names]
for g in greetings:
    print(g)`,
      },
      {
        title: 'Filtering with Conditions',
        content: 'You can add an "if" clause at the end of a comprehension to include only items that pass a test. The pattern becomes: [expression for item in iterable if condition]. This filters and transforms in one step — replacing two-line loops that had an if statement inside them.',
        code: `numbers = range(1, 21)

# Only even numbers
evens = [n for n in numbers if n % 2 == 0]
print(evens)   # [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

# Numbers divisible by 3 AND 5
fizzbuzz = [n for n in range(1, 51) if n % 3 == 0 and n % 5 == 0]
print(fizzbuzz)   # [15, 30, 45]

# Words longer than 4 characters, made uppercase
words = ["hi", "hello", "hey", "howdy", "yo"]
long_upper = [w.upper() for w in words if len(w) > 4]
print(long_upper)  # ['HELLO', 'HOWDY']

# Filter a list of scores to only passing grades
scores = [55, 82, 47, 91, 63, 78, 34]
passing = [s for s in scores if s >= 60]
print(passing)  # [82, 91, 63, 78]`,
      },
      {
        title: 'Dict, Set & Nested Comprehensions',
        content: 'You can also write comprehensions for dictionaries (using curly braces and a colon) and sets (using curly braces without a colon). Nested comprehensions let you work with 2D structures like grids or tables. They can get complex, so only nest one level deep to keep your code readable.',
        code: `# Dict comprehension: {key: value for item in iterable}
names = ["Alice", "Bob", "Carol"]
scores = [88, 74, 92]
grade_book = {name: score for name, score in zip(names, scores)}
print(grade_book)  # {'Alice': 88, 'Bob': 74, 'Carol': 92}

# Invert a dictionary (swap keys and values)
inverted = {v: k for k, v in grade_book.items()}
print(inverted)    # {88: 'Alice', 74: 'Bob', 92: 'Carol'}

# Set comprehension: no duplicates automatically
words = ["apple", "banana", "apricot", "blueberry", "avocado"]
first_letters = {w[0] for w in words}
print(first_letters)   # {'a', 'b'}

# Nested list comprehension: 3x3 multiplication table
table = [[row * col for col in range(1, 4)] for row in range(1, 4)]
for row in table:
    print(row)
# [1, 2, 3]
# [2, 4, 6]
# [3, 6, 9]`,
      },
    ],
    quiz: [
      {
        question: 'What does [x*2 for x in range(4)] produce?',
        options: ['[0, 1, 2, 3]', '[2, 4, 6, 8]', '[0, 2, 4, 6]', '[1, 2, 3, 4]'],
        correctIndex: 2,
        explanation: 'range(4) produces 0,1,2,3. Multiplying each by 2 gives [0, 2, 4, 6].',
      },
      {
        question: 'Which comprehension keeps only odd numbers from a list?',
        options: ['[n for n if n%2==1]', '[n for n in nums if n%2==1]', '[n%2==1 for n in nums]', '[n if n%2==1]'],
        correctIndex: 1,
        explanation: 'The correct syntax is [expression for item in iterable if condition].',
      },
      {
        question: 'What type does {k: v for k, v in pairs} create?',
        options: ['list', 'tuple', 'set', 'dict'],
        correctIndex: 3,
        explanation: 'Curly braces with key: value syntax creates a dictionary.',
      },
      {
        question: 'What does {w[0] for w in ["apple","art","banana"]} produce?',
        options: ["['a','a','b']", "{'a','b'}", "{'a','a','b'}", "'ab'"],
        correctIndex: 1,
        explanation: 'A set comprehension creates a set, which removes duplicates. Both "apple" and "art" start with "a", so the set has just {"a","b"}.',
      },
      {
        question: 'What is the output of [n for n in range(1,6) if n != 3]?',
        options: ['[1, 2, 3, 4, 5]', '[1, 2, 4, 5]', '[3]', '[1, 2]'],
        correctIndex: 1,
        explanation: 'The condition if n != 3 filters out 3, leaving [1, 2, 4, 5].',
      },
    ],
    codeChallenge: {
      prompt: 'Use list and dictionary comprehensions to analyse a list of student names and scores. Create: (1) a list of names of students who scored >= 80, (2) a dictionary mapping each name to a pass/fail grade, (3) a list of scores doubled.',
      starterCode: `# Comprehension Challenge
students = {
    "Alice": 92, "Bob": 75, "Carol": 88,
    "Dave": 55, "Eve": 81, "Frank": 63
}

# 1. List of names scoring >= 80
high_achievers = []

# 2. Dict mapping name -> "Pass" or "Fail"
pass_fail = {}

# 3. List of all scores doubled
doubled_scores = []

print(high_achievers)
print(pass_fail)
print(doubled_scores)
`,
      hints: [
        'Iterate over students.items() to get (name, score) pairs.',
        'For pass_fail, use "Pass" if score >= 60 else "Fail" inside the dict comprehension.',
        'For doubled_scores, iterate over students.values().',
      ],
      sampleSolution: `# Comprehension Challenge
students = {
    "Alice": 92, "Bob": 75, "Carol": 88,
    "Dave": 55, "Eve": 81, "Frank": 63
}

# 1. Names scoring >= 80
high_achievers = [name for name, score in students.items() if score >= 80]

# 2. Pass/Fail dict
pass_fail = {name: ("Pass" if score >= 60 else "Fail")
             for name, score in students.items()}

# 3. Doubled scores
doubled_scores = [score * 2 for score in students.values()]

print("High achievers:", high_achievers)
print("Pass/Fail:", pass_fail)
print("Doubled:", doubled_scores)
`,
    },
  },

  // ─── MODULE 12 ──────────────────────────────────────────────────────────────
  {
    id: 'lambda-friends',
    title: 'Lambda & Friends',
    subtitle: 'Mini functions and functional tools',
    icon: 'λ',
    color: 'from-lime-500 to-green-500',
    difficulty: 'advanced',
    xpReward: 250,
    estimatedMinutes: 25,
    prerequisites: ['comprehension-magic'],
    description: 'Lambda functions are tiny one-line functions great for quick tasks. Pair them with map, filter, and sorted to process data in a clean, functional style.',
    whatYoullLearn: [
      'Writing lambda (anonymous) functions',
      'Using map() to transform every item in a list',
      'Using filter() to keep only items that pass a test',
      'Sorting with custom keys using sorted() and lambda',
    ],
    sections: [
      {
        title: 'Lambda Functions',
        content: 'A lambda is a tiny function you can write in one line without giving it a name. The syntax is: lambda parameters: expression. Lambdas are perfect for short, throwaway functions you only need once — like telling sorted() how to compare items. They cannot contain multiple statements or loops, so use def for anything complex.',
        code: `# Normal function
def double(x):
    return x * 2

# Same function as a lambda
double_lambda = lambda x: x * 2

print(double(5))         # 10
print(double_lambda(5))  # 10

# Lambda with two parameters
add = lambda a, b: a + b
print(add(3, 4))         # 7

# Lambda with a condition (ternary inside)
classify = lambda n: "even" if n % 2 == 0 else "odd"
print(classify(7))       # odd
print(classify(8))       # even

# Immediately called lambda (rarely used but shows the idea)
result = (lambda x, y: x ** y)(2, 10)
print(result)            # 1024`,
      },
      {
        title: 'map() and filter()',
        content: 'map() applies a function to every item in a sequence and returns the results. filter() keeps only the items for which the function returns True. Both return special objects, so wrap them in list() to see the results. Using lambda with map and filter keeps your code short and readable.',
        code: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# map: apply a function to every item
squared = list(map(lambda n: n ** 2, numbers))
print(squared)   # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# filter: keep only items where function returns True
evens = list(filter(lambda n: n % 2 == 0, numbers))
print(evens)     # [2, 4, 6, 8, 10]

# Combine: square the even numbers
even_squares = list(map(lambda n: n**2, filter(lambda n: n%2==0, numbers)))
print(even_squares)  # [4, 16, 36, 64, 100]

# map with strings
names = ["alice", "bob", "carol"]
proper = list(map(lambda s: s.capitalize(), names))
print(proper)    # ['Alice', 'Bob', 'Carol']`,
      },
      {
        title: 'Sorting with Lambda Keys',
        content: 'The sorted() function can sort by any rule you give it using the "key" parameter. You pass a function that takes one item and returns the value Python should use to compare items. Lambda is perfect here since you usually need a very simple key function — like getting the second element of a tuple or the length of a string.',
        code: `# Sort strings by length
words = ["banana", "kiwi", "pear", "strawberry", "fig"]
by_length = sorted(words, key=lambda w: len(w))
print(by_length)  # ['fig', 'kiwi', 'pear', 'banana', 'strawberry']

# Sort by length, then alphabetically for ties
by_length_alpha = sorted(words, key=lambda w: (len(w), w))
print(by_length_alpha)

# Sort a list of tuples by second item (score)
players = [("Alice", 85), ("Bob", 92), ("Carol", 78)]
by_score = sorted(players, key=lambda p: p[1], reverse=True)
print(by_score)   # [('Bob', 92), ('Alice', 85), ('Carol', 78)]

# Sort dictionaries by a value
inventory = [
    {"item": "sword", "price": 150},
    {"item": "shield", "price": 80},
    {"item": "potion", "price": 25},
]
by_price = sorted(inventory, key=lambda x: x["price"])
for item in by_price:
    print(f"{item['item']}: {item['price']} gold")`,
      },
    ],
    quiz: [
      {
        question: 'What does lambda x: x * 3 do?',
        options: ['Creates a variable named x', 'Defines a function that returns x multiplied by 3', 'Calls a function with argument 3', 'Prints x three times'],
        correctIndex: 1,
        explanation: 'lambda x: x * 3 creates an anonymous function that takes one argument x and returns x * 3.',
      },
      {
        question: 'What does list(map(lambda n: n+1, [1,2,3])) return?',
        options: ['[1, 2, 3]', '[2, 3, 4]', '[0, 1, 2]', '[1, 4, 9]'],
        correctIndex: 1,
        explanation: 'map applies n+1 to every element: 1+1=2, 2+1=3, 3+1=4. Result is [2, 3, 4].',
      },
      {
        question: 'What does list(filter(lambda x: x > 3, [1,2,3,4,5])) return?',
        options: ['[1, 2, 3]', '[4, 5]', '[3, 4, 5]', '[True, True]'],
        correctIndex: 1,
        explanation: 'filter keeps only items where the lambda returns True. Only 4 and 5 are > 3.',
      },
      {
        question: 'In sorted(items, key=lambda x: x[1]), what does x[1] refer to?',
        options: ['The first element of each item', 'The second element of each item', 'The length of each item', 'The index of each item'],
        correctIndex: 1,
        explanation: 'x[1] accesses the element at index 1 (the second element) of each item.',
      },
      {
        question: 'What is the main limitation of a lambda function?',
        options: ['It can only take one parameter', 'It cannot return a value', 'It can only be one expression (no loops or multiple statements)', 'It cannot use variables'],
        correctIndex: 2,
        explanation: 'Lambda functions are limited to a single expression. For multi-line logic, use a regular def function.',
      },
    ],
    codeChallenge: {
      prompt: 'You have a list of products (each a dict with name, price, rating). Use lambda with sorted() to: (1) sort by price low to high, (2) sort by rating high to low. Then use filter() to get only products rated >= 4.0.',
      starterCode: `# Product Sorter
products = [
    {"name": "Headphones", "price": 49.99, "rating": 4.5},
    {"name": "Keyboard",   "price": 29.99, "rating": 3.8},
    {"name": "Mouse",      "price": 19.99, "rating": 4.2},
    {"name": "Monitor",    "price": 199.99, "rating": 4.7},
    {"name": "Webcam",     "price": 39.99, "rating": 3.5},
]

# Sort by price (low to high)
by_price = []

# Sort by rating (high to low)
by_rating = []

# Filter: only rating >= 4.0
top_rated = []
`,
      hints: [
        'Use sorted(products, key=lambda p: p["price"]) for price sorting.',
        'Add reverse=True to sorted() to go from high to low.',
        'Use list(filter(lambda p: p["rating"] >= 4.0, products)) for filtering.',
      ],
      sampleSolution: `# Product Sorter
products = [
    {"name": "Headphones", "price": 49.99, "rating": 4.5},
    {"name": "Keyboard",   "price": 29.99, "rating": 3.8},
    {"name": "Mouse",      "price": 19.99, "rating": 4.2},
    {"name": "Monitor",    "price": 199.99, "rating": 4.7},
    {"name": "Webcam",     "price": 39.99, "rating": 3.5},
]

by_price = sorted(products, key=lambda p: p["price"])
by_rating = sorted(products, key=lambda p: p["rating"], reverse=True)
top_rated = list(filter(lambda p: p["rating"] >= 4.0, products))

print("By price:")
for p in by_price:
    print(f"  {p['name']}: \${p['price']}")

print("\\nBy rating:")
for p in by_rating:
    print(f"  {p['name']}: {p['rating']}")

print("\\nTop rated (>= 4.0):")
for p in top_rated:
    print(f"  {p['name']}: {p['rating']}")
`,
    },
  },

  // ─── MODULE 13 ──────────────────────────────────────────────────────────────
  {
    id: 'decorator-workshop',
    title: 'Decorator Workshop',
    subtitle: 'Wrap functions with extra superpowers',
    icon: '🎨',
    color: 'from-indigo-500 to-violet-600',
    difficulty: 'advanced',
    xpReward: 275,
    estimatedMinutes: 30,
    prerequisites: ['lambda-friends'],
    description: 'Decorators are a powerful Python feature that let you modify or enhance functions without changing their code. They are used everywhere in Python frameworks and are a sign of expert-level coding.',
    whatYoullLearn: [
      'Understanding functions as first-class objects',
      'Writing your first decorator with closures',
      'Using the @decorator syntax',
      'Practical decorators: timing and logging',
    ],
    sections: [
      {
        title: 'Functions Are Objects',
        content: 'In Python, functions are "first-class objects" — which means you can store a function in a variable, pass it to another function as an argument, and return it from a function. This might sound strange at first, but it is the key idea that makes decorators possible. Think of a function as a recipe card you can hand to someone else.',
        code: `# Store a function in a variable
def say_hello():
    print("Hello!")

greet = say_hello   # no () means we store the function itself
greet()             # Hello!

# Pass a function as an argument
def run_twice(func):
    func()
    func()

run_twice(say_hello)   # Hello! Hello!

# Return a function from a function
def make_multiplier(factor):
    def multiply(n):
        return n * factor
    return multiply   # return the inner function

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5))   # 10
print(triple(5))   # 15`,
      },
      {
        title: 'Writing a Decorator',
        content: 'A decorator is a function that takes another function, wraps it with extra code, and returns the enhanced version. The inner "wrapper" function is what actually runs when you call the decorated function. The @decorator syntax is shorthand — writing @my_decorator above a function is exactly the same as writing func = my_decorator(func) afterwards.',
        code: `# A decorator that adds a greeting before and after
def friendly(func):
    def wrapper(*args, **kwargs):
        print("=== Starting ===")
        result = func(*args, **kwargs)   # call the original function
        print("=== Done! ===")
        return result
    return wrapper

# Apply the decorator using @ syntax
@friendly
def calculate_sum(a, b):
    total = a + b
    print(f"{a} + {b} = {total}")
    return total

# This is equivalent to: calculate_sum = friendly(calculate_sum)
answer = calculate_sum(3, 7)

# The decorator runs: === Starting ===, then the function, then === Done! ===
print(f"Result was: {answer}")`,
      },
      {
        title: 'Practical Decorators',
        content: 'Decorators shine when you want to add the same behaviour to many functions — like measuring how long they take, or checking if a user is logged in. The functools.wraps decorator is important to add inside your decorator — it preserves the original function\'s name and documentation so it doesn\'t get lost.',
        code: `import time
from functools import wraps

# Timing decorator
def timer(func):
    @wraps(func)   # preserve original function name
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {(end-start)*1000:.2f}ms")
        return result
    return wrapper

# Logging decorator
def log_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with args={args}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

@timer
@log_calls
def add_numbers(a, b):
    return a + b

add_numbers(10, 20)`,
      },
    ],
    quiz: [
      {
        question: 'What does it mean that functions are "first-class objects" in Python?',
        options: ['They are always the best functions', 'They can be stored in variables, passed around, and returned', 'They run faster than other code', 'They must be defined first'],
        correctIndex: 1,
        explanation: 'First-class objects can be stored in variables, passed as arguments, and returned from functions — just like numbers or strings.',
      },
      {
        question: 'What does @my_decorator above a function definition do?',
        options: ['Adds a comment', 'Is shorthand for func = my_decorator(func)', 'Calls the function immediately', 'Renames the function'],
        correctIndex: 1,
        explanation: '@my_decorator is syntactic sugar for func = my_decorator(func), replacing the original function with the decorated version.',
      },
      {
        question: 'What do *args and **kwargs in the wrapper function allow?',
        options: ['The decorator to work with any function signature', 'The function to return multiple values', 'The decorator to run faster', 'The function to be called twice'],
        correctIndex: 0,
        explanation: '*args and **kwargs capture any number of positional and keyword arguments, so the wrapper can forward them to any function.',
      },
      {
        question: 'What is the purpose of @wraps(func) inside a decorator?',
        options: ['Makes the decorator run faster', 'Preserves the original function\'s name and docstring', 'Prevents the decorator from running twice', 'Adds error handling'],
        correctIndex: 1,
        explanation: '@wraps(func) copies the original function\'s metadata (__name__, __doc__) onto the wrapper so it does not get hidden.',
      },
      {
        question: 'In a decorator, what should the wrapper function do with the original function\'s return value?',
        options: ['Ignore it', 'Print it', 'Return it', 'Store it in a global variable'],
        correctIndex: 2,
        explanation: 'The wrapper should return the result of calling the original function, otherwise the decorated function will return None.',
      },
    ],
    codeChallenge: {
      prompt: 'Write a decorator called "validate_positive" that checks all numerical arguments are greater than zero before calling the function. If any argument is <= 0, print an error and return None instead of calling the function.',
      starterCode: `from functools import wraps

def validate_positive(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        # Check all args are > 0
        # If not, print an error and return None
        # Otherwise, call and return the original function
        pass
    return wrapper

@validate_positive
def calculate_area(width, height):
    return width * height

print(calculate_area(5, 3))   # Should work: 15
print(calculate_area(-2, 3))  # Should show error
print(calculate_area(4, 0))   # Should show error
`,
      hints: [
        'Loop through args and check if any number is <= 0.',
        'Use isinstance(a, (int, float)) to check if an arg is a number before comparing.',
        'Return None early if validation fails, otherwise return func(*args, **kwargs).',
      ],
      sampleSolution: `from functools import wraps

def validate_positive(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        for arg in args:
            if isinstance(arg, (int, float)) and arg <= 0:
                print(f"Error: all arguments must be positive. Got {arg}")
                return None
        return func(*args, **kwargs)
    return wrapper

@validate_positive
def calculate_area(width, height):
    return width * height

print(calculate_area(5, 3))   # 15
print(calculate_area(-2, 3))  # Error message, None
print(calculate_area(4, 0))   # Error message, None
`,
    },
  },

  // ─── MODULE 14 ──────────────────────────────────────────────────────────────
  {
    id: 'recursive-thinking',
    title: 'Recursive Thinking',
    subtitle: 'Solve problems by solving smaller versions',
    icon: '🌀',
    color: 'from-cyan-500 to-sky-600',
    difficulty: 'advanced',
    xpReward: 275,
    estimatedMinutes: 30,
    prerequisites: ['decorator-workshop'],
    description: 'Recursion is when a function calls itself to solve a smaller version of the same problem. It sounds like a trick, but it is a powerful technique used to solve puzzles, explore trees, and write elegant algorithms.',
    whatYoullLearn: [
      'The concept of a base case and recursive case',
      'Writing recursive functions for maths problems',
      'Recursive data exploration (nested structures)',
      'Avoiding infinite recursion and understanding the call stack',
    ],
    sections: [
      {
        title: 'The Big Idea: Base Case + Recursive Case',
        content: 'Every recursive function needs two parts: a base case (the simple situation you can solve directly, which stops the recursion) and a recursive case (where the function calls itself with a slightly simpler version of the problem). Think of it like Russian nesting dolls — you keep opening dolls until you find the tiny one at the centre (the base case).',
        code: `# Countdown using recursion
def countdown(n):
    if n <= 0:        # BASE CASE: stop here
        print("Blast off!")
    else:             # RECURSIVE CASE: call yourself
        print(n)
        countdown(n - 1)   # call with a smaller number

countdown(5)
# 5
# 4
# 3
# 2
# 1
# Blast off!

# Sum of numbers 1 to n
def sum_to(n):
    if n == 0:        # base case
        return 0
    return n + sum_to(n - 1)   # recursive case

print(sum_to(5))   # 15  (5+4+3+2+1+0)`,
      },
      {
        title: 'Classic Recursive Problems',
        content: 'Factorial and Fibonacci are two classic examples taught with recursion. The factorial of n (written n!) is n multiplied by all numbers below it down to 1. Fibonacci numbers are a sequence where each number is the sum of the two before it. Both problems have beautifully simple recursive solutions that match their mathematical definitions.',
        code: `# Factorial: n! = n * (n-1)!
def factorial(n):
    if n == 0 or n == 1:   # base case
        return 1
    return n * factorial(n - 1)   # recursive case

print(factorial(5))   # 120  (5*4*3*2*1)
print(factorial(0))   # 1

# Fibonacci: fib(n) = fib(n-1) + fib(n-2)
def fib(n):
    if n <= 1:        # base cases: fib(0)=0, fib(1)=1
        return n
    return fib(n - 1) + fib(n - 2)

# Print first 10 Fibonacci numbers
for i in range(10):
    print(fib(i), end=" ")
# 0 1 1 2 3 5 8 13 21 34
print()

# Power: x^n = x * x^(n-1)
def power(base, exp):
    if exp == 0:
        return 1
    return base * power(base, exp - 1)

print(power(2, 8))   # 256`,
      },
      {
        title: 'Recursion on Nested Structures',
        content: 'Recursion really shines when dealing with nested data — like a folder containing sub-folders, or a list containing other lists. You cannot know in advance how deep the nesting goes, which makes loops hard to use. Recursion handles unknown depth naturally because it just keeps going deeper until it hits the base case.',
        code: `# Flatten a deeply nested list
def flatten(lst):
    result = []
    for item in lst:
        if isinstance(item, list):  # it is a sublist — recurse!
            result.extend(flatten(item))
        else:                       # base case: it is a plain item
            result.append(item)
    return result

nested = [1, [2, 3], [4, [5, 6]], [7, [8, [9]]]]
print(flatten(nested))   # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Sum all numbers in nested structure
def deep_sum(lst):
    total = 0
    for item in lst:
        if isinstance(item, list):
            total += deep_sum(item)
        else:
            total += item
    return total

data = [1, [2, 3], [4, [5, [6]]]]
print(deep_sum(data))   # 21`,
      },
    ],
    quiz: [
      {
        question: 'What is the purpose of the base case in a recursive function?',
        options: ['To make the function run faster', 'To stop the recursion and prevent infinite loops', 'To make the function call itself', 'To handle errors'],
        correctIndex: 1,
        explanation: 'The base case is the simplest scenario that can be solved directly. Without it, the function would call itself forever.',
      },
      {
        question: 'What is the value of factorial(4) using the recursive definition?',
        options: ['10', '24', '16', '8'],
        correctIndex: 1,
        explanation: 'factorial(4) = 4 * factorial(3) = 4 * 3 * 2 * 1 = 24.',
      },
      {
        question: 'What happens if a recursive function has no base case?',
        options: ['It returns 0', 'It runs exactly once', 'It causes a RecursionError (stack overflow)', 'It stops automatically after 100 calls'],
        correctIndex: 2,
        explanation: 'Without a base case, the function calls itself forever until Python hits its recursion limit and raises a RecursionError.',
      },
      {
        question: 'In the Fibonacci sequence, what is fib(6)?',
        options: ['8', '13', '6', '5'],
        correctIndex: 0,
        explanation: 'The sequence is 0,1,1,2,3,5,8,13... so fib(6) = 8.',
      },
      {
        question: 'Why is recursion especially good for nested structures?',
        options: ['It is always faster than loops', 'It can handle unknown depth naturally', 'It uses less memory', 'It is easier to write than any loop'],
        correctIndex: 1,
        explanation: 'Recursion handles arbitrary nesting depth naturally — each recursive call goes one level deeper until it hits the bottom (base case).',
      },
    ],
    codeChallenge: {
      prompt: 'Write a recursive function called "palindrome_check" that checks if a string is a palindrome (reads the same forwards and backwards). Do NOT use slicing — instead compare the first and last characters, then recurse on the middle.',
      starterCode: `# Recursive Palindrome Checker
def palindrome_check(s):
    # Base case: strings of length 0 or 1 are palindromes
    # Recursive case: first and last chars must match,
    #                 AND the middle must also be a palindrome
    pass

print(palindrome_check("racecar"))  # True
print(palindrome_check("hello"))    # False
print(palindrome_check("level"))    # True
print(palindrome_check("a"))        # True
print(palindrome_check(""))         # True
`,
      hints: [
        'Base case: if len(s) <= 1, return True.',
        'If s[0] != s[-1], return False immediately.',
        'Otherwise return palindrome_check(s[1:-1]) — the middle part.',
      ],
      sampleSolution: `# Recursive Palindrome Checker
def palindrome_check(s):
    # Base case
    if len(s) <= 1:
        return True
    # If first and last don't match, not a palindrome
    if s[0] != s[-1]:
        return False
    # Recurse on the middle
    return palindrome_check(s[1:-1])

print(palindrome_check("racecar"))  # True
print(palindrome_check("hello"))    # False
print(palindrome_check("level"))    # True
print(palindrome_check("a"))        # True
print(palindrome_check(""))         # True
`,
    },
  },

  // ─── MODULE 15 ──────────────────────────────────────────────────────────────
  {
    id: 'algorithm-arena',
    title: 'Algorithm Arena',
    subtitle: 'Learn the art of problem solving',
    icon: '⚔️',
    color: 'from-orange-500 to-red-600',
    difficulty: 'advanced',
    xpReward: 300,
    estimatedMinutes: 35,
    prerequisites: ['recursive-thinking'],
    description: 'Algorithms are step-by-step recipes for solving problems efficiently. Learn classic sorting and searching algorithms and understand why choosing the right algorithm matters.',
    whatYoullLearn: [
      'Bubble sort and selection sort algorithms',
      'Binary search vs linear search',
      'Big O notation: understanding algorithm speed',
      'Implementing and comparing algorithms',
    ],
    sections: [
      {
        title: 'Sorting Algorithms',
        content: 'Sorting means arranging items in order. There are many ways to do it, and each has different speed and complexity. Bubble sort repeatedly swaps adjacent items that are in the wrong order — like bubbles rising in water. Selection sort finds the smallest item and moves it to the front, then does the same for the rest. Both are easy to understand but slow for large lists.',
        code: `# Bubble Sort: repeatedly swap neighbours if out of order
def bubble_sort(lst):
    lst = lst[:]  # make a copy so we don't modify the original
    n = len(lst)
    for i in range(n):
        for j in range(0, n - i - 1):
            if lst[j] > lst[j + 1]:
                lst[j], lst[j + 1] = lst[j + 1], lst[j]
    return lst

# Selection Sort: find minimum, put it at the front
def selection_sort(lst):
    lst = lst[:]
    for i in range(len(lst)):
        min_idx = i
        for j in range(i + 1, len(lst)):
            if lst[j] < lst[min_idx]:
                min_idx = j
        lst[i], lst[min_idx] = lst[min_idx], lst[i]
    return lst

data = [64, 25, 12, 22, 11]
print("Original:  ", data)
print("Bubble:    ", bubble_sort(data))
print("Selection: ", selection_sort(data))`,
      },
      {
        title: 'Searching Algorithms',
        content: 'Linear search checks every item one by one until it finds the target — simple but slow. Binary search is much faster but only works on SORTED lists. It works like guessing a number between 1 and 100: start in the middle, then ask "is it higher or lower?" and eliminate half the remaining options each time. Binary search is dramatically faster for large datasets.',
        code: `# Linear Search: check every item
def linear_search(lst, target):
    for i, item in enumerate(lst):
        if item == target:
            return i   # found at index i
    return -1          # not found

# Binary Search: only works on sorted list!
def binary_search(lst, target):
    low, high = 0, len(lst) - 1
    steps = 0
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        if lst[mid] == target:
            print(f"Found in {steps} steps!")
            return mid
        elif lst[mid] < target:
            low = mid + 1   # target is in the right half
        else:
            high = mid - 1  # target is in the left half
    return -1

numbers = list(range(1, 101))   # 1 to 100, already sorted
print(binary_search(numbers, 73))   # Found in ~7 steps
print(linear_search(numbers, 73))   # Would take 73 steps`,
      },
      {
        title: 'Big O Notation',
        content: 'Big O notation is a way to describe how fast an algorithm is as the input gets larger. O(n) means the time grows proportionally with input size — if you double the data, it takes twice as long. O(n²) means it grows much faster — doubling the data makes it 4 times slower. O(log n) is very fast — binary search only needs about 7 steps even for 100 items!',
        code: `# O(1) — Constant time: always same speed
def get_first(lst):
    return lst[0]

# O(n) — Linear time: grows with input
def find_max(lst):
    max_val = lst[0]
    for item in lst:
        if item > max_val:
            max_val = item
    return max_val

# O(n^2) — Quadratic: nested loops
def has_duplicate(lst):
    for i in range(len(lst)):
        for j in range(i + 1, len(lst)):
            if lst[i] == lst[j]:
                return True
    return False

# O(log n) — Logarithmic: binary search
# For 1,000,000 items:
# Linear: up to 1,000,000 steps
# Binary: only about 20 steps!
import math
n = 1_000_000
print(f"Linear steps: {n}")
print(f"Binary steps: ~{int(math.log2(n)) + 1}")`,
      },
    ],
    quiz: [
      {
        question: 'What does bubble sort do in each pass through the list?',
        options: ['Finds the minimum element', 'Swaps adjacent elements that are in the wrong order', 'Splits the list in half', 'Removes duplicates'],
        correctIndex: 1,
        explanation: 'Bubble sort repeatedly compares and swaps adjacent elements, moving larger elements towards the end like bubbles rising.',
      },
      {
        question: 'Why must the list be sorted before using binary search?',
        options: ['To make it faster', 'Because binary search relies on eliminating halves based on comparison, which only works in order', 'Binary search sorts it first', 'It does not need to be sorted'],
        correctIndex: 1,
        explanation: 'Binary search decides to go left or right based on whether the target is less or greater than the midpoint — this logic only works correctly on a sorted list.',
      },
      {
        question: 'How many steps does binary search take to find an item in a list of 1024 items?',
        options: ['1024', '512', 'About 10', 'About 100'],
        correctIndex: 2,
        explanation: 'Binary search takes log₂(n) steps. log₂(1024) = 10, so about 10 steps regardless of which item you are looking for.',
      },
      {
        question: 'What does O(n²) mean?',
        options: ['The algorithm always takes n steps', 'The time grows with the square of the input size', 'The algorithm uses n² memory', 'The algorithm has n² bugs'],
        correctIndex: 1,
        explanation: 'O(n²) means if you double the input, the time quadruples. Algorithms with nested loops over the same data are typically O(n²).',
      },
      {
        question: 'Which is fastest for searching a sorted list of 1 million items?',
        options: ['Linear search', 'Bubble sort then linear search', 'Binary search', 'Selection sort then linear search'],
        correctIndex: 2,
        explanation: 'Binary search (O(log n)) finds the item in about 20 steps. Linear search (O(n)) might take up to 1 million steps.',
      },
    ],
    codeChallenge: {
      prompt: 'Implement insertion sort — it builds a sorted list one item at a time by taking each new item and inserting it into its correct position. Then test it on a list of numbers and strings.',
      starterCode: `# Insertion Sort
def insertion_sort(lst):
    lst = lst[:]   # copy so original is unchanged
    # For each element starting from index 1:
    #   move it left until it is in the right position
    for i in range(1, len(lst)):
        key = lst[i]
        j = i - 1
        # Move elements that are greater than key one position forward
        # (fill in the inner loop here)
        lst[j + 1] = key
    return lst

numbers = [38, 27, 43, 3, 9, 82, 10]
print(insertion_sort(numbers))

words = ["banana", "apple", "cherry", "date"]
print(insertion_sort(words))
`,
      hints: [
        'The inner while loop should run while j >= 0 AND lst[j] > key.',
        'Inside the loop, shift lst[j] one position right: lst[j+1] = lst[j], then j -= 1.',
        'After the while loop, place key at lst[j+1].',
      ],
      sampleSolution: `# Insertion Sort
def insertion_sort(lst):
    lst = lst[:]
    for i in range(1, len(lst)):
        key = lst[i]
        j = i - 1
        while j >= 0 and lst[j] > key:
            lst[j + 1] = lst[j]
            j -= 1
        lst[j + 1] = key
    return lst

numbers = [38, 27, 43, 3, 9, 82, 10]
print(insertion_sort(numbers))  # [3, 9, 10, 27, 38, 43, 82]

words = ["banana", "apple", "cherry", "date"]
print(insertion_sort(words))  # ['apple', 'banana', 'cherry', 'date']
`,
    },
  },

  // ─── MODULE 16 ──────────────────────────────────────────────────────────────
  {
    id: 'data-structures-lab',
    title: 'Data Structures Lab',
    subtitle: 'Stacks, queues, and linked lists',
    icon: '🧪',
    color: 'from-teal-500 to-cyan-600',
    difficulty: 'expert',
    xpReward: 325,
    estimatedMinutes: 35,
    prerequisites: ['algorithm-arena'],
    description: 'Data structures are specialised ways of organising data to make certain operations fast and efficient. Build stacks, queues, and linked lists from scratch using Python classes.',
    whatYoullLearn: [
      'Stack: Last-In First-Out (LIFO) using a list',
      'Queue: First-In First-Out (FIFO) with deque',
      'Linked list: nodes connected by references',
      'When to use each data structure',
    ],
    sections: [
      {
        title: 'Stacks — Last In, First Out',
        content: 'A stack is like a stack of pancakes — you can only add or remove from the top. The last pancake you put on is the first one you eat. This is called LIFO (Last In, First Out). Stacks are used by Python itself to track function calls, by browsers to manage back/forward history, and by text editors for undo operations.',
        code: `class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        """Add item to the top"""
        self._items.append(item)

    def pop(self):
        """Remove and return the top item"""
        if self.is_empty():
            raise IndexError("Stack is empty!")
        return self._items.pop()

    def peek(self):
        """Look at the top without removing"""
        return self._items[-1] if not self.is_empty() else None

    def is_empty(self):
        return len(self._items) == 0

    def __len__(self):
        return len(self._items)

    def __str__(self):
        return f"Stack{self._items} <- top"

s = Stack()
s.push("A")
s.push("B")
s.push("C")
print(s)          # Stack['A', 'B', 'C'] <- top
print(s.pop())    # C
print(s.peek())   # B`,
      },
      {
        title: 'Queues — First In, First Out',
        content: 'A queue is like a line at a shop — the first person in line is the first to be served. This is called FIFO (First In, First Out). Python\'s collections.deque (pronounced "deck") is perfect for queues because adding to one end and removing from the other are both super fast — much faster than using a plain list.',
        code: `from collections import deque

class Queue:
    def __init__(self):
        self._items = deque()

    def enqueue(self, item):
        """Add to the back of the queue"""
        self._items.append(item)

    def dequeue(self):
        """Remove from the front of the queue"""
        if self.is_empty():
            raise IndexError("Queue is empty!")
        return self._items.popleft()

    def front(self):
        """Peek at the front item"""
        return self._items[0] if not self.is_empty() else None

    def is_empty(self):
        return len(self._items) == 0

    def __len__(self):
        return len(self._items)

q = Queue()
q.enqueue("Alice")
q.enqueue("Bob")
q.enqueue("Carol")
print(q.front())     # Alice (first in line)
print(q.dequeue())   # Alice (served first)
print(q.dequeue())   # Bob`,
      },
      {
        title: 'Linked Lists',
        content: 'A linked list is a chain of nodes where each node stores data AND a reference (pointer) to the next node. Unlike lists which are stored contiguously in memory, linked list nodes can be anywhere. Inserting at the front is O(1) — very fast! But finding an item requires walking the chain from the start, which is O(n).',
        code: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None  # points to the next node

class LinkedList:
    def __init__(self):
        self.head = None  # the first node

    def prepend(self, data):
        """Add to the front — O(1)"""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def append(self, data):
        """Add to the end — O(n)"""
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node

    def __str__(self):
        nodes = []
        current = self.head
        while current:
            nodes.append(str(current.data))
            current = current.next
        return " -> ".join(nodes)

ll = LinkedList()
ll.append(1)
ll.append(2)
ll.append(3)
ll.prepend(0)
print(ll)   # 0 -> 1 -> 2 -> 3`,
      },
    ],
    quiz: [
      {
        question: 'What does LIFO stand for?',
        options: ['Last Item For Output', 'Last In First Out', 'List In First Order', 'Large Integer Format Object'],
        correctIndex: 1,
        explanation: 'LIFO stands for Last In First Out — the most recently added item is the first one removed, like a stack of plates.',
      },
      {
        question: 'Which Python method makes pop() from the FRONT of a deque efficient?',
        options: ['pop()', 'popleft()', 'remove(0)', 'shift()'],
        correctIndex: 1,
        explanation: 'popleft() removes from the front of a deque in O(1) time. Using pop(0) on a regular list is O(n) because all remaining items must shift.',
      },
      {
        question: 'In a linked list, what does each node contain?',
        options: ['Only data', 'Only a pointer to the next node', 'Data AND a pointer to the next node', 'An index and data'],
        correctIndex: 2,
        explanation: 'Each linked list node stores both its data and a reference (next) pointing to the following node in the chain.',
      },
      {
        question: 'What is the time complexity of inserting at the front of a linked list?',
        options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
        correctIndex: 3,
        explanation: 'Inserting at the front just requires updating the head pointer, which always takes the same amount of time regardless of list size — O(1).',
      },
      {
        question: 'Which data structure would you use to model a printer job queue?',
        options: ['Stack', 'Queue', 'Linked list', 'Dictionary'],
        correctIndex: 1,
        explanation: 'A queue (FIFO) is perfect for a print queue — the first document sent to print should be the first one printed.',
      },
    ],
    codeChallenge: {
      prompt: 'Use a Stack to check if brackets in a string are balanced. For every opening bracket (, [ or {, push it. For every closing bracket, check it matches the top of the stack. Return True if all brackets match, False otherwise.',
      starterCode: `# Bracket Balancer using a Stack
class Stack:
    def __init__(self):
        self._items = []
    def push(self, item):
        self._items.append(item)
    def pop(self):
        return self._items.pop() if self._items else None
    def peek(self):
        return self._items[-1] if self._items else None
    def is_empty(self):
        return len(self._items) == 0

def is_balanced(text):
    # matching pairs
    matches = {')': '(', ']': '[', '}': '{'}
    stack = Stack()
    # loop through each character
    pass

print(is_balanced("(hello [world])"))  # True
print(is_balanced("(oops]"))           # False
print(is_balanced("{[()]}"))           # True
`,
      hints: [
        'If the character is an opening bracket, push it.',
        'If the character is a closing bracket, pop from the stack and check it matches.',
        'At the end, the stack should be empty for a balanced string.',
      ],
      sampleSolution: `# Bracket Balancer using a Stack
class Stack:
    def __init__(self):
        self._items = []
    def push(self, item):
        self._items.append(item)
    def pop(self):
        return self._items.pop() if self._items else None
    def is_empty(self):
        return len(self._items) == 0

def is_balanced(text):
    matches = {')': '(', ']': '[', '}': '{'}
    stack = Stack()
    for ch in text:
        if ch in "([{":
            stack.push(ch)
        elif ch in ")]}":
            if stack.is_empty() or stack.pop() != matches[ch]:
                return False
    return stack.is_empty()

print(is_balanced("(hello [world])"))  # True
print(is_balanced("(oops]"))           # False
print(is_balanced("{[()]}"))           # True
print(is_balanced("((())"))            # False
`,
    },
  },

  // ─── MODULE 17 ──────────────────────────────────────────────────────────────
  {
    id: 'json-api-ninja',
    title: 'JSON & API Ninja',
    subtitle: 'Talk to the internet with Python',
    icon: '🥷',
    color: 'from-purple-500 to-indigo-600',
    difficulty: 'expert',
    xpReward: 325,
    estimatedMinutes: 30,
    prerequisites: ['data-structures-lab'],
    description: 'JSON is the language the internet uses to share data, and APIs let your program talk to websites and services. Learn to work with JSON files and understand how to structure API requests.',
    whatYoullLearn: [
      'What JSON is and how it maps to Python dictionaries',
      'Reading and writing JSON files with the json module',
      'Understanding API requests and responses',
      'Parsing and extracting data from JSON structures',
    ],
    sections: [
      {
        title: 'JSON — JavaScript Object Notation',
        content: 'JSON is a simple text format for storing and sharing data. It looks very much like a Python dictionary or list! JSON uses the same curly braces, square brackets, strings in double quotes, and numbers. Python\'s built-in json module makes converting between JSON text and Python objects extremely easy.',
        code: `import json

# Python dictionary
person = {
    "name": "Alex",
    "age": 11,
    "hobbies": ["coding", "gaming", "reading"],
    "address": {
        "city": "London",
        "country": "UK"
    }
}

# Convert Python dict to JSON string
json_string = json.dumps(person, indent=2)
print(json_string)
print(type(json_string))  # <class 'str'>

# Convert JSON string back to Python dict
data = json.loads(json_string)
print(data["name"])         # Alex
print(data["hobbies"][1])   # gaming
print(data["address"]["city"])  # London`,
      },
      {
        title: 'Reading & Writing JSON Files',
        content: 'JSON is often stored in .json files. The json module provides json.dump() to write Python data as JSON into a file, and json.load() to read a JSON file back into Python. This is how many programs save their settings and data. Notice the difference between dumps/loads (strings) and dump/load (files) — the "s" stands for "string".',
        code: `import json

# Sample data to save
game_save = {
    "player": "Luna",
    "level": 12,
    "score": 48500,
    "inventory": ["sword", "shield", "potion"],
    "achievements": ["first_kill", "treasure_hunter"]
}

# Write to a JSON file
with open("save_game.json", "w") as f:
    json.dump(game_save, f, indent=2)
print("Game saved!")

# Read from the JSON file
with open("save_game.json", "r") as f:
    loaded = json.load(f)

print(f"Welcome back, {loaded['player']}!")
print(f"Level: {loaded['level']}, Score: {loaded['score']}")
print(f"Inventory: {', '.join(loaded['inventory'])}")`,
      },
      {
        title: 'Parsing JSON Data',
        content: 'Real-world JSON from APIs can be deeply nested and complex. The key skill is navigating the structure to extract exactly what you need. Treat it like a treasure hunt: follow the keys to dig deeper. Always use .get() for safety when the key might not exist, and check if a value is a list before looping through it.',
        code: `import json

# Simulate API response data
api_response = """
{
  "status": "success",
  "total": 3,
  "users": [
    {"id": 1, "name": "Alice", "score": 9200, "active": true},
    {"id": 2, "name": "Bob",   "score": 7100, "active": false},
    {"id": 3, "name": "Carol", "score": 8800, "active": true}
  ]
}
"""

data = json.loads(api_response)

# Extract information
print(f"Status: {data['status']}")
print(f"Total users: {data['total']}")

# Find only active users with score > 8000
top_active = [
    u for u in data["users"]
    if u.get("active") and u.get("score", 0) > 8000
]

for user in top_active:
    print(f"  {user['name']}: {user['score']}")`,
      },
    ],
    quiz: [
      {
        question: 'What does json.dumps(data) do?',
        options: ['Reads JSON from a file', 'Converts a Python object to a JSON string', 'Writes JSON to a file', 'Parses a JSON string into Python'],
        correctIndex: 1,
        explanation: 'json.dumps() (dump string) converts a Python dictionary or list into a JSON-formatted string.',
      },
      {
        question: 'What does json.load(f) do?',
        options: ['Converts a Python object to JSON text', 'Reads a JSON string variable', 'Reads a JSON file and returns a Python object', 'Validates JSON format'],
        correctIndex: 2,
        explanation: 'json.load() reads from a file object and returns the data as a Python dictionary or list.',
      },
      {
        question: 'Which Python type does a JSON object {} become?',
        options: ['list', 'tuple', 'dict', 'set'],
        correctIndex: 2,
        explanation: 'JSON objects (key-value pairs in curly braces) map directly to Python dictionaries.',
      },
      {
        question: 'What is the difference between json.dump and json.dumps?',
        options: ['dumps is faster', 'dump writes to a file; dumps creates a string', 'dump creates a string; dumps writes to a file', 'There is no difference'],
        correctIndex: 1,
        explanation: 'json.dump() writes to a file object; json.dumps() returns a string. The "s" in dumps stands for "string".',
      },
      {
        question: 'How do you safely get a value that might not exist in a parsed JSON dict?',
        options: ['data[key]', 'data.get(key)', 'data.find(key)', 'json.get(data, key)'],
        correctIndex: 1,
        explanation: 'Using .get(key) returns None instead of raising a KeyError when the key is missing, making your code safer.',
      },
    ],
    codeChallenge: {
      prompt: 'Write a program that manages a list of books as a JSON file. It should save a list of books (each with title, author, year, rating) to "books.json", then load it and print only books rated above 4.0, sorted by rating descending.',
      starterCode: `import json

books = [
    {"title": "The Hobbit",       "author": "Tolkien",  "year": 1937, "rating": 4.8},
    {"title": "Harry Potter",     "author": "Rowling",  "year": 1997, "rating": 4.7},
    {"title": "Dune",             "author": "Herbert",  "year": 1965, "rating": 4.2},
    {"title": "Eragon",           "author": "Paolini",  "year": 2003, "rating": 3.9},
    {"title": "Percy Jackson",    "author": "Riordan",  "year": 2005, "rating": 4.5},
]

# Step 1: Save to books.json

# Step 2: Load from books.json

# Step 3: Filter rating > 4.0 and sort by rating descending, then print
`,
      hints: [
        'Use json.dump(books, f, indent=2) inside a with open("books.json","w") block.',
        'Use json.load(f) inside a with open("books.json","r") block to read it back.',
        'Use sorted(loaded, key=lambda b: b["rating"], reverse=True) to sort.',
      ],
      sampleSolution: `import json

books = [
    {"title": "The Hobbit",    "author": "Tolkien", "year": 1937, "rating": 4.8},
    {"title": "Harry Potter",  "author": "Rowling", "year": 1997, "rating": 4.7},
    {"title": "Dune",          "author": "Herbert", "year": 1965, "rating": 4.2},
    {"title": "Eragon",        "author": "Paolini", "year": 2003, "rating": 3.9},
    {"title": "Percy Jackson", "author": "Riordan", "year": 2005, "rating": 4.5},
]

# Save
with open("books.json", "w") as f:
    json.dump(books, f, indent=2)
print("Saved books.json")

# Load
with open("books.json", "r") as f:
    loaded = json.load(f)

# Filter and sort
top_books = sorted(
    [b for b in loaded if b["rating"] > 4.0],
    key=lambda b: b["rating"],
    reverse=True
)

print("\\nTop rated books:")
for book in top_books:
    print(f"  {book['rating']} - {book['title']} by {book['author']}")
`,
    },
  },

  // ─── MODULE 18 ──────────────────────────────────────────────────────────────
  {
    id: 'regex-master',
    title: 'Regex Master',
    subtitle: 'Find patterns in text like a detective',
    icon: '🔍',
    color: 'from-rose-500 to-red-600',
    difficulty: 'expert',
    xpReward: 350,
    estimatedMinutes: 35,
    prerequisites: ['json-api-ninja'],
    description: 'Regular expressions (regex) are a miniature language for describing text patterns. They let you search, validate, and extract data from text in ways that would take dozens of lines of normal code.',
    whatYoullLearn: [
      'Basic regex patterns: characters, digits, wildcards',
      'Quantifiers: *, +, ?, {n,m}',
      'Groups and special sequences: \\d, \\w, \\s',
      'Using re.search, re.findall, and re.sub',
    ],
    sections: [
      {
        title: 'Your First Patterns',
        content: 'A regular expression (regex) is a pattern that describes what text you are looking for. The simplest pattern is just a literal string like "cat" — it finds the word cat in text. Special characters like . (any character), \\d (any digit), and \\w (any letter or digit) let you describe flexible patterns. Python\'s re module provides all the tools for working with regex.',
        code: `import re

text = "Hello! My number is 555-1234 and I scored 100 points."

# re.search: find first match anywhere in the string
match = re.search(r"\\d+", text)   # \\d+ means one or more digits
if match:
    print("Found number:", match.group())  # 555

# re.findall: find ALL matches and return a list
all_numbers = re.findall(r"\\d+", text)
print("All numbers:", all_numbers)  # ['555', '1234', '100']

# . matches any single character
# . + means one or more of any character
words = re.findall(r"\\w+", text)
print("Words:", words[:5])   # first 5 words

# Literal pattern
print(re.search(r"scored", text).group())  # scored`,
      },
      {
        title: 'Quantifiers and Character Classes',
        content: 'Quantifiers control how many times a pattern repeats. The * means zero or more, + means one or more, ? means zero or one (optional), and {n,m} means between n and m times. Character classes inside [] let you specify a set of allowed characters. For example, [aeiou] matches any vowel, and [0-9] matches any digit.',
        code: `import re

# Quantifiers
test = "colour color colouur"
# {1,2} means 1 or 2 times
matches = re.findall(r"colou{1,2}r", test)
print(matches)   # ['colour', 'color'] — wait, 'color' has 0 u's

# Better: use ? to make 'u' optional
matches = re.findall(r"colou?r", test)
print(matches)   # ['colour', 'color']

# Character classes []
# Match 3 digits, a dash, 4 digits (phone number)
phones = "Call 555-1234 or 800-9876 today!"
phone_matches = re.findall(r"\\d{3}-\\d{4}", phones)
print(phone_matches)   # ['555-1234', '800-9876']

# [A-Z] matches any uppercase letter
words = "Hello World PYTHON code"
upper_words = re.findall(r"[A-Z][a-z]+", words)
print(upper_words)  # words starting with capital: ['Hello', 'World']`,
      },
      {
        title: 'Groups, Search, and Substitution',
        content: 'Parentheses () create groups in regex, which let you capture specific parts of a match. re.sub() replaces text matching a pattern with something new — like find-and-replace on steroids. These tools together let you parse structured text, validate formats like emails, and clean up messy data.',
        code: `import re

# Groups: capture specific parts
log = "2024-01-15 ERROR: Disk full on server-3"
pattern = r"(\\d{4}-\\d{2}-\\d{2}) (\\w+): (.+)"
match = re.search(pattern, log)
if match:
    date = match.group(1)   # first group
    level = match.group(2)  # second group
    msg = match.group(3)    # third group
    print(f"Date: {date}, Level: {level}")
    print(f"Message: {msg}")

# re.sub: replace pattern with something new
dirty = "Hello,,,   World...   Python!!!"
clean = re.sub(r"[^\\w\\s]", "", dirty)  # remove non-word non-space chars
clean = re.sub(r"\\s+", " ", clean).strip()  # collapse multiple spaces
print(clean)  # Hello   World   Python

# Email validation pattern
emails = ["user@example.com", "bad-email", "a@b.org"]
for email in emails:
    if re.match(r"^[\\w.-]+@[\\w.-]+\\.\\w{2,}$", email):
        print(f"Valid: {email}")
    else:
        print(f"Invalid: {email}")`,
      },
    ],
    quiz: [
      {
        question: 'What does \\d match in a regex pattern?',
        options: ['Any letter', 'Any digit (0-9)', 'Any whitespace', 'Any non-digit'],
        correctIndex: 1,
        explanation: '\\d is a special sequence that matches any single digit character from 0 to 9.',
      },
      {
        question: 'What does the + quantifier mean?',
        options: ['Zero or one of the preceding pattern', 'Zero or more of the preceding pattern', 'One or more of the preceding pattern', 'Exactly two of the preceding pattern'],
        correctIndex: 2,
        explanation: '+ means one or more — the pattern must appear at least once. Compare with * which means zero or more.',
      },
      {
        question: 'What does re.findall(pattern, text) return?',
        options: ['The first match only', 'A list of all matches', 'True or False', 'The number of matches'],
        correctIndex: 1,
        explanation: 're.findall() finds all non-overlapping matches and returns them as a list of strings.',
      },
      {
        question: 'What does [aeiou] match?',
        options: ['The word "aeiou"', 'Any vowel', 'Any consonant', 'Any letter'],
        correctIndex: 1,
        explanation: 'Square brackets define a character class — [aeiou] matches any single character that is one of those vowels.',
      },
      {
        question: 'What does re.sub(r"\\s+", " ", text) do?',
        options: ['Removes all spaces', 'Replaces multiple consecutive spaces with a single space', 'Counts spaces', 'Splits the text at spaces'],
        correctIndex: 1,
        explanation: 're.sub replaces every match of the pattern with the replacement string. \\s+ matches one or more whitespace characters, replacing them with a single space.',
      },
    ],
    codeChallenge: {
      prompt: 'Write a function that extracts all email addresses and phone numbers from a block of text. Phone numbers follow the pattern: 3 digits, dash, 3 digits, dash, 4 digits (e.g. 123-456-7890). Return a dictionary with keys "emails" and "phones".',
      starterCode: `import re

def extract_contacts(text):
    # Pattern for email: word chars/dots/hyphens @ domain . extension
    # Pattern for phone: ###-###-####
    emails = []
    phones = []
    return {"emails": emails, "phones": phones}

sample = """
Contact us at support@example.com or sales@shop.org
Phone: 123-456-7890 or 800-555-1234
Also reach: admin@company.co.uk
"""

result = extract_contacts(sample)
print("Emails:", result["emails"])
print("Phones:", result["phones"])
`,
      hints: [
        'Use re.findall(r"[\\w.-]+@[\\w.-]+\\.\\w+", text) for emails.',
        'Use re.findall(r"\\d{3}-\\d{3}-\\d{4}", text) for phone numbers.',
        'Return the results in the dictionary.',
      ],
      sampleSolution: `import re

def extract_contacts(text):
    emails = re.findall(r"[\\w.-]+@[\\w.-]+\\.\\w+", text)
    phones = re.findall(r"\\d{3}-\\d{3}-\\d{4}", text)
    return {"emails": emails, "phones": phones}

sample = """
Contact us at support@example.com or sales@shop.org
Phone: 123-456-7890 or 800-555-1234
Also reach: admin@company.co.uk
"""

result = extract_contacts(sample)
print("Emails:", result["emails"])
print("Phones:", result["phones"])
`,
    },
  },

  // ─── MODULE 19 ──────────────────────────────────────────────────────────────
  {
    id: 'numpy-adventure',
    title: 'NumPy Adventure',
    subtitle: 'Superfast maths with arrays',
    icon: '🔢',
    color: 'from-blue-600 to-indigo-700',
    difficulty: 'expert',
    xpReward: 375,
    estimatedMinutes: 40,
    prerequisites: ['regex-master'],
    description: 'NumPy gives Python the power to do maths on huge arrays of numbers at incredible speed. It is the foundation of all scientific computing, data science, and machine learning in Python.',
    whatYoullLearn: [
      'Creating and manipulating NumPy arrays',
      'Array operations: arithmetic, slicing, and broadcasting',
      'Useful NumPy functions: mean, sum, max, reshape',
      'The difference between Python lists and NumPy arrays',
    ],
    sections: [
      {
        title: 'Creating NumPy Arrays',
        content: 'A NumPy array is like a Python list, but it can only hold one type of data (usually numbers) and it is much faster for maths. When you do maths on a NumPy array, the operation applies to every element automatically — no for loop needed! This is called vectorisation, and it can be hundreds of times faster than a regular Python loop.',
        code: `import numpy as np

# Create array from a list
arr = np.array([1, 2, 3, 4, 5])
print(arr)            # [1 2 3 4 5]
print(arr.dtype)      # int64
print(arr.shape)      # (5,)

# Arrays of zeros, ones, or a range
zeros = np.zeros(5)
ones  = np.ones((2, 3))   # 2 rows, 3 columns
rng   = np.arange(0, 10, 2)   # 0, 2, 4, 6, 8
linsp = np.linspace(0, 1, 5)  # 5 evenly spaced values from 0 to 1

print(zeros)   # [0. 0. 0. 0. 0.]
print(ones)
print(rng)     # [0 2 4 6 8]
print(linsp)   # [0.   0.25 0.5  0.75 1.  ]

# 2D array (matrix)
matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])
print(matrix.shape)  # (2, 3) — 2 rows, 3 columns`,
      },
      {
        title: 'Array Maths and Operations',
        content: 'One of the most powerful features of NumPy is that you can do maths on a whole array at once. Adding, multiplying, or applying a function to every element happens in one line without a loop. NumPy also supports "broadcasting" — doing maths between arrays of different shapes in smart ways.',
        code: `import numpy as np

a = np.array([1, 2, 3, 4, 5])
b = np.array([10, 20, 30, 40, 50])

# Arithmetic on entire arrays at once
print(a + b)        # [11 22 33 44 55]
print(a * 3)        # [ 3  6  9 12 15]
print(b / 10)       # [ 1.  2.  3.  4.  5.]
print(a ** 2)       # [ 1  4  9 16 25]

# Comparison: returns boolean array
print(a > 3)        # [False False False  True  True]

# Use boolean array to filter
big = a[a > 3]
print(big)          # [4 5]

# Statistical functions
data = np.array([85, 92, 78, 95, 88, 72, 96, 81])
print(f"Mean: {np.mean(data):.1f}")
print(f"Max: {np.max(data)}")
print(f"Min: {np.min(data)}")
print(f"Std dev: {np.std(data):.2f}")`,
      },
      {
        title: 'Slicing and Reshaping',
        content: 'NumPy slicing works like list slicing but in multiple dimensions. For a 2D array, you can slice rows AND columns separately using a comma. Reshape lets you change the shape of an array without changing its data — turning a flat list into a grid, for example. This is essential for preparing data for machine learning models.',
        code: `import numpy as np

# 2D array slicing
grid = np.array([
    [1,  2,  3,  4],
    [5,  6,  7,  8],
    [9, 10, 11, 12]
])

print(grid[0])         # first row:  [1 2 3 4]
print(grid[:, 1])      # second col: [2 6 10]
print(grid[0:2, 1:3])  # top-middle 2x2 block
# [[2 3]
#  [6 7]]

# Reshape: turn 12 numbers into 3 rows of 4
flat = np.arange(1, 13)
reshaped = flat.reshape(3, 4)
print(reshaped)

# Transpose: flip rows and columns
print(reshaped.T)

# Stack arrays together
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
combined = np.vstack([a, b])   # stack vertically
print(combined)
# [[1 2 3]
#  [4 5 6]]`,
      },
    ],
    quiz: [
      {
        question: 'What does np.zeros(4) create?',
        options: ['An array of 4 ones', 'An empty list', 'An array of 4 zeros', 'The number 0 repeated 4 times'],
        correctIndex: 2,
        explanation: 'np.zeros(4) creates a NumPy array of shape (4,) containing [0. 0. 0. 0.].',
      },
      {
        question: 'If arr = np.array([1,2,3,4]), what does arr * 3 return?',
        options: ['[3,3,3,3]', '[1,2,3,4,1,2,3,4,1,2,3,4]', 'An error', '[3,6,9,12]'],
        correctIndex: 3,
        explanation: 'NumPy multiplies every element by 3: [1*3, 2*3, 3*3, 4*3] = [3, 6, 9, 12].',
      },
      {
        question: 'What does arr[arr > 5] do for arr = np.array([3,7,2,8,1])?',
        options: ['Returns [5]', 'Returns elements greater than 5: [7, 8]', 'Returns indices where arr > 5', 'Returns True or False for each element'],
        correctIndex: 1,
        explanation: 'Boolean indexing: arr > 5 creates [False,True,False,True,False], which is used to select [7, 8].',
      },
      {
        question: 'What does np.mean([10, 20, 30]) return?',
        options: ['10', '20.0', '30', '60'],
        correctIndex: 1,
        explanation: 'np.mean calculates the average: (10+20+30)/3 = 20.0.',
      },
      {
        question: 'For a 2D array grid, what does grid[:, 0] select?',
        options: ['The first row', 'The first column', 'All rows and columns', 'The last column'],
        correctIndex: 1,
        explanation: 'In 2D indexing [rows, cols], : means "all rows" and 0 means "column at index 0" — so grid[:,0] selects the entire first column.',
      },
    ],
    codeChallenge: {
      prompt: 'Use NumPy to analyse test scores for 4 students across 3 subjects. Create a 4x3 array of scores, then calculate: each student\'s average score, each subject\'s average score, and find which student has the highest overall average.',
      starterCode: `import numpy as np

# 4 students, 3 subjects: Maths, Science, English
scores = np.array([
    [88, 92, 85],   # Student 1
    [75, 68, 82],   # Student 2
    [95, 91, 97],   # Student 3
    [62, 70, 65],   # Student 4
])

# Calculate each student's average (mean across columns, axis=1)
student_avgs = None

# Calculate each subject's average (mean across rows, axis=0)
subject_avgs = None

# Find which student (index) has the highest average
best_student = None

print("Student averages:", student_avgs)
print("Subject averages:", subject_avgs)
print("Best student index:", best_student)
`,
      hints: [
        'Use np.mean(scores, axis=1) to average across columns (one value per student).',
        'Use np.mean(scores, axis=0) to average across rows (one value per subject).',
        'Use np.argmax(student_avgs) to find the index of the highest value.',
      ],
      sampleSolution: `import numpy as np

scores = np.array([
    [88, 92, 85],
    [75, 68, 82],
    [95, 91, 97],
    [62, 70, 65],
])

student_avgs = np.mean(scores, axis=1)
subject_avgs = np.mean(scores, axis=0)
best_student = np.argmax(student_avgs)

print("Student averages:", student_avgs)
print("Subject averages:", subject_avgs)
print(f"Best student: Student {best_student + 1} with avg {student_avgs[best_student]:.1f}")

# Bonus: mark pass/fail (>= 70)
pass_fail = np.where(scores >= 70, "Pass", "Fail")
print("\\nPass/Fail grid:")
print(pass_fail)
`,
    },
  },

  // ─── MODULE 20 ──────────────────────────────────────────────────────────────
  {
    id: 'pandas-power',
    title: 'Pandas Power',
    subtitle: 'Analyse data like a data scientist',
    icon: '🐼',
    color: 'from-emerald-600 to-teal-700',
    difficulty: 'expert',
    xpReward: 400,
    estimatedMinutes: 40,
    prerequisites: ['numpy-adventure'],
    description: 'Pandas is the ultimate Python library for working with tables of data. Used by data scientists around the world, it makes loading, cleaning, filtering, and summarising data incredibly simple.',
    whatYoullLearn: [
      'Creating DataFrames from dictionaries and CSV files',
      'Selecting, filtering, and sorting data',
      'Handling missing values',
      'Grouping and summarising data with groupby',
    ],
    sections: [
      {
        title: 'DataFrames — Tables of Data',
        content: 'A DataFrame is like a spreadsheet in Python — it has rows and columns, each column has a name, and each row has an index. You can create a DataFrame from a dictionary where each key is a column name and each value is a list of column values. Pandas makes it easy to inspect your data with head(), info(), and describe().',
        code: `import pandas as pd

# Create a DataFrame from a dictionary
data = {
    "Name":    ["Alice", "Bob", "Carol", "Dave", "Eve"],
    "Age":     [11, 12, 11, 13, 12],
    "Score":   [92, 85, 78, 91, 88],
    "Subject": ["Maths", "Science", "Maths", "English", "Science"],
}
df = pd.DataFrame(data)

print(df)           # shows the whole table
print()
print(df.head(3))   # first 3 rows
print()
print(df.info())    # column types and non-null counts
print()
print(df.describe())  # statistics for numeric columns`,
      },
      {
        title: 'Selecting, Filtering, and Sorting',
        content: 'You can select one column using df["ColumnName"], which returns a Series (like a NumPy array with labels). To filter rows, use a condition inside square brackets — just like NumPy boolean indexing. The sort_values() method sorts the DataFrame by one or more columns, and you can chain operations together for powerful one-liners.',
        code: `import pandas as pd

df = pd.DataFrame({
    "Name":  ["Alice", "Bob", "Carol", "Dave", "Eve"],
    "Age":   [11, 12, 11, 13, 12],
    "Score": [92, 85, 78, 91, 88],
    "Grade": ["A", "B", "C", "A", "B"],
})

# Select a single column (returns a Series)
print(df["Score"])

# Select multiple columns
print(df[["Name", "Score"]])

# Filter rows where Score >= 88
high_scorers = df[df["Score"] >= 88]
print(high_scorers)

# Filter with multiple conditions
young_high = df[(df["Age"] <= 12) & (df["Score"] > 85)]
print(young_high)

# Sort by Score descending
ranked = df.sort_values("Score", ascending=False)
print(ranked)`,
      },
      {
        title: 'GroupBy and Summary Statistics',
        content: 'GroupBy is one of the most powerful features in Pandas. It splits data into groups, applies a function to each group, and combines the results. This is perfect for questions like "what is the average score per subject?" or "how many students are in each age group?" The agg() method lets you apply multiple functions at once.',
        code: `import pandas as pd

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Carol","Dave","Eve","Frank"],
    "Subject": ["Maths","Science","Maths","English","Science","English"],
    "Score":   [92, 85, 78, 91, 88, 74],
    "Grade":   ["A","B","C","A","B","C"],
})

# Group by Subject, calculate mean score
by_subject = df.groupby("Subject")["Score"].mean()
print("Average score by subject:")
print(by_subject)

# Multiple aggregations
summary = df.groupby("Subject")["Score"].agg(["mean","max","min","count"])
print("\\nFull summary by subject:")
print(summary)

# Count per grade
grade_counts = df["Grade"].value_counts()
print("\\nGrade distribution:")
print(grade_counts)

# Add a new computed column
df["Passed"] = df["Score"] >= 80
print("\\nWith Pass column:")
print(df[["Name", "Score", "Passed"]])`,
      },
    ],
    quiz: [
      {
        question: 'How do you create a DataFrame from a dictionary in pandas?',
        options: ['pd.Series(dict)', 'pd.DataFrame(dict)', 'pd.Table(dict)', 'pd.Data(dict)'],
        correctIndex: 1,
        explanation: 'pd.DataFrame(dictionary) creates a DataFrame where each key becomes a column name and each list becomes the column values.',
      },
      {
        question: 'How do you select the "Score" column from a DataFrame df?',
        options: ['df.Score()', 'df[Score]', 'df["Score"]', 'df.get("Score")'],
        correctIndex: 2,
        explanation: 'Columns are accessed using square bracket notation with the column name as a string: df["Score"].',
      },
      {
        question: 'What does df[df["Age"] > 11] do?',
        options: ['Selects the Age column', 'Filters rows where Age is greater than 11', 'Deletes rows where Age <= 11', 'Returns True or False'],
        correctIndex: 1,
        explanation: 'Boolean indexing: df["Age"] > 11 creates a boolean Series, which is used to select only rows where the condition is True.',
      },
      {
        question: 'What does df.groupby("Subject")["Score"].mean() calculate?',
        options: ['The mean of the Score column overall', 'The mean Score for each unique Subject value', 'The subject with the highest mean score', 'All scores grouped into one number'],
        correctIndex: 1,
        explanation: 'groupby splits the data into groups by Subject, then .mean() calculates the average Score within each group.',
      },
      {
        question: 'What does df.sort_values("Score", ascending=False) do?',
        options: ['Sorts alphabetically', 'Sorts by Score from lowest to highest', 'Sorts by Score from highest to lowest', 'Removes duplicate scores'],
        correctIndex: 2,
        explanation: 'sort_values sorts the DataFrame by the given column. ascending=False means largest values come first (descending order).',
      },
    ],
    codeChallenge: {
      prompt: 'Create a DataFrame of at least 6 students with columns: Name, Age, Maths, Science, English. Add a new column "Average" (mean of the three subjects). Then find: the top 3 students by average, average score per age group, and how many students scored above 80 in all three subjects.',
      starterCode: `import pandas as pd

# Create the student DataFrame
df = pd.DataFrame({
    "Name":    [],
    "Age":     [],
    "Maths":   [],
    "Science": [],
    "English": [],
})

# Step 1: Add an "Average" column (mean of Maths, Science, English)

# Step 2: Top 3 students by Average

# Step 3: Average score per age group (groupby Age, mean of Average)

# Step 4: Students who scored above 80 in ALL three subjects
`,
      hints: [
        'Average column: df["Average"] = df[["Maths","Science","English"]].mean(axis=1)',
        'Top 3: df.sort_values("Average", ascending=False).head(3)',
        'All subjects > 80: df[(df["Maths"]>80) & (df["Science"]>80) & (df["English"]>80)]',
      ],
      sampleSolution: `import pandas as pd

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Carol","Dave","Eve","Frank"],
    "Age":     [11, 12, 11, 12, 13, 11],
    "Maths":   [92, 75, 88, 65, 91, 78],
    "Science": [85, 80, 76, 72, 94, 83],
    "English": [90, 70, 82, 68, 87, 75],
})

# Step 1: Average column
df["Average"] = df[["Maths","Science","English"]].mean(axis=1).round(1)

# Step 2: Top 3 by average
top3 = df.sort_values("Average", ascending=False).head(3)
print("Top 3 students:")
print(top3[["Name","Average"]])

# Step 3: Average per age group
age_avg = df.groupby("Age")["Average"].mean().round(1)
print("\\nAverage by age:")
print(age_avg)

# Step 4: All subjects > 80
all_above_80 = df[(df["Maths"]>80) & (df["Science"]>80) & (df["English"]>80)]
print("\\nStudents above 80 in all subjects:")
print(all_above_80[["Name","Maths","Science","English"]])
`,
    },
  },
];

export function getModuleById(id: string): Module | undefined {
  return MODULES.find(m => m.id === id);
}

export function getNextModule(currentId: string): Module | undefined {
  const idx = MODULES.findIndex(m => m.id === currentId);
  return idx >= 0 && idx < MODULES.length - 1 ? MODULES[idx + 1] : undefined;
}

export function getPreviousModule(currentId: string): Module | undefined {
  const idx = MODULES.findIndex(m => m.id === currentId);
  return idx > 0 ? MODULES[idx - 1] : undefined;
}
