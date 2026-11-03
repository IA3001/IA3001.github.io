---
title: iomanip新输出方式？
date: 2026-11-03
published: true
updated: "2026-11-03T08:37:19+08:00"
---

### Code

```cpp
// BLOG2
// cout << setfill('c');
// cout << setw(width); 果然是 "下一次" 
// 注意是 1 次性 的输出 setw

#include <bits/stdc++.h>
using namespace std;
using ll = long long;

ll n;

int main() {
    cin >> n;
    n %= 495;
    cout << setfill('0');
    if (n == 0) {
        cout << -1 << "\n";
    } else {
        ll n1 = n * 10 % 495;
        ll need1 = (495 - n1) % 495;
        if (need1 <= 9) {
            cout << need1 << "\n";
        } else {
            ll n2 = n1 * 10  % 495;
            ll need2 = (495 - n2) % 495;
            if (need2 <= 99) {
                cout << setw(2) << need2 << "\n";
            } else {
                ll n3 = n2 * 10 % 495;
                ll need3 = (495 - n3) % 495;
                cout << setw(3) << need3 << "\n";
            }
        }
    }
}
// 64 位输出请用 printf("%lld")
```