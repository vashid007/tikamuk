document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".portfolio-card");

  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      filterButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      cards.forEach((card) => {
        const category = card.getAttribute("data-category");
        const shouldShow = filter === "all" || filter === category;
        card.style.display = shouldShow ? "block" : "none";
      });
    });
  });
});
