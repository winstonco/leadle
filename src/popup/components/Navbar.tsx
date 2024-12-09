import {
  NavigationMenu,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const Navbar = () => {
  return (
    <NavigationMenu class="w-full flex justify-evenly">
      <NavigationMenuTrigger
        as="a"
        href="/"
        class="transition-[box-shadow,background-color] focus-visible:outline-none data-[expanded]:bg-accent"
      >
        Home
      </NavigationMenuTrigger>
      <NavigationMenuTrigger
        as="a"
        href="/leaderboard"
        class="transition-[box-shadow,background-color] focus-visible:outline-none data-[expanded]:bg-accent"
      >
        Leaderboard
      </NavigationMenuTrigger>
      <NavigationMenuTrigger
        as="a"
        href="/settings"
        class="transition-[box-shadow,background-color] focus-visible:outline-none data-[expanded]:bg-accent"
      >
        Settings
      </NavigationMenuTrigger>
    </NavigationMenu>
  );
};

export default Navbar;
