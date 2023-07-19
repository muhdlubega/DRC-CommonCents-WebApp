import { createTheme } from "@mui/material/styles";
import { action, makeObservable, observable } from "mobx";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const themes = {
  light: "light",
  dark: "dark",
};

export class ThemeStore {
  //global theme settings for light/dark mode
  mode = themes.light;
  darkMode: boolean = true;

  constructor() {
    makeObservable(this, {
      mode: observable,
      toggleMode: action,
    });
  }

  toggleMode = () => {
    if (this.mode === themes.dark) {
      this.mode = themes.light;
      this.isDarkModeOn(false);
    } else {
      this.mode = themes.dark;
      this.isDarkModeOn(true);
    }
    return this;
  };

  isDarkModeOn(mode: boolean) {
    this.darkMode = mode;
  }
}

const themeStore = new ThemeStore();

export default themeStore;
