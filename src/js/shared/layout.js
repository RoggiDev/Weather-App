gsap.registerPlugin(ScrollTrigger);

let lenis;

const initLenis = () => {
  lenis = new Lenis({
    autoRaf: true,
    smooth: true,
    duration: 1.5,
    normalizeScroll: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  ScrollTrigger.refresh();
};

window.addEventListener("load", () => {
  initLenis();
});
