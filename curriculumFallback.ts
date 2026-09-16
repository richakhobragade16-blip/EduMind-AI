export interface FallbackCard {
  id: string;
  front: string;
  back: string;
  hint: string;
}

export interface FallbackQuizItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Topic-specific knowledge bases curated for university & college engineering/CS/STEM
const CURRICULUM_FLASHCARDS: Record<string, Array<{ front: string; back: string; hint: string }>> = {
  dsa: [
    {
      front: "What is the time complexity of searching in a balanced Binary Search Tree (BST)?",
      back: "O(log n) on average and for balanced trees (e.g., AVL, Red-Black). If unbalanced (degenerate linked list), it degrades to O(n).",
      hint: "Halving the search space each step.",
    },
    {
      front: "What is the difference between Array and Linked List memory allocation?",
      back: "Arrays allocate contiguous memory blocks allowing O(1) random index access. Linked Lists allocate nodes dynamically across heap memory with pointer overhead and O(n) traversal.",
      hint: "Contiguous vs non-contiguous nodes.",
    },
    {
      front: "How does Hash Table collision resolution work with Chaining vs Open Addressing?",
      back: "Chaining stores colliding keys in a linked list or bucket at the same hash slot. Open Addressing finds the next empty slot using linear/quadratic probing or double hashing.",
      hint: "Separate buckets vs probing in the array.",
    },
    {
      front: "What is the primary condition for applying Dynamic Programming (DP)?",
      back: "A problem must exhibit Optimal Substructure (optimal solution contains optimal subproblems) and Overlapping Subproblems (subproblems are computed repeatedly).",
      hint: "Remember memoization and subproblem reuse.",
    },
    {
      front: "What is the worst-case and average-case time complexity of QuickSort?",
      back: "Average: O(n log n). Worst case: O(n^2) when the pivot chosen is always the smallest or largest element (e.g., sorted array with naive pivot selection).",
      hint: "Pivot quality dictates recursion depth.",
    },
    {
      front: "What is Breadth-First Search (BFS) vs Depth-First Search (DFS) in graph traversal?",
      back: "BFS traverses level-by-level using a Queue (FIFO) and finds shortest paths in unweighted graphs. DFS explores deeply down a branch using a Stack or recursion before backtracking.",
      hint: "Queue for levels, Stack/recursion for depth.",
    },
  ],
  bst: [
    {
      front: "What is the Binary Search Tree (BST) property?",
      back: "For every node N: every key in N's left subtree is strictly less than N.key, and every key in N's right subtree is strictly greater than N.key.",
      hint: "Left < Root < Right.",
    },
    {
      front: "Which tree traversal of a BST outputs elements in sorted ascending order?",
      back: "In-Order Traversal (Left subtree -> Current Node -> Right subtree).",
      hint: "Visiting left, self, then right.",
    },
    {
      front: "How do you delete a BST node with two children?",
      back: "Find either its In-Order Successor (smallest node in right subtree) or In-Order Predecessor (largest in left subtree), copy its value to the node, and recursively delete the successor/predecessor.",
      hint: "Replace with in-order successor or predecessor.",
    },
    {
      front: "Why are self-balancing trees like AVL or Red-Black trees necessary?",
      back: "They guarantee height remains O(log n), preventing degenerate worst-case O(n) operations when elements are inserted in already sorted order.",
      hint: "Guarantees logarithmic height bound.",
    },
    {
      front: "What is the space complexity of a BST with n nodes?",
      back: "O(n) total space to store the n nodes and their child pointers. Recursion call stack space is O(h) where h is tree height (O(log n) balanced, O(n) worst case).",
      hint: "Consider total storage plus recursion call stack.",
    },
  ],
  oop: [
    {
      front: "What are the Four Pillars of Object-Oriented Programming?",
      back: "1. Encapsulation (bundling data & methods, hiding internal state)\n2. Abstraction (hiding implementation details)\n3. Inheritance (reusing parent class behaviors)\n4. Polymorphism (treating child objects as parent instances).",
      hint: "E-A-I-P.",
    },
    {
      front: "What is the difference between Compile-time and Run-time Polymorphism?",
      back: "Compile-time (Static) Polymorphism is method overloading or operator overloading resolved at compilation. Run-time (Dynamic) Polymorphism is method overriding resolved dynamically via virtual method tables (vtable).",
      hint: "Overloading vs Overriding.",
    },
    {
      front: "What is the difference between an Abstract Class and an Interface?",
      back: "An abstract class can contain state (instance variables) and implemented concrete methods. An interface specifies a contract/behavior with method signatures (though modern languages allow default methods). A class can implement multiple interfaces.",
      hint: "Single inheritance vs multiple contracts.",
    },
    {
      front: "What is Encapsulation and why is it important in software design?",
      back: "Encapsulation restricts direct access to an object's internal fields using private/protected modifiers and provides controlled access via public getters/setters, preventing unintended mutations.",
      hint: "Information hiding and data protection.",
    },
    {
      front: "What is the Diamond Problem in multiple inheritance and how is it resolved?",
      back: "It occurs when a class inherits from two classes that both inherit from the same base class, causing ambiguity in method resolution. Resolved by virtual inheritance (C++) or single-class inheritance with interfaces (Java/C#).",
      hint: "Ambiguous superclass method resolution.",
    },
  ],
  os: [
    {
      front: "What is the difference between a Process and a Thread?",
      back: "A Process is an independent executing program with its own dedicated virtual memory space, file descriptors, and PCB. A Thread is a lightweight execution unit within a process that shares memory and resources with sibling threads.",
      hint: "Isolated memory vs shared process memory.",
    },
    {
      front: "What are the four necessary conditions for Deadlock to occur?",
      back: "1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait (Coffman conditions).",
      hint: "Coffman conditions.",
    },
    {
      front: "What is Virtual Memory and how does Paging work?",
      back: "Virtual memory gives processes an illusion of contiguous large address space. Paging divides virtual memory into fixed-size 'pages' and physical memory into 'frames'. The Page Table translates virtual addresses to physical frames using the MMU and TLB cache.",
      hint: "Pages mapped to physical frames via page table.",
    },
    {
      front: "What is a Context Switch and what causes its overhead?",
      back: "Switching the CPU from one process/thread to another. Overhead comes from saving/restoring CPU registers, updating PCB/TCB, flushing the TLB cache, and cache misses on the new task.",
      hint: "Saving registers and invalidating TLB cache.",
    },
    {
      front: "What is the difference between Mutex and Semaphore?",
      back: "A Mutex is a locking mechanism with ownership (only the thread that locked it can unlock it). A Semaphore is a signaling mechanism using an integer counter (any thread can signal/wait; Counting or Binary).",
      hint: "Ownership locking vs signaling counter.",
    },
  ],
  db: [
    {
      front: "What do the ACID properties stand for in Relational Databases?",
      back: "Atomicity (all or nothing), Consistency (preserves database constraints), Isolation (concurrent transactions do not interfere), Durability (committed changes persist across crashes).",
      hint: "A-C-I-D transactional guarantees.",
    },
    {
      front: "What is Database Normalization and what does 3NF require?",
      back: "Normalization organizes schemas to eliminate data redundancy and insertion/update/deletion anomalies. 3NF requires the table to be in 2NF and have no transitive dependencies (non-key columns depend ONLY on candidate keys).",
      hint: "The key, the whole key, and nothing but the key.",
    },
    {
      front: "What is the difference between Clustered and Non-Clustered Indexes?",
      back: "A Clustered Index physically re-orders table rows on disk based on the index key (only one per table, usually primary key). A Non-Clustered Index is a separate B-Tree structure pointing back to the physical row locations.",
      hint: "Physical row sorting vs separate pointer tree.",
    },
    {
      front: "What is the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN?",
      back: "INNER JOIN returns only matching rows from both tables. LEFT JOIN returns all rows from the left table and matched rows from the right (NULL if no match). FULL OUTER JOIN returns rows when there is a match in either table.",
      hint: "Intersection vs Left-inclusive vs Union.",
    },
    {
      front: "How do B-Trees and B+ Trees optimize disk-based database queries?",
      back: "They are balanced multi-way search trees with high branching factors (fanout), minimizing costly disk I/O reads. In B+ Trees, all actual data pointers reside in leaf nodes connected as a linked list for rapid range scans.",
      hint: "High fanout minimizes disk head seeks.",
    },
  ],
  networks: [
    {
      front: "What are the 7 Layers of the OSI Model from lowest to highest?",
      back: "1. Physical\n2. Data Link\n3. Network\n4. Transport\n5. Session\n6. Presentation\n7. Application\n(Mnemonic: Please Do Not Throw Sausage Pizza Away).",
      hint: "Physical up to Application.",
    },
    {
      front: "What is the fundamental difference between TCP and UDP?",
      back: "TCP is connection-oriented, reliable, guarantees ordered delivery, performs 3-way handshakes, error-checking, and flow control. UDP is connectionless, unreliable, low-overhead, without acknowledgments (ideal for streaming & gaming).",
      hint: "Reliable stream vs lightweight datagram.",
    },
    {
      front: "How does the TCP 3-Way Handshake establish a connection?",
      back: "1. Client sends SYN (synchronize sequence number)\n2. Server replies with SYN-ACK (acknowledgment and server sequence)\n3. Client sends ACK (acknowledgment). Connection established.",
      hint: "SYN -> SYN-ACK -> ACK.",
    },
    {
      front: "What is DNS and how does resolution work?",
      back: "Domain Name System translates human-readable domain names (e.g. google.com) into machine IP addresses (e.g. 142.250.190.46) using recursive resolvers, root servers, TLD servers, and authoritative nameservers.",
      hint: "The phonebook of the Internet.",
    },
    {
      front: "How does HTTPS encrypt web communications compared to HTTP?",
      back: "HTTPS wraps HTTP inside TLS (Transport Layer Security). It performs an asymmetric cryptographic handshake to authenticate the server's certificate and negotiate a shared symmetric key for rapid session data encryption.",
      hint: "TLS handshake with asymmetric and symmetric crypto.",
    },
  ],
  python: [
    {
      front: "What is the difference between Mutable and Immutable types in Python?",
      back: "Immutable objects (int, float, str, tuple, frozenset) cannot be modified after creation; any change creates a new object in memory. Mutable objects (list, dict, set) can have their contents altered in-place.",
      hint: "In-place modification vs new object creation.",
    },
    {
      front: "What is the Python Global Interpreter Lock (GIL)?",
      back: "A mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes simultaneously in CPython. This ensures thread safety for memory management at the expense of multi-core CPU parallelism for pure Python threads.",
      hint: "CPython thread safety mutex.",
    },
    {
      front: "What is the difference between a Generator and a standard function in Python?",
      back: "A generator yields values lazily one at a time using 'yield' instead of returning a full list at once, maintaining state between calls and saving significant memory (O(1) space).",
      hint: "yield keyword and lazy evaluation.",
    },
    {
      front: "What is a Python Decorator and how is it used?",
      back: "A decorator is a callable that takes another function as an argument, extends its behavior without modifying the original code, and returns a new function (uses @decorator syntax).",
      hint: "Higher-order wrapper functions.",
    },
    {
      front: "How does Python handle memory management and Garbage Collection?",
      back: "Primarily via Reference Counting (objects are deallocated immediately when reference count reaches 0). A cyclic garbage collector periodically detects and clears circular reference loops.",
      hint: "Reference counting plus cyclic generational detector.",
    },
  ],
};

const CURRICULUM_QUIZZES: Record<string, Array<{ question: string; options: string[]; correctIndex: number; explanation: string }>> = {
  dsa: [
    {
      question: "Which of the following data structures operates strictly on a First-In, First-Out (FIFO) principle?",
      options: ["Stack", "Queue", "Binary Search Tree", "Priority Queue"],
      correctIndex: 1,
      explanation: "A Queue processes elements in First-In, First-Out (FIFO) order, where enqueue occurs at the tail and dequeue at the head. Stacks use LIFO.",
    },
    {
      question: "What is the worst-case time complexity of standard Merge Sort on an array of size n?",
      options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
      correctIndex: 1,
      explanation: "Merge Sort consistently divides the array into halves (log n levels) and merges in O(n) per level, guaranteeing O(n log n) in all cases (worst, average, and best).",
    },
    {
      question: "Which hash table collision resolution technique places colliding keys in a linked list at the same index?",
      options: ["Linear Probing", "Quadratic Probing", "Separate Chaining", "Double Hashing"],
      correctIndex: 2,
      explanation: "Separate Chaining maintains an auxiliary data structure (like a linked list or small tree) at each slot to hold all keys that hash to that index.",
    },
    {
      question: "In a min-heap with n elements, what is the time complexity to extract the minimum element and restore the heap property?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctIndex: 1,
      explanation: "Accessing the min element is O(1), but replacing it with the last element and bubbling down (heapify-down) takes O(log n) time proportional to the height of the heap.",
    },
  ],
  bst: [
    {
      question: "Which traversal of a Binary Search Tree (BST) produces keys in ascending sorted order?",
      options: ["Pre-order traversal", "Post-order traversal", "In-order traversal", "Level-order traversal"],
      correctIndex: 2,
      explanation: "In-order traversal recursively visits the Left Subtree, then the Root Node, then the Right Subtree. Since Left < Root < Right in a BST, keys are printed in strictly ascending order.",
    },
    {
      question: "What is the worst-case time complexity of searching in an unbalanced Binary Search Tree of n nodes?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctIndex: 2,
      explanation: "If nodes are inserted in sorted or reverse-sorted order, the BST degenerates into a singly linked list with height n, causing search complexity to become O(n).",
    },
    {
      question: "When deleting a node with two children in a BST, which replacement node preserves BST validity?",
      options: [
        "Any leaf node in the tree",
        "The node's parent",
        "The in-order successor or in-order predecessor",
        "The root of the entire tree",
      ],
      correctIndex: 2,
      explanation: "The in-order successor (smallest element in right subtree) or in-order predecessor (largest in left subtree) is guaranteed to maintain the BST invariant when substituted.",
    },
  ],
  os: [
    {
      question: "Which of the following is shared among multiple threads belonging to the same process?",
      options: [
        "CPU Registers",
        "Stack Memory",
        "Virtual Address Space & Heap Memory",
        "Program Counter",
      ],
      correctIndex: 2,
      explanation: "Threads of the same process share code, data, open files, and heap memory. Each thread has its own private Stack, Program Counter, and CPU registers.",
    },
    {
      question: "Which of the following is NOT one of Coffman's four conditions for deadlock?",
      options: [
        "Mutual Exclusion",
        "Preemption of allocated resources",
        "Hold and Wait",
        "Circular Wait",
      ],
      correctIndex: 1,
      explanation: "The condition is NO Preemption (resources cannot be forcibly taken from a process). Allowing preemption actively prevents deadlocks.",
    },
    {
      question: "What is the main role of the Translation Lookaside Buffer (TLB) in virtual memory systems?",
      options: [
        "To allocate physical RAM frames to programs",
        "To cache recent virtual-to-physical address translations for rapid lookup",
        "To detect and resolve deadlocks in system calls",
        "To handle disk input/output buffering",
      ],
      correctIndex: 1,
      explanation: "The TLB is a high-speed associative hardware cache in the MMU that stores recent page-to-frame translations, bypassing slower page table lookups in main memory.",
    },
  ],
  db: [
    {
      question: "In relational database design, what does the 'I' in ACID stand for?",
      options: ["Indexing", "Integrity", "Isolation", "Immutability"],
      correctIndex: 2,
      explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability. Isolation ensures that concurrent execution of transactions leaves the database in the same state as if executed sequentially.",
    },
    {
      question: "Which normal form requires removing all transitive dependencies among non-key attributes?",
      options: ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"],
      correctIndex: 2,
      explanation: "3NF requires that the relation is in 2NF and no non-prime attribute is transitively dependent on the primary key (every non-key depends only on candidate keys).",
    },
    {
      question: "Which SQL JOIN returns all rows from the left table, and the matched rows from the right table (with NULLs for unmatched rows)?",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"],
      correctIndex: 1,
      explanation: "A LEFT OUTER JOIN preserves all records from the left table regardless of whether there is a matching row in the right table.",
    },
  ],
  networks: [
    {
      question: "At which layer of the OSI model does the Transmission Control Protocol (TCP) operate?",
      options: ["Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 4 (Transport)", "Layer 7 (Application)"],
      correctIndex: 2,
      explanation: "TCP and UDP are Transport Layer (Layer 4) protocols responsible for end-to-end communication, port addressing, and error detection.",
    },
    {
      question: "What packet flag sequence is sent during the classic TCP 3-way connection handshake?",
      options: ["ACK -> SYN -> SYN-ACK", "SYN -> SYN-ACK -> ACK", "FIN -> ACK -> FIN-ACK", "HELLO -> ACK -> CONFIRM"],
      correctIndex: 1,
      explanation: "The client sends a SYN packet, the server responds with a SYN-ACK, and the client confirms with an ACK to establish a full-duplex TCP stream.",
    },
    {
      question: "Which of the following application layer protocols is connectionless and runs primarily over UDP?",
      options: ["HTTP/1.1", "FTP", "DNS (Standard Queries)", "SSH"],
      correctIndex: 2,
      explanation: "Standard DNS queries use UDP port 53 because of low latency and minimal overhead, avoiding connection establishment costs for simple lookups.",
    },
  ],
  python: [
    {
      question: "Which of the following built-in data types in Python is immutable?",
      options: ["List", "Dictionary", "Set", "Tuple"],
      correctIndex: 3,
      explanation: "Tuples (along with integers, floats, strings, and frozensets) are immutable in Python; their elements cannot be changed or assigned after creation.",
    },
    {
      question: "What keyword is used in a Python function to turn it into a generator that yields values on demand?",
      options: ["return", "yield", "generate", "defer"],
      correctIndex: 1,
      explanation: "The 'yield' keyword pauses execution and produces a value to the caller, resuming from that exact state on the next iteration without holding the entire dataset in memory.",
    },
    {
      question: "What is the primary purpose of Python's Global Interpreter Lock (GIL) in CPython?",
      options: [
        "To speed up mathematical calculations on GPUs",
        "To prevent multiple threads from concurrently executing Python bytecode for thread-safe memory management",
        "To compile Python scripts into native machine binaries",
        "To encrypt Python source files during distribution",
      ],
      correctIndex: 1,
      explanation: "The GIL protects CPython's internal memory management (reference counts) from race conditions by ensuring only one thread executes Python bytecode at a time.",
    },
  ],
};

function detectCategory(topic: string, context?: string): string {
  const combined = `${topic} ${context || ""}`.toLowerCase();
  if (combined.includes("tree") || combined.includes("bst") || combined.includes("binary search tree")) return "bst";
  if (combined.includes("os") || combined.includes("operating system") || combined.includes("thread") || combined.includes("process") || combined.includes("deadlock") || combined.includes("paging")) return "os";
  if (combined.includes("sql") || combined.includes("database") || combined.includes("dbms") || combined.includes("acid") || combined.includes("relational")) return "db";
  if (combined.includes("network") || combined.includes("tcp") || combined.includes("udp") || combined.includes("osi") || combined.includes("ip ") || combined.includes("dns")) return "networks";
  if (combined.includes("oop") || combined.includes("object oriented") || combined.includes("class") || combined.includes("polymorphism") || combined.includes("inheritance")) return "oop";
  if (combined.includes("python") || combined.includes("list comprehension") || combined.includes("gil")) return "python";
  if (combined.includes("dsa") || combined.includes("data structure") || combined.includes("algorithm") || combined.includes("sort") || combined.includes("stack") || combined.includes("queue")) return "dsa";
  return "dsa"; // default to universal CS
}

export function getCurriculumFlashcards(topic: string, context?: string): FallbackCard[] {
  const cat = detectCategory(topic, context);
  const items = CURRICULUM_FLASHCARDS[cat] || CURRICULUM_FLASHCARDS.dsa;
  
  return items.map((item, idx) => ({
    id: `fc-curric-${cat}-${Date.now()}-${idx}`,
    front: item.front,
    back: item.back,
    hint: item.hint,
  }));
}

export function getCurriculumQuiz(topic: string, context?: string): FallbackQuizItem[] {
  const cat = detectCategory(topic, context);
  const items = CURRICULUM_QUIZZES[cat] || CURRICULUM_QUIZZES.dsa;

  return items.map((item, idx) => ({
    id: `qz-curric-${cat}-${Date.now()}-${idx}`,
    question: item.question,
    options: item.options,
    correctIndex: item.correctIndex,
    explanation: item.explanation,
  }));
}

/**
 * Intelligent Academic Response Generator for Offline or Quota-Exhausted State.
 * Ensures the student always gets a comprehensive, structured response without any system crashes.
 */
export function getCurriculumStudyAnswer(question: string, studyMode: string = "general"): string {
  const q = question.toLowerCase();
  const cat = detectCategory(question);

  // 1. Binary Search Trees & Trees
  if (q.includes("tree") || q.includes("bst") || cat === "bst") {
    return `### Comprehensive Breakdown: Binary Search Trees (BST)

A **Binary Search Tree** is a hierarchical, node-based data structure satisfying the following invariant for every node $N$:
* **Left Subtree:** All keys in the left child must be strictly *less* than $N$'s key.
* **Right Subtree:** All keys in the right child must be strictly *greater* than $N$'s key.

---

#### 1. Core Operations & Time Complexity
| Operation | Average Case | Worst Case (Degenerate) | Balanced (AVL / Red-Black) |
| :--- | :--- | :--- | :--- |
| **Search** | $O(\\log n)$ | $O(n)$ | $O(\\log n)$ |
| **Insert** | $O(\\log n)$ | $O(n)$ | $O(\\log n)$ |
| **Delete** | $O(\\log n)$ | $O(n)$ | $O(\\log n)$ |

*Note: In the worst-case scenario where sorted elements are inserted sequentially, an unbalanced BST degenerates into a single linked list of height $n$.*

---

#### 2. Key Tree Traversals
* **In-Order (Left $\\to$ Root $\\to$ Right):** Produces keys in strictly sorted ascending order.
* **Pre-Order (Root $\\to$ Left $\\to$ Right):** Useful for cloning or serializing the tree structure.
* **Post-Order (Left $\\to$ Right $\\to$ Root):** Ideal for deleting nodes and bottom-up metric calculations.

---

#### 3. Standard Implementation Example (TypeScript / JavaScript)
\`\`\`typescript
class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) {
    this.val = val;
  }
}

function searchBST(root: TreeNode | null, target: number): TreeNode | null {
  if (!root || root.val === target) return root;
  if (target < root.val) {
    return searchBST(root.left, target);
  }
  return searchBST(root.right, target);
}
\`\`\`

---

#### 💡 High-Yield Exam Takeaway
When asked about tree self-balancing in exams, highlight **AVL rotations** (Single LL/RR, Double LR/RL) and **Red-Black Tree properties** (black-height consistency, no two consecutive red nodes) as the mechanism guaranteeing $O(\\log n)$ bounds.`;
  }

  // 2. Data Structures & Algorithms (Sorting, Graph, DP, Arrays)
  if (q.includes("sort") || q.includes("dsa") || q.includes("algorithm") || q.includes("dynamic programming") || q.includes("graph") || cat === "dsa") {
    return `### Academic Study Note: Data Structures & Core Algorithms

#### 1. Foundational Algorithm Paradigms
1. **Divide & Conquer:** Recursively breaks a problem into smaller subproblems, solves them independently, and combines their solutions (e.g., MergeSort, QuickSort, Binary Search).
2. **Dynamic Programming:** Solves optimization problems exhibiting *Optimal Substructure* and *Overlapping Subproblems* through memoization (top-down) or tabulation (bottom-up).
3. **Greedy Approach:** Constructs a solution piece-by-piece, always choosing the immediate local optimum (e.g., Dijkstra's Algorithm, Kruskal's MST, Huffman Coding).

---

#### 2. Comparison of Sorting Algorithms
| Algorithm | Best Case | Average Case | Worst Case | Space Complexity | Stable? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Merge Sort** | $O(n \\log n)$ | $O(n \\log n)$ | $O(n \\log n)$ | $O(n)$ | Yes |
| **Quick Sort** | $O(n \\log n)$ | $O(n \\log n)$ | $O(n^2)$ | $O(\\log n)$ | No |
| **Heap Sort** | $O(n \\log n)$ | $O(n \\log n)$ | $O(n \\log n)$ | $O(1)$ | No |

---

#### 3. Algorithmic Implementation: Binary Search
\`\`\`typescript
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    // Avoid potential integer overflow with (left + (right - left) / 2)
    const mid = Math.floor(left + (right - left) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1; // Not found
}
\`\`\`

---

#### 📌 Exam & Interview Checkpoint
* **Time Complexity:** $O(\\log n)$ - halving the problem space at each step.
* **Space Complexity:** $O(1)$ auxiliary space for iterative implementation.`;
  }

  // 3. Operating Systems & Concurrency
  if (q.includes("os") || q.includes("thread") || q.includes("deadlock") || q.includes("process") || cat === "os") {
    return `### Core Engineering Notes: Operating Systems Architecture

#### 1. Process vs. Thread
* **Process:** An executing instance of a program with its own dedicated virtual address space (Text, Data, Heap, Stack), file descriptors, and OS security credentials. Processes are isolated from each other.
* **Thread:** A lightweight unit of execution within a process. Multiple threads share the process's address space, heap memory, and open resources, but each maintains its own private Program Counter (PC), CPU registers, and Call Stack.

---

#### 2. The 4 Necessary Coffman Conditions for Deadlock
A deadlock can occur if and only if all four of the following conditions hold simultaneously:
1. **Mutual Exclusion:** At least one resource must be held in a non-shareable mode.
2. **Hold and Wait:** A process is holding at least one resource and waiting to acquire additional resources.
3. **No Preemption:** Resources cannot be forcibly seized; they can only be released voluntarily by the holding process.
4. **Circular Wait:** A closed chain of processes exists such that each process holds a resource needed by the next.

---

#### 3. Memory Management & Paging
* **Virtual Memory:** Decouples physical RAM from logical process address spaces using the Memory Management Unit (MMU) and Page Tables.
* **Page Fault:** An interrupt raised by hardware when a thread accesses a virtual page not currently resident in physical RAM, causing the OS to fetch the frame from swap storage.`;
  }

  // 4. Databases & SQL
  if (q.includes("sql") || q.includes("database") || q.includes("acid") || cat === "db") {
    return `### Database Systems: Relational Models & ACID Guarantees

#### 1. The ACID Transaction Properties
* **Atomicity:** "All or nothing" execution. If any single statement in a transaction fails, the entire transaction rolls back cleanly.
* **Consistency:** A transaction transitions the database only from one valid schema state to another, strictly obeying all constraints and foreign keys.
* **Isolation:** Intermediate results of concurrently executing transactions are invisible to one another until committed (Read Committed, Repeatable Read, Serializable).
* **Durability:** Once committed, the changes are permanent and survive any power failure or system restart (via Write-Ahead Logging / WAL).

---

#### 2. SQL Querying & Indexing
\`\`\`sql
-- Efficient Indexed Group Query
SELECT 
    department_id, 
    COUNT(*) AS student_count,
    AVG(gpa) AS average_gpa
FROM students
WHERE enrollment_status = 'Active'
GROUP BY department_id
HAVING AVG(gpa) >= 3.5
ORDER BY student_count DESC;
\`\`\`

* **B-Tree Indexes:** Balanced $M$-way trees optimized for disk storage, offering $O(\\log n)$ lookup, range scans, and sorting acceleration.`;
  }

  // 5. Default Universal Academic Study Assistant Response
  return `### EduMind Academic Analysis: ${question}

#### 1. Core Concept Overview
Understanding **${question}** requires breaking down its fundamental principles:
* **Definition:** A structured foundational concept in university curriculum, connecting foundational theory to real-world applications.
* **Purpose:** Provides a systematic framework for problem-solving, analytical deduction, and scalable architecture.

---

#### 2. Key Step-by-Step Breakdown
1. **First Principles:** Identify the given parameters, inputs, and boundary constraints.
2. **Logical Formulation:** Apply the verified theorems or algorithmic paradigms suited for this problem type.
3. **Validation:** Check boundary limits, edge cases (zero, null, maximum capacity), and verify time/space costs.

---

#### 3. Structured Study Takeaways
* **Clarity First:** Always articulate your mental model before diving into low-level execution.
* **Active Recall Checkpoint:** Test your understanding by asking: *"Can I explain this concept in simple terms to a fellow student without looking at notes?"*
* **Follow-up Tip:** You can also turn this topic into interactive flashcards or a practice quiz using the **Study Tools** menu in the top bar!`;
}

