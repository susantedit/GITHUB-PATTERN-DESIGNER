const ROWS = 7;
const COLS = 53;
const grid = document.getElementById("grid");

let data = Array.from({ length: ROWS }, () =>
  Array(COLS).fill(" ")
);

let cells = [];

// Build grid
for (let r = 0; r < ROWS; r++) {
  cells[r] = [];
  for (let c = 0; c < COLS; c++) {
    const cell = document.createElement("div");
    cell.className = "cell";

    // Prevent dragging from selecting text
    cell.ondragstart = () => false;

    cell.onmousedown = (e) => {
      if (e.button === 0) toggleCell(r, c); // Left click
      if (e.button === 2) setCell(r, c, false); // Right click
    };

    // Add continuous drawing support on mouseover if buttons are held down
    cell.onmouseover = (e) => {
      if (e.buttons === 1) setCell(r, c, true); // Left click held
      if (e.buttons === 2) setCell(r, c, false); // Right click held
    };

    cell.oncontextmenu = e => {
      e.preventDefault();
      setCell(r, c, false);
    };

    grid.appendChild(cell);
    cells[r][c] = cell;
  }
}

function setCell(r, c, active) {
  cells[r][c].classList.toggle("active", active);
  data[r][c] = active ? "3" : " ";
}

function toggleCell(r, c) {
  setCell(r, c, data[r][c] === " ");
}

/* RESET */
document.getElementById("reset").onclick = () => {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      setCell(r, c, false);
};

/* DOWNLOAD */
document.getElementById("download").onclick = () => {
  const rows = data.map(row => row.join(""));
  const blob = new Blob(
    [JSON.stringify(rows, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "pattern.json";
  a.click();
};

/* ================= THEME TOGGLE ================= */
const toggleBtn = document.getElementById("theme-toggle");
const toggleIcon = toggleBtn.querySelector("i");
const rootElement = document.documentElement;

// Function to set theme
function setTheme(theme) {
  if (theme === "light") {
    rootElement.setAttribute("data-theme", "light");
    toggleIcon.classList.remove("fa-sun");
    toggleIcon.classList.add("fa-moon");
    localStorage.setItem("theme", "light");
  } else {
    // Default to Dark Mode to match Logo Theme
    rootElement.removeAttribute("data-theme");
    toggleIcon.classList.remove("fa-moon");
    toggleIcon.classList.add("fa-sun");
    localStorage.setItem("theme", "dark");
  }
}

// Initialize Theme - Defaulting to dark (logo aesthetic)
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
} else {
  // Force dark mode out of the box for the premium feel
  setTheme("dark");
}

// Toggle event
toggleBtn.onclick = () => {
  const currentTheme = rootElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
};