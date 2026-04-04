// Has to be in the head tag, otherwise a flicker effect will occur.

let toggleTheme = (theme) => {
  if (!theme) {
    theme = document.documentElement.getAttribute("data-theme") || getSystemTheme();
  }
  if (theme == "dark") {
    setTheme("light");
  } else {
    setTheme("dark");
  }
}


let setTheme = (theme, options = {}) =>  {
  const useTransition = options.useTransition !== false;
  const persist = options.persist !== false;
  const applyTheme = () => {
    setHighlight(theme);

    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
    else {
      document.documentElement.removeAttribute("data-theme");
    }
    if (persist) {
      localStorage.setItem("theme", theme);
    }
    
    // Updates the background of medium-zoom overlay.
    if (typeof medium_zoom !== 'undefined') {
      medium_zoom.update({
        background: getComputedStyle(document.documentElement)
            .getPropertyValue('--global-bg-color') + 'ee',  // + 'ee' for trasparency.
      })
    }
  };

  if (useTransition) {
    transTheme();
  }
  applyTheme();
};

let setHighlight = (theme) => {
  if (theme == "dark") {
    document.getElementById("highlight_theme_light").media = "none";
    document.getElementById("highlight_theme_dark").media = "";
  } else {
    document.getElementById("highlight_theme_dark").media = "none";
    document.getElementById("highlight_theme_light").media = "";
  }
}


let transTheme = () => {
  document.documentElement.classList.add("transition");
  window.setTimeout(() => {
    document.documentElement.classList.remove("transition");
  }, 760)
}


let getSystemTheme = () => {
  const userPref = window.matchMedia;
  if (userPref && userPref('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

let initTheme = () => {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("theme");
  } catch (e) {
    savedTheme = null;
  }
  const hasSavedTheme = savedTheme === "light" || savedTheme === "dark";
  const initialTheme = hasSavedTheme ? savedTheme : getSystemTheme();
  setTheme(initialTheme, { useTransition: false, persist: hasSavedTheme });

  // Follow system changes only when user has no explicit saved preference.
  if (hasSavedTheme) return;

  const media = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  if (media && typeof media.addEventListener === 'function') {
    media.addEventListener('change', function (event) {
      setTheme(event.matches ? 'dark' : 'light', { useTransition: false, persist: true });
    });
  } else if (media && typeof media.addListener === 'function') {
    media.addListener(function (event) {
      setTheme(event.matches ? 'dark' : 'light', { useTransition: false, persist: true });
    });
  }
}

initTheme();
