import { useContext } from 'react';
import { ThemeContext } from '../../redux-contexts/context/ThemeContext';
import { useEffect } from 'react';
export function useTheme() {
  const { setDemoTheme } = useContext(ThemeContext);

  // useEffect(() => {
  //   setDemoTheme(7, 'ltr');
  // }, [setDemoTheme]);

  return { setDemoTheme };
}
