---
layout: post
title:  "Rewriting blocl-bnglatlon in C++"
date:   2023-10-15 12:00:00 +0000
categories: C++ python geospatial
published: true
---
High-performance applications are often written in a lower-level language, such as C++ of Rust, rather than Python. This is particularly common in the world of AI, where organisations including Tesla develop models in Python, and then rewrite them in C++ to improve performance.

Having little experience with C++ (I did some microcontroller work in C ~10 years ago), I thought rewriting a basic Python package in C++ might be a good place to start. As an Earth Science graduate, working in software engineering, it seemed fitting to work on something geospatial. In previous projects I've used [fmalina/blocl-bnglatlon](https://github.com/fmalina/blocl-bnglatlon), which converts British National Grid (OSBG 36) to lat-lon (WGS84).

Short of utilising constants, I've not changed much in the code - there's not much that can be changed. The code's available [on GitHub](https://github.com/JKFSOM/bnglatlon-cpp).

### Results

The following results were gathered over 100 runs.

| Item | CPU time (x 10^-4 seconds) | Memory (MiB) |
| ---- | ----- | --- | ------ |
| Python | 9.27458 | 20.828125 |
| C++ | 0.81958 | 20.812500 |
| ∆ | 8.455 | ~0 |

- **Duration:** The duration for processing in C++ is significantly lower, showcasing a reduction of −91.15%. This reduction in time is a massive gain in performance which is essential in high-performance applications.
- **Memory:** The memory consumption is nearly identical between Python and C++, with a slight reduction in memory usage in the C++ implementation.

### Conclusion

This exercise served as a valuable lesson in understanding the performance gains achievable when transitioning from a higher-level language like Python to a lower-level language such as C++. The drastic reduction in processing time reaffirms the importance of language choice in high-performance computing scenarios.

The code and the benchmarks clearly demonstrate the benefits of using a lower-level language for performance-critical tasks. For those looking to improve the performance of their applications, especially in the realm of AI or high-performance computing, transitioning to a lower-level language like C++ is definitely worth considering.

