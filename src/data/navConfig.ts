import { NavItem } from "./nav-items";

// ==============================
// ALL Navigation Items
// ==============================
const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: 'ion:home-sharp',
    active: true,
    collapsible: false,
  },
  {
    title: 'UserAdmin',
    path: '/useradminManagement',
    icon: 'game-icons:archive-register',
    active: true,
    collapsible: false,
  },
  {
    title: 'VendorRegister',
    path: '/vendorManagement',
    icon: 'typcn:vendor-android',
    active: true,
    collapsible: false,
  },
  {
    title: 'MachineRegister',
    path: '/machineManagemant',
    icon: 'streamline-cyber:virtual-machine-3',
    active: true,
    collapsible: false,
  },
  {
    title: 'CustomerRegister',
    path: '/customerRegister',
    icon: 'raphael:customer',
    active: true,
    collapsible: false,
  },
  {
    title: 'VehicleRegister',
    path: '/vehicleManagement',
    icon: 'icon-park-solid:engineering-vehicle',
    active: true,
    collapsible: false,
  },
  {
    title: 'IPCamera',
    path: '/ipcameraManage',
    icon: 'cbi:aqara-camera-g5',
    active: true,
    collapsible: false,
  },
  {
    title: 'Weighbridge',
    path: '/weighbridgeManage',
    icon: 'game-icons:weight-scale',
    active: true,
    collapsible: false,
  },
];

// ==============================
// Role Based Menu Restrictions
// ==============================
const ADMIN_HIDDEN_MENUS = [
  'UserAdmin',
  'VendorRegister',
  'MachineRegister',
];

// ==============================
// Role Based Filter Function
// ==============================
const filterNavItemsByRole = (
  items: NavItem[],
  role: string | null
): NavItem[] => {
  // SUPER ADMIN → FULL ACCESS
  if (role === 'SUPER_ADMIN') {
    return items;
  }

  // ADMIN → LIMITED ACCESS
  if (role === 'ADMIN') {
    return items.filter(
      (item) => !ADMIN_HIDDEN_MENUS.includes(item.title)
    );
  }

  // Default fallback
  return items;
};

// ==============================
// Get Role from Local Storage
// ==============================
const role = localStorage.getItem('Role');

// ==============================
// Export Filtered Navigation
// ==============================
const filteredNavItems = filterNavItemsByRole(navItems, role);

export default filteredNavItems;
