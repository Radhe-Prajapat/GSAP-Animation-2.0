/* ==========================================
   EXISTING CURVE + EYE INTERACTION
   ========================================== */

const main = document.querySelector("#main");
const path = document.querySelector("#line");
const eyeTop = document.querySelector("#eyeTop");
const eyeBottom = document.querySelector("#eyeBottom");
const eyeClipPath = document.querySelector("#eyeClipPath");
const pupilGroup = document.querySelector("#pupilGroup");

const initialPath = "M 10 100 Q 500 100 990 100";

const eyeStartX = 360;
const eyeEndX = 640;
const eyeCenterY = 145;
const maxEyeHeight = 55;

main.addEventListener("mousemove", (event) => {
    const rect = main.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const svgX = (x / rect.width) * 1000;
    const svgY = (y / rect.height) * 280;

    const newPath = `M 10 100 Q ${svgX} ${svgY} 990 100`;
    gsap.to(path, {
        attr: { d: newPath },
        duration: 0.45,
        ease: "power3.out",
        overwrite: true
    });

    let openAmount = (svgY - 100) / 140;
    openAmount = gsap.utils.clamp(0, 1, openAmount);
    const eyeHeight = maxEyeHeight * openAmount;

    const topPath = `M ${eyeStartX} ${eyeCenterY} Q 500 ${eyeCenterY - eyeHeight} ${eyeEndX} ${eyeCenterY}`;
    const bottomPath = `M ${eyeStartX} ${eyeCenterY} Q 500 ${eyeCenterY + eyeHeight} ${eyeEndX} ${eyeCenterY}`;
    const clipPath = `M ${eyeStartX} ${eyeCenterY} Q 500 ${eyeCenterY - eyeHeight} ${eyeEndX} ${eyeCenterY} Q 500 ${eyeCenterY + eyeHeight} ${eyeStartX} ${eyeCenterY} Z`;

    gsap.to(eyeTop, {
        attr: { d: topPath },
        duration: 0.3,
        ease: "power3.out",
        overwrite: true
    });
    gsap.to(eyeBottom, {
        attr: { d: bottomPath },
        duration: 0.3,
        ease: "power3.out",
        overwrite: true
    });
    gsap.to(eyeClipPath, {
        attr: { d: clipPath },
        duration: 0.3,
        ease: "power3.out",
        overwrite: true
    });

    const pupilX = (svgX - 500) * 0.08;
    const pupilY = (svgY - eyeCenterY) * 0.06;
    gsap.to(pupilGroup, {
        x: pupilX,
        y: pupilY,
        duration: 0.25,
        ease: "power2.out",
        overwrite: true
    });
});

main.addEventListener("mouseleave", () => {
    gsap.to(path, {
        attr: { d: initialPath },
        duration: 1.4,
        ease: "elastic.out(1, 0.2)"
    });

    const closedTop = `M ${eyeStartX} ${eyeCenterY} Q 500 ${eyeCenterY} ${eyeEndX} ${eyeCenterY}`;
    const closedBottom = `M ${eyeStartX} ${eyeCenterY} Q 500 ${eyeCenterY} ${eyeEndX} ${eyeCenterY}`;
    const closedClip = `M ${eyeStartX} ${eyeCenterY} Q 500 ${eyeCenterY} ${eyeEndX} ${eyeCenterY} Q 500 ${eyeCenterY} ${eyeStartX} ${eyeCenterY} Z`;

    gsap.to(eyeTop, { attr: { d: closedTop }, duration: 0.8, ease: "power3.inOut" });
    gsap.to(eyeBottom, { attr: { d: closedBottom }, duration: 0.8, ease: "power3.inOut" });
    gsap.to(eyeClipPath, { attr: { d: closedClip }, duration: 0.8, ease: "power3.inOut" });
    gsap.to(pupilGroup, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
});


/* ==========================================
   HORROR ANIMATIONS — GSAP
   ========================================== */


/* ---------- BLOOD DRIPPING FROM "HORROR" TEXT ---------- */

// 1. Animate static blood drip shapes sticking under text (viscous swell & stretch)
const staticDrips = document.querySelectorAll(".static-drip");
staticDrips.forEach((drip, index) => {
    gsap.to(drip, {
        scaleY: gsap.utils.random(1.3, 2.2),
        duration: gsap.utils.random(1.8, 3.5),
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: index * 0.3
    });
});

// 2. Dynamic Falling Blood Droplets with GSAP
const bloodDropContainer = document.querySelector("#bloodDropContainer");
const dripXPositions = [25, 60, 85, 120, 150, 185, 218, 250, 285, 320]; // align with letters in HORROR

function spawnBloodDrop() {
    if (!bloodDropContainer) return;

    const drop = document.createElement("div");
    drop.classList.add("blood-drop");

    // Pick a random drip point across HORROR text
    const spawnX = dripXPositions[Math.floor(Math.random() * dripXPositions.length)] + gsap.utils.random(-8, 8);
    drop.style.left = `${spawnX}px`;
    drop.style.top = `0px`;

    bloodDropContainer.appendChild(drop);

    const fallDistance = gsap.utils.random(120, 220);
    const fallDuration = gsap.utils.random(0.9, 1.6);

    const tl = gsap.timeline({
        onComplete: () => drop.remove()
    });

    // Step A: Swell & pull downward like liquid accumulation
    tl.fromTo(drop, 
        { scale: 0.2, scaleY: 0.5, opacity: 0.9 },
        { scale: 1, scaleY: 1.8, scaleX: 0.65, duration: 0.5, ease: "power1.in" }
    )
    // Step B: Detach and fall down quickly
    .to(drop, {
        y: fallDistance,
        scaleY: 2.2,
        scaleX: 0.4,
        duration: fallDuration,
        ease: "power2.in"
    })
    // Step C: Splat / flatten out when landing & fade out
    .to(drop, {
        scaleY: 0.25,
        scaleX: 2.2,
        opacity: 0,
        duration: 0.2,
        ease: "power1.out"
    });
}

// Continuously spawn blood drops at random intervals
function startBloodDripping() {
    spawnBloodDrop();
    const nextInterval = gsap.utils.random(300, 900); // spawn every 0.3s - 0.9s
    setTimeout(startBloodDripping, nextInterval);
}

// Start blood dripping sequence
startBloodDripping();


/* ---------- BATS FLYING ---------- */

function animateBat(selector, delay) {
    const bat = document.querySelector(selector);
    if (!bat) return;

    const tl = gsap.timeline({ repeat: -1, delay: delay });

    // Fly across the screen in a wavy path
    tl.set(bat, { opacity: 0.85, x: -60, y: gsap.utils.random(20, 80) })
      .to(bat, {
          x: window.innerWidth + 100,
          y: gsap.utils.random(-30, 120),
          duration: gsap.utils.random(5, 9),
          ease: "none",
          modifiers: {
              y: function(y) {
                  const progress = this.progress();
                  const wave = Math.sin(progress * Math.PI * gsap.utils.random(3, 6)) * 35;
                  return parseFloat(y) + wave + "px";
              }
          }
      })
      .set(bat, { opacity: 0 })
      .to({}, { duration: gsap.utils.random(2, 6) });

    // Wing flapping
    gsap.to(bat.querySelectorAll(".bat-wing-left"), {
        scaleX: 0.4,
        transformOrigin: "right center",
        duration: 0.15,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
    });

    gsap.to(bat.querySelectorAll(".bat-wing-right"), {
        scaleX: 0.4,
        transformOrigin: "left center",
        duration: 0.15,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
    });
}

animateBat(".bat1", 0);
animateBat(".bat2", 2.5);
animateBat(".bat3", 5);
animateBat(".bat4", 7.5);


/* ---------- SPIDER SWING ---------- */

const spiderThread = document.querySelector("#spiderThread");

if (spiderThread) {
    gsap.from(spiderThread, {
        y: -120,
        duration: 2.5,
        ease: "bounce.out",
        delay: 1
    });

    gsap.to(spiderThread, {
        rotation: 8,
        transformOrigin: "top center",
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 3.5
    });

    const spiderBody = document.querySelector("#spiderSvg");
    if (spiderBody) {
        gsap.to(spiderBody, {
            scale: 1.05,
            transformOrigin: "center center",
            duration: 1.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    }
}


/* ---------- SPIDER WEB SHIMMER ---------- */

document.querySelectorAll(".spider-web").forEach((web, i) => {
    gsap.to(web, {
        opacity: gsap.utils.random(0.3, 0.8),
        duration: gsap.utils.random(3, 6),
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.5
    });
});


/* ---------- FLOATING PARTICLES ---------- */

document.querySelectorAll(".particle").forEach((p) => {
    const startX = gsap.utils.random(-20, 20);
    const startY = gsap.utils.random(-30, 30);

    gsap.to(p, {
        opacity: gsap.utils.random(0.15, 0.5),
        duration: gsap.utils.random(2, 4),
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: gsap.utils.random(0, 3)
    });

    gsap.to(p, {
        x: startX,
        y: startY,
        duration: gsap.utils.random(6, 12),
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: gsap.utils.random(0, 2)
    });
});


/* ---------- SPIDER RED EYES BLINK ---------- */

const spiderEyes = document.querySelectorAll("#spiderSvg circle[fill='#ff0000']");
if (spiderEyes.length) {
    gsap.to(spiderEyes, {
        opacity: 0.1,
        duration: 0.12,
        ease: "power2.in",
        yoyo: true,
        repeat: -1,
        repeatDelay: gsap.utils.random(3, 6),
        stagger: 0.03
    });
}