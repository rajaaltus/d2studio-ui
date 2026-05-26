(function () {
  try {
    var d = document.documentElement;
    var s = localStorage.getItem("theme") || "dark";
    var r =
      s === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : s;
    if (r === "dark") d.classList.add("dark");
    else d.classList.remove("dark");
    d.style.colorScheme = r;
  } catch (e) {}
})();
