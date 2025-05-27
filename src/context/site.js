export default class Site {
  static menuItems = [
    { label: "HOME", path: "/home" },
    { label: "GUINETIK", path: "/guinetik" },
    { label: "PROJECTS", path: "/projects" },
    { label: "DEMOS", path: "/demos" },
  ];

  static getMenuItems() {
    return this.menuItems;
  }

  // Add other site-wide configs here later
  static title = "GUINETIK TERMINAL";
  static description = "Advanced computational interfaces";
}
