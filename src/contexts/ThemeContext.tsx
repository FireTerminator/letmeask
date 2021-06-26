import { createContext, ReactNode, useState, useEffect} from "react";

type Theme = 'light' | 'dark';

type ThemeContextProviderProps = {
  children: ReactNode;
}

type ThemeContextType = {
  theme : Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeContextProvider(props:ThemeContextProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const storagedTheme = localStorage.getItem('theme');
    
    return (storagedTheme ?? 'Light') as Theme;
  });

  useEffect(()=>{
    if(currentTheme === 'dark') {
      document.documentElement.style.setProperty('--background-color', '#2b2b2b');
      document.documentElement.style.setProperty('--text-color', '#FFF');
    }else{
      document.documentElement.style.setProperty('--background-color', '#FFF');
      document.documentElement.style.setProperty('--text-color', '#2b2b2b');
    }
    localStorage.setItem('theme', currentTheme);
  },[currentTheme])

  function toggleTheme() {
    setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
  }

  return(
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme}}>
      {props.children}
    </ThemeContext.Provider>
  )
}