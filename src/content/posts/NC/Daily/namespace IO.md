---
title: namespace IO 摸索
date: 2026-10-03
updated: "2026-10-03T22:04:28+08:00"
published: true
tags:
  - NC
  - Tracker
---
```cpp
namespace IO {
    const int B = 1 << 22;
    
    char in[B];
    char* l=in, *r=in;

    inline char gc() {
        if (l == r) {
            l = in;
            // 程序内的数组, size, n, FILE* 返回值是 真实 n
            r = in + fread(in,1,N,stdin);
        } 
        return l == r ? EOF : *l++;
    }

    inline int read() {
        int f = 0;
        int x = 0;
        char c = gc();
        while(c < '0' || c > '9') {
            f |= c == '-';
            c = gc();
        }
        while(c >= '0' && c <= '9') {
            x = x * 10 + c-'0';
            c = gc();
        }
        return f ? -x : x;
    }

    char out[B];
    char* sz = out;

    inline void write(int x) {
        static char S[1<<8];
        static char* tp = S;
        do {
            *tp++ = '0' + x % 10;
            x/=10;
        } while(x);
        while(tp!=S) {
            *sz++=*--tp;
        }
        *sz++=' ';
    }

    inline void flush() {
	    // 程序内的数组, size, n, FILE*
        fwrite(out,1,sz-out,stdout);
    }
}
```

