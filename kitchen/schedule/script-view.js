// URL на CSV из Google Sheets
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSpNWtZImdMKoOxbV6McfEXEB67ck7nzA1EcBXNOFdnDTK4o9gniAuz82paEdGAyRSlo6dFKO9zCyLP/pub?gid=0&single=true&output=csv";

async function loadSchedule() {
  try {
    const resp = await fetch(CSV_URL);
    const text = await resp.text();
    const rows = text.trim().split("\n").map(r => r.split(","));

    const table = document.getElementById("schedule");
    const theadDates = document.getElementById("header-dates");
    const theadDays = document.getElementById("header-days");
    const tbody = table.querySelector("tbody");

    theadDates.innerHTML = '<th class="sticky-col">Дата</th>';
    theadDays.innerHTML = '<th class="sticky-col">День</th>';
    tbody.innerHTML = "";

    // сегодня
    const today = new Date();
    today.setHours(0,0,0,0);

    // рендерим заголовки
    for (let c = 2; c < rows[0].length; c++) {
      const dateStr = rows[0][c].trim();
      const dayStr = rows[1][c].trim();

      const thDate = document.createElement("th");
      thDate.textContent = dateStr;
      if (isToday(dateStr, today)) thDate.classList.add("today");
      theadDates.appendChild(thDate);

      const thDay = document.createElement("th");
      thDay.textContent = dayStr;
      if (isToday(dateStr, today)) thDay.classList.add("today");
      theadDays.appendChild(thDay);
    }

    // рендерим тело
    for (let r = 2; r < rows.length; r++) {
      const tr = document.createElement("tr");

      if (rows[r][0].toLowerCase().includes("раздел")) {
        tr.classList.add("section-row");
      }

      // фиксированные первые 2 столбца
      for (let c = 0; c < 2; c++) {
        const td = document.createElement("td");
        td.textContent = rows[r][c] || "";
        td.classList.add("sticky-col");
        tr.appendChild(td);
      }

      // остальные
      for (let c = 2; c < rows[r].length; c++) {
        const td = document.createElement("td");
        const val = rows[r][c].trim();
        td.textContent = val;

        if (val === "1") td.classList.add("shift-1");
        if (val === "0") td.classList.add("shift-0");
        if (val === "О") td.classList.add("shift-O");
        if (val === "Б") td.classList.add("shift-Б");

        if (isToday(rows[0][c], today)) td.classList.add("today");

        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }

    // после рендера прокрутка к сегодняшнему дню (4-й день в центре 7-дневного окна)
    const todayIndex = rows[0].findIndex((v,i) => i >= 2 && isToday(v, today));
    if(todayIndex > -1){
      const scrollContainer = document.querySelector(".table-container");
      const thWidth = 60; // min-width
      const offset = (todayIndex - 3) * thWidth; 
      scrollContainer.scrollLeft = offset;
    }

  } catch (err) {
    console.error("Ошибка загрузки:", err);
  }
}

function isToday(dateStr, today) {
  const [d,m,y] = dateStr.split(".").map(Number);
  const dt = new Date(y,m-1,d);
  dt.setHours(0,0,0,0);
  return dt.getTime() === today.getTime();
}

loadSchedule();