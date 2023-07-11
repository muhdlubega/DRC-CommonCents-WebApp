// import { action, makeObservable, observable } from 'mobx';

// const themes = {
//   light: 'light',
//   dark: 'dark',
// };

// class ThemeStore {
//   mode = themes.light;

//   constructor() {
//     makeObservable(this, {
//         mode: observable,
//         toggleMode: action.bound
//     });
//   }

//   toggleMode = () => {
//     if (this.mode === themes.dark) {
//       this.mode = themes.light;
//     } else {
//       this.mode = themes.dark;
//     }
//     return this;
//   };
// }

import { action, makeObservable, observable } from "mobx";
export const themes = {
  light: "light",
  dark: "dark",
};
export class ThemeStore {
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
