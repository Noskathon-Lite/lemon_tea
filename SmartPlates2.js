let slideIndex = 0;
    showSlides();
    
    function showSlides() {
      let slides = document.getElementsByClassName("mySlides1");
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slideIndex++;
      if (slideIndex > slides.length) { slideIndex = 1; }
      slides[slideIndex - 1].style.display = "block";
      setTimeout(showSlides, 5000); // Change image every 5 seconds
    }
    
    function plusSlides(n) {
      slideIndex += n - 1; // Adjust index for manual navigation
      showSlides();
    }