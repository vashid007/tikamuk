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

//modal
// document.addEventListener("DOMContentLoaded", function () {

//   const wrappers = document.querySelectorAll(".img-wrapper");
//   const modal = document.getElementById("portfolioModal");
//   const slider = document.querySelector(".modal-slider");
//   const modalTitle = document.querySelector(".modal-title");
//   const modalDesc = document.querySelector(".modal-desc");
//   const closeBtn = document.querySelector(".close-modal");

//   if (!modal || !closeBtn) return; // safety check

//   let interval;

//   wrappers.forEach(wrapper => {
//     wrapper.addEventListener("mouseenter", function () {

//       const hidden = wrapper.querySelector(".hide-section");
//       if (!hidden) return;

//       slider.innerHTML = "";
//       modal.classList.add("active");

//       const hiddenImages = hidden.querySelectorAll("img");

//       if (hiddenImages.length > 0) {
//         hiddenImages.forEach(img => {
//           const newImg = document.createElement("img");
//           newImg.src = img.src;
//           slider.appendChild(newImg);
//         });

//         startSlider();
//       }

//       modalTitle.textContent =
//         hidden.querySelector("h3")?.textContent || "";

//       modalDesc.textContent =
//         hidden.querySelector("p")?.textContent || "";
//     });
//   });

//   function startSlider() {
//     const slides = slider.querySelectorAll("img");
//     let index = 0;

//     slides.forEach((img, i) => {
//       img.style.display = i === 0 ? "block" : "none";
//     });

//     interval = setInterval(() => {
//       slides[index].style.display = "none";
//       index = (index + 1) % slides.length;
//       slides[index].style.display = "block";
//     }, 2500);
//   }

//   closeBtn.addEventListener("click", () => {
//     modal.classList.remove("active");
//     clearInterval(interval);
//   });

// });
document.addEventListener("DOMContentLoaded", function () {

  const wrappers = document.querySelectorAll(".img-wrapper");
  const modal = document.getElementById("portfolioModal");
  const slider = document.querySelector(".modal-slider");
  const modalTitle = document.querySelector(".modal-title");
  const modalDesc = document.querySelector(".modal-desc");
  const closeBtn = document.querySelector(".close-modal");

  if (!modal || !closeBtn) return;

  let interval;
  let index = 0;

  // Create arrow buttons once
  const prevBtn = document.createElement("button");
  prevBtn.classList.add("prev");
  prevBtn.innerHTML = "&#10094;";

  const nextBtn = document.createElement("button");
  nextBtn.classList.add("next");
  nextBtn.innerHTML = "&#10095;";

  wrappers.forEach(wrapper => {
    wrapper.addEventListener("click", function () {

      const hidden = wrapper.querySelector(".hide-section");
      if (!hidden) return;

      clearInterval(interval);
      slider.innerHTML = "";
      index = 0;

      modal.classList.add("active");

      const hiddenImages = hidden.querySelectorAll("img");
console.log(hiddenImages);

      if (hiddenImages.length > 1) {
        hiddenImages.forEach(img => {
          const newImg = document.createElement("img");
          newImg.src = img.src;
          slider.appendChild(newImg);
        });

        // Add arrows after images
        slider.appendChild(prevBtn);
        slider.appendChild(nextBtn);

        startSlider();
      }

      modalTitle.textContent =
        hidden.querySelector("h3")?.textContent || "";

      modalDesc.textContent =
        hidden.querySelector("p")?.textContent || "";
    });
  });

  function startSlider() {
    const slides = slider.querySelectorAll("img");
    if (slides.length === 0) return;

    slides.forEach((img, i) => {
      img.style.display = i === 0 ? "block" : "none";
    });

    interval = setInterval(nextSlide, 2500);
  }

  function showSlide(i) {
    const slides = slider.querySelectorAll("img");
    slides[index].style.display = "none";
    index = (i + slides.length) % slides.length;
    slides[index].style.display = "block";
  }

  function nextSlide() {
    showSlide(index + 1);
  }

  function prevSlide() {
    showSlide(index - 1);
  }

  // Arrow Events
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // Pause on hover
  slider.addEventListener("mouseenter", () => {
    clearInterval(interval);
  });

  slider.addEventListener("mouseleave", () => {
    interval = setInterval(nextSlide, 2500);
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    clearInterval(interval);
  });

});
modal.addEventListener("click", function (e) {
  const modalBox = document.querySelector(".modal-box");

  if (!modalBox.contains(e.target)) {
    modal.classList.remove("active");
    clearInterval(interval);
  }
});