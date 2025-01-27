import {
  NavigationMenu,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useLocation } from '@solidjs/router';
import { For } from 'solid-js';

const Navbar = () => {
  const location = useLocation();

  const routes = [
    {
      path: '/',
      name: 'Home',
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
    },
    {
      path: '/settings',
      name: 'Settings',
    },
  ];

  return (
    <NavigationMenu class="w-full flex justify-evenly">
      <For each={routes}>
        {(route) => (
          <NavigationMenuTrigger
            as="a"
            href={route.path}
            class="transition-[box-shadow,background-color] focus-visible:outline-none data-[expanded]:bg-accent rounded-b-none"
            style={
              location.pathname === route.path
                ? {
                    'background-color': '#f0f1f2',
                  }
                : undefined
            }
          >
            <span
              class="text-base/6"
              style={
                location.pathname === route.path
                  ? {
                      // 'text-shadow': '-.06ex 0 0 black',
                      // 'font-weight': 'bold'
                    }
                  : undefined
              }
            >
              {route.name}
            </span>
          </NavigationMenuTrigger>
        )}
      </For>
    </NavigationMenu>
  );
};

export default Navbar;
