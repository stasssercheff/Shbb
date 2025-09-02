const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSpNWtZImdMKoOxbV6McfEXEB67ck7nzA1EcBXNOFdnDTK4o9gniAuz82paEdGAyRSlo6dFKO9zCyLP/pub?gid=0&single=true&output=csv";

async function loadSchedule() {
  try {
    const resp = await fetch(CSV_URL);
    const text = await resp.text();
    const rows = text.trim().split("\n").map(r => r.split(","));
    const table = document.getElementById("schedule");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    const today = new Date();
    today.setHours(0,0,0,0);

    // Создаём все строки в tbody
    for (let r = 0; r < rows.length; r++) {
      const tr = document.createElement("tr");

      if (r >= 2 && rows[r][0].toLowerCase().includes("раздел")) tr.classList.add("section-row");

      for (let c = 0; c < rows[r].length; c++) {
        const td = document.createElement("td");
        const val = rows[r][c].trim();
        td.textContent = val;

        // Стили смен
        if (val === "1") td.classList.add("shift-1");
        if (val === "0") td.classList.add("shift-0");
        if (val === "О") td.classList.add("shift-O");
        if (val === "Б") td.classList.add("shift-Б");

        // Подсветка сегодняшнего дня для первых 2 строк и тела
        if ((r===0 || r===1 || r>=2) && c>=2 && isToday(rows[0][c], today)) td.classList.add("today");

        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

    // Прокрутка к сегодняшнему дню
    const todayIndex = rows[0].findIndex((v,i)=>i>=2 && isToday(v,today));
    if(todayIndex>-1){
      const scrollContainer = document.querySelector(".table-container");
      const tdElements = table.querySelectorAll("tr:first-child td");
      let offset=0;
      for(let i=0;i<todayIndex;i++) offset += tdElements[i].offsetWidth;
      scrollContainer.scrollLeft = offset - scrollContainer.clientWidth/2 + tdElements[todayIndex].offsetWidth/2;
    }

  } catch(err){ console.error("Ошибка загрузки:",err); }
}

function isToday(dateStr,today){
  const [d,m,y] = dateStr.split(".").map(Number);
  const dt = new Date(y,m-1,d);
  dt.setHours(0,0,0,0);
  return dt.getTime()===today.getTime();
}

loadSchedule();