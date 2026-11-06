// Seed data: default users, quizzes, and questions.
// Loaded into localStorage on first run so the app works immediately.
import { uid } from "../utils/storage";

export function buildDefaultData() {
  const now = new Date().toISOString();

  const users = [
    {
      id: "user_admin",
      name: "Admin User",
      email: "admin@quiz.com",
      password: "admin123",
      role: "admin",
      createdAt: now,
    },
    {
      id: "user_student",
      name: "Student User",
      email: "student@quiz.com",
      password: "student123",
      role: "student",
      createdAt: now,
    },
  ];

  const q = (text, options, correctAnswer, marks, explanation) => ({
    id: uid("q"),
    text,
    options,
    correctAnswer,
    marks,
    explanation,
  });

  const quizzes = [
    {
      id: "quiz_java",
      title: "Java Programming",
      description: "Test your knowledge of core Java concepts.",
      subject: "Programming",
      difficulty: "Medium",
      durationMinutes: 30,
      passingPercentage: 40,
      published: true,
      createdAt: now,
      questions: [
        q(
          "Which keyword is used to inherit a class in Java?",
          ["implements", "extends", "inherits", "super"],
          1,
          2,
          "The 'extends' keyword is used for class inheritance in Java."
        ),
        q(
          "What does JVM stand for?",
          [
            "Java Variable Machine",
            "Java Virtual Machine",
            "Java Verified Machine",
            "Java Visual Machine",
          ],
          1,
          2,
          "JVM stands for Java Virtual Machine."
        ),
        q(
          "Which of these is not a primitive type in Java?",
          ["int", "String", "boolean", "double"],
          1,
          2,
          "String is a class, not a primitive type."
        ),
        q(
          "What is the entry point of a Java application?",
          ["start()", "init()", "main()", "run()"],
          2,
          2,
          "The main() method is the entry point."
        ),
        q(
          "Which keyword prevents method overriding?",
          ["static", "final", "private", "abstract"],
          1,
          2,
          "The 'final' keyword prevents overriding."
        ),
        q(
          "What is encapsulation?",
          [
            "Hiding data inside classes",
            "Inheriting from a parent",
            "Overloading methods",
            "Throwing exceptions",
          ],
          0,
          2,
          "Encapsulation is the bundling of data with methods."
        ),
        q(
          "Which collection allows duplicate elements?",
          ["Set", "HashSet", "List", "TreeSet"],
          2,
          2,
          "List allows duplicate elements."
        ),
        q(
          "What is the default value of a boolean in Java?",
          ["true", "false", "null", "0"],
          1,
          2,
          "The default value of boolean is false."
        ),
        q(
          "Which operator is used for object comparison by reference?",
          ["==", ".equals()", "compare()", "==="],
          0,
          2,
          "The == operator compares references."
        ),
        q(
          "What is an interface in Java?",
          [
            "A class with implementations",
            "A contract of methods",
            "A data type",
            "A loop construct",
          ],
          1,
          2,
          "An interface defines a contract of methods."
        ),
      ],
    },
    {
      id: "quiz_python",
      title: "Python Basics",
      description: "Fundamentals of Python programming.",
      subject: "Programming",
      difficulty: "Easy",
      durationMinutes: 20,
      passingPercentage: 40,
      published: true,
      createdAt: now,
      questions: [
        q(
          "How do you create a variable in Python?",
          ["let x = 5", "x = 5", "var x = 5", "int x = 5"],
          1,
          2,
          "Python uses simple assignment: x = 5"
        ),
        q(
          "What is the output of print(type([]))?",
          ["<class 'tuple'>", "<class 'list'>", "<class 'dict'>", "<class 'set'>"],
          1,
          2,
          "[] creates a list."
        ),
        q(
          "Which keyword defines a function in Python?",
          ["function", "def", "func", "define"],
          1,
          2,
          "The 'def' keyword defines functions."
        ),
        q(
          "What does len('hello') return?",
          ["4", "5", "6", "Error"],
          1,
          2,
          "'hello' has 5 characters."
        ),
        q(
          "Which of these is a Python loop?",
          ["for", "foreach", "each", "loop"],
          0,
          2,
          "Python uses 'for' and 'while' loops."
        ),
        q(
          "What is a dictionary in Python?",
          [
            "An ordered list",
            "A key-value mapping",
            "A set of items",
            "A tuple type",
          ],
          1,
          2,
          "Dictionaries store key-value pairs."
        ),
        q(
          "How do you start a comment in Python?",
          ["//", "/*", "#", "--"],
          2,
          2,
          "Python uses # for comments."
        ),
        q(
          "What does the range(3) produce?",
          ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "1, 2"],
          1,
          2,
          "range(3) yields 0, 1, 2."
        ),
      ],
    },
    {
      id: "quiz_dsa",
      title: "Data Structures & Algorithms",
      description: "Core DSA concepts and complexity analysis.",
      subject: "Computer Science",
      difficulty: "Hard",
      durationMinutes: 40,
      passingPercentage: 40,
      published: true,
      createdAt: now,
      questions: [
        q(
          "What is the time complexity of binary search?",
          ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
          1,
          2,
          "Binary search runs in O(log n)."
        ),
        q(
          "Which data structure uses FIFO order?",
          ["Stack", "Queue", "Tree", "Graph"],
          1,
          2,
          "Queues are First-In-First-Out."
        ),
        q(
          "What is the worst case of quicksort?",
          ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"],
          2,
          2,
          "Quicksort worst case is O(n^2)."
        ),
        q(
          "Which is NOT a linear data structure?",
          ["Array", "Linked List", "Tree", "Queue"],
          2,
          2,
          "Trees are hierarchical, not linear."
        ),
        q(
          "What does a hash table provide on average?",
          ["O(n) lookup", "O(log n) lookup", "O(1) lookup", "O(n^2) lookup"],
          2,
          2,
          "Hash tables give O(1) average lookup."
        ),
        q(
          "Which traversal visits root before children?",
          ["Inorder", "Postorder", "Preorder", "Level order"],
          2,
          2,
          "Preorder visits root first."
        ),
      ],
    },
    {
      id: "quiz_web",
      title: "Web Development Basics",
      description: "HTML, CSS, and JavaScript fundamentals.",
      subject: "Web",
      difficulty: "Easy",
      durationMinutes: 20,
      passingPercentage: 40,
      published: true,
      createdAt: now,
      questions: [
        q(
          "What does HTML stand for?",
          [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyper Tabular Markup Language",
            "None of these",
          ],
          0,
          2,
          "HTML = Hyper Text Markup Language."
        ),
        q(
          "Which tag is used for the largest heading?",
          ["<h6>", "<head>", "<h1>", "<heading>"],
          2,
          2,
          "<h1> is the largest heading."
        ),
        q(
          "What does CSS stand for?",
          [
            "Computer Style Sheets",
            "Cascading Style Sheets",
            "Creative Style Sheets",
            "Colorful Style Sheets",
          ],
          1,
          2,
          "CSS = Cascading Style Sheets."
        ),
        q(
          "Which is a JavaScript framework?",
          ["Laravel", "Django", "React", "Flask"],
          2,
          2,
          "React is a JavaScript library/framework."
        ),
        q(
          "How do you declare a constant in JS?",
          ["let x", "var x", "const x", "static x"],
          2,
          2,
          "const declares a constant."
        ),
      ],
    },
  ];

  return { users, quizzes };
}

export function seedIfEmpty() {
  const existing = localStorage.getItem("quizzes");
  if (!existing) {
    const { users, quizzes } = buildDefaultData();
    localStorage.setItem("quiz_users", JSON.stringify(users));
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
    localStorage.setItem("results", JSON.stringify([]));
  }
}
