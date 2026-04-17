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

      slider.innerHTML = "";
      index = 0;

      modal.classList.add("active");

      // Grab all images inside the wrapper (main + hidden)
      const allImages = wrapper.querySelectorAll("img");

      allImages.forEach(img => {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        slider.appendChild(newImg);
      });

      // Add arrows after images if more than 1
      if (allImages.length > 1) {
        slider.appendChild(prevBtn);
        slider.appendChild(nextBtn);
      }

      // Stop any previous interval
      clearInterval(interval);
      startSlider();

      // Update modal text from hidden section if exists
      const hidden = wrapper.querySelector(".hide-section");
      modalTitle.textContent = hidden?.querySelector("h3")?.textContent || "";
      modalDesc.textContent = hidden?.querySelector("p")?.textContent || "";
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
  slider.addEventListener("mouseenter", () => clearInterval(interval));
  slider.addEventListener("mouseleave", () => interval = setInterval(nextSlide, 2500));

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    clearInterval(interval);
  });

  // Close modal on outside click
  modal.addEventListener("click", function (e) {
    const modalBox = document.querySelector(".modal-box");
    if (!modalBox.contains(e.target)) {
      modal.classList.remove("active");
      clearInterval(interval);
    }
  });

});





//Previos home.js
// document.addEventListener("DOMContentLoaded", function () {

//   const wrappers = document.querySelectorAll(".homegallery .img-wrapper");
//   const showwrappers = document.querySelectorAll(".homegallery .img-wrapper .showimg");

//   const popup = document.querySelector(".popup");
//   const popupImg = document.querySelector(".popup-img");
//   const popupTitle = document.querySelector(".popup-title");
//   const popupDesc = document.querySelector(".popup-desc");

// let current = 0;
// let previous = null;   
// let zoomInterval;
// let slideInterval;

//   // ---------------- SLIDER ----------------

//   function startSlider(wrapper) {
//     const hiddenImages = wrapper.querySelectorAll(".hide-section img");
//     const mainImg = wrapper.querySelector(":scope > img");

//     if (!hiddenImages.length || !mainImg) return;

//     let index = 0;

//     slideInterval = setInterval(() => {
//       mainImg.src = hiddenImages[index].src;
//       index = (index + 1) % hiddenImages.length;
//     }, 2000);
//   }

//   // ---------------- AUTO ZOOM ----------------

//   function zoomNextImage() {

//   clearInterval(slideInterval);

//   // Reset only previous wrapper
//   if (previous !== null) {
    
//     const prevWrapper = wrappers[previous];
//     const prevImg = prevWrapper.querySelector(":scope > img");

//     if (prevImg && prevImg.dataset.original) {
//       prevImg.src = prevImg.dataset.original;
//     }

//     prevWrapper.classList.remove("zoom-active");
//   }

//   const activeWrapper = wrappers[current];
//   const activeImg = activeWrapper.querySelector(":scope > img");

//   if (activeImg && !activeImg.dataset.original) {
//     activeImg.dataset.original = activeImg.src;
//   }

//   activeWrapper.classList.add("zoom-active");
//   startSlider(activeWrapper);

//   previous = current;
//   current = (current + 1) % wrappers.length;
// }

//   function startAutoZoom() {
//     zoomNextImage();
//     zoomInterval = setInterval(zoomNextImage, 10000);
//   }

//   function stopAutoZoom() {
//     clearInterval(zoomInterval);
//     clearInterval(slideInterval);
//   }

//   // ---------------- POPUP ----------------

//   showwrappers.forEach((img, index) => {

//   img.addEventListener("mouseenter", () => {

//     stopAutoZoom(); // stop auto system

//     wrappers.forEach(w => w.classList.remove("zoom-active"));

//     const wrapper = img.closest(".img-wrapper .showimg");
//     console.log(wrapper);
//     const hidden = wrapper.querySelector(".hide-section");

//     if (!hidden) return;

//     popup.classList.add("active");

//     popupImg.src = img.src;
//     popupTitle.textContent =
//       hidden.querySelector("h3")?.textContent || "";
//     popupDesc.textContent =
//       hidden.querySelector("p")?.textContent || "";
//   });

//   img.addEventListener("mouseleave", () => {

//     popup.classList.remove("active");

//     setTimeout(() => {
//       startAutoZoom();
//     }, 6000);

//   });

// });

//   // Start everything
//   startAutoZoom();

// });
