import { useLayoutEffect } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DEFAULT_LOAD_DELAY = 80;
const IN_VIEW_REVEAL_THRESHOLD = 0.86;

function useRevealOnScroll(containerRef, dependency = null) {
  useLayoutEffect(() => {
    const containerNode = containerRef?.current;
    if (!containerNode) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const timerIds = [];
    const trackedNodes = new Set();
    let observer;

    const revealNode = (node) => {
      if (!node || node.dataset.revealed === "true") {
        return;
      }

      node.classList.add("is-revealed");
      node.classList.remove("is-reveal-ready");
      node.dataset.revealed = "true";
      observer?.unobserve(node);
    };

    if (!prefersReducedMotion) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            revealNode(entry.target);
          });
        },
        {
          threshold: 0.14,
          rootMargin: "0px 0px -8% 0px",
        },
      );
    }

    const registerNode = (node) => {
      if (!(node instanceof HTMLElement) || trackedNodes.has(node)) {
        return;
      }

      trackedNodes.add(node);

      if (prefersReducedMotion) {
        revealNode(node);
        return;
      }

      node.classList.add("is-reveal-ready");
      node.classList.remove("is-revealed");
      delete node.dataset.revealed;

      const shouldRevealImmediately =
        node.getBoundingClientRect().top <= window.innerHeight * IN_VIEW_REVEAL_THRESHOLD;
      if (shouldRevealImmediately) {
        const delay = Number.parseInt(node.dataset.revealLoadDelay ?? String(DEFAULT_LOAD_DELAY), 10);
        const timerId = window.setTimeout(() => {
          window.requestAnimationFrame(() => {
            revealNode(node);
          });
        }, Number.isNaN(delay) ? DEFAULT_LOAD_DELAY : delay);
        timerIds.push(timerId);
        return;
      }

      observer?.observe(node);
    };

    const registerTree = (rootNode) => {
      if (!(rootNode instanceof HTMLElement)) {
        return;
      }

      if (rootNode.matches("[data-reveal]")) {
        registerNode(rootNode);
      }

      rootNode.querySelectorAll?.("[data-reveal]").forEach((node) => registerNode(node));
    };

    registerTree(containerNode);

    const mutationObserver = new MutationObserver((mutationList) => {
      mutationList.forEach((mutation) => {
        mutation.addedNodes.forEach((addedNode) => {
          registerTree(addedNode);
        });
      });
    });

    mutationObserver.observe(containerNode, {
      childList: true,
      subtree: true,
    });

    return () => {
      timerIds.forEach((id) => window.clearTimeout(id));
      mutationObserver.disconnect();
      observer?.disconnect();
    };
  }, [containerRef, dependency]);
}

export default useRevealOnScroll;
