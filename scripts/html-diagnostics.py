#!/usr/bin/env python3
"""Static diagnostics for the static site: tag nesting, duplicate attributes,
void elements, anchor nesting and empty hrefs (mirrors IDE HTML diagnostics)."""
import io
import os
import re
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr"}
SKIP = {"node_modules", ".git", ".vercel", "scripts"}


class Checker(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.problems = []

    def handle_starttag(self, tag, attrs):
        names = [name for name, _ in attrs]
        for name in set(names):
            if names.count(name) > 1:
                self.problems.append("duplicate attribute %s on <%s> (line %d)" % (name, tag, self.getpos()[0]))
        href = dict(attrs).get("href")
        if href is not None and href.strip() in ("", "#"):
            self.problems.append("empty href on <a> (line %d)" % self.getpos()[0])
        if tag == "img" and not dict(attrs).get("src"):
            self.problems.append("<img> without src (line %d)" % self.getpos()[0])
        if tag in VOID:
            return
        self.stack.append((tag, self.getpos()[0]))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack:
            self.problems.append("stray </%s> (line %d)" % (tag, self.getpos()[0]))
            return
        if self.stack[-1][0] == tag:
            self.stack.pop()
            return
        # find nearest matching open tag
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                unclosed = [t for t, _ in self.stack[index + 1:]]
                self.problems.append(
                    "</%s> at line %d closes past unclosed %s (opened line %d)"
                    % (tag, self.getpos()[0], ", ".join("<%s>" % t for t in unclosed), self.stack[index][1])
                )
                del self.stack[index:]
                return
        self.problems.append("unexpected </%s> (line %d)" % (tag, self.getpos()[0]))

    def close(self):
        super().close()
        for tag, line in self.stack:
            self.problems.append("unclosed <%s> opened at line %d" % (tag, line))


def main():
    total = 0
    for base, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP]
        for name in sorted(files):
            if not name.endswith(".html"):
                continue
            path = os.path.join(base, name)
            rel = os.path.relpath(path, ROOT)
            with io.open(path, encoding="utf-8") as handle:
                text = handle.read()
            checker = Checker()
            try:
                checker.feed(text)
                checker.close()
            except Exception as exc:  # malformed markup
                checker.problems.append("parser error: %s" % exc)

            # nested anchors are illegal and break nav taps
            if re.search(r"<a\b[^>]*>[\s\S]{0,400}?<a\b", text):
                if re.search(r"<a\b(?:(?!</a>)[\s\S])*?<a\b", text):
                    checker.problems.append("nested <a> elements detected")

            if checker.problems:
                print("\n%s" % rel)
                for problem in checker.problems[:8]:
                    print("   - %s" % problem)
                total += len(checker.problems)
    print("\nTOTAL PROBLEMS: %d" % total)


if __name__ == "__main__":
    main()
