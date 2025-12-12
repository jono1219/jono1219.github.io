(async function () {
  const jobsEl = document.getElementById("jobs");
  const tpl = document.getElementById("job-template");
  const searchInput = document.getElementById("search");
  const filterLocation = document.getElementById("filter-location");
  const filterType = document.getElementById("filter-type");
  const refreshBtn = document.getElementById("refresh");

  document.getElementById("year").textContent = new Date().getFullYear();

  let jobs = [];

  async function loadJobs() {
    try {
      const res = await fetch("data/jobs.json");
      jobs = await res.json();
      renderFilters();
      render();
    } catch (e) {
      jobsEl.innerHTML = "<p>Kunde inte ladda jobb. Kontrollera data/jobs.json.</p>";
      console.error(e);
    }
  }

  function renderFilters() {
    const locations = [...new Set(jobs.map(j => j.location))].sort();
    filterLocation.innerHTML =
      `<option value=\"\">Alla platser</option>` +
      locations.map(l => `<option value=\"${l}\">${l}</option>`).join("");
  }

  function applyFilters() {
    const q = searchInput.value.toLowerCase().trim();
    const loc = filterLocation.value;
    const type = filterType.value;

    return jobs.filter(j => {
      if (loc && j.location !== loc) return false;
      if (type && j.employmentType !== type) return false;
      if (!q) return true;

      return (
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q)
      );
    });
  }

  function render() {
    const list = applyFilters();
    jobsEl.innerHTML = "";

    if (list.length === 0) {
      jobsEl.innerHTML = "<p>Inga jobb matchar din sökning.</p>";
      return;
    }

    for (const job of list) {
      const node = tpl.content.cloneNode(true);
      node.querySelector(".job-title").textContent = job.title;
      node.querySelector(".company").textContent = job.company;
      node.querySelector(".location").textContent = job.location;
      node.querySelector(".type").textContent = job.employmentType || "";
      node.querySelector(".description").textContent = job.description;

      const apply = node.querySelector(".apply");
      apply.href = job.applyURL || "#";

      jobsEl.appendChild(node);
    }
  }

  searchInput.addEventListener("input", render);
  filterLocation.addEventListener("change", render);
  filterType.addEventListener("change", render);
  refreshBtn.addEventListener("click", loadJobs);

  loadJobs();
})();
