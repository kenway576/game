# -*- coding: utf-8 -*-
import io
def swap(path, zh_old, zh_new, en_new):
    s = io.open(path, encoding='utf-8').read()
    key = "zh: '" + zh_old + "'"
    assert s.count(key) == 1, (zh_old[:26], s.count(key))
    assert "'" not in en_new, en_new[:40]
    i = s.index(key)
    s = s[:i] + "zh: '" + zh_new + "'" + s[i+len(key):]
    i2 = s.index("zh: '" + zh_new + "'")
    j = s.index("en: '", i2); assert j - i2 < 600, zh_old[:26]
    k = s.index("'", j + 5)
    while s[k-1] == chr(92): k = s.index("'", k + 1)
    s = s[:j] + "en: '" + en_new + "'" + s[k+1:]
    io.open(path, 'w', encoding='utf-8').write(s)
