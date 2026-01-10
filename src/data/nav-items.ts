export interface NavItem {
  title: string;
  path: string;
  icon?: string;
  active: boolean;
  collapsible: boolean;
  sublist?: NavItem[];
}

// const role = localStorage.getItem('Role')

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
    icon: 'eos-icons:admin-outlined',
    active: true,
    collapsible: false,
    // sublist: [
      
    //   {
    //     title: 'Users',
    //     path: '#!',
    //     active: false,
    //     collapsible: false,
        
    //   },
    // ],
  },
  {
    title: 'VendorRegister',
    path: '/vendorManagement',
    icon: 'stash:user-shield',
    active: true,
    collapsible: false,
  },
  {
    title: 'MachineRegister',
    path: '/machineManagemant',
    icon: 'fluent-mdl2:connect-virtual-machine',
    active: true,
    collapsible: false,
  },
  // {
  //   title: 'UserRgister',
  //   path: '/userManagement',
  //   icon: 'mdi:user-group-outline',
  //   active: true,
  //   collapsible: false,
  // },
  {
    title: 'CustomerRegister',
    path: '/customerRegister',
    icon: 'heroicons-outline:user-group',
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
    icon: 'icon-park:gate-machine',
    active: true,
    collapsible: false,
  },
];

export default navItems;
























  // {
  //   title: 'Authentication',
  //   path: 'authentication',
  //   icon: 'f7:exclamationmark-shield-fill',
  //   active: true,
  //   collapsible: true,
  //   sublist: [ 
  //     {
  //       title: 'Sign In',
  //       path: 'login',
  //       active: true,
  //       collapsible: false,
  //     },
  //     {
  //       title: 'Sign Up',
  //       path: 'sign-up',
  //       active: true,
  //       collapsible: false,
  //     },
  //     {
  //       title: 'Forgot password',
  //       path: 'forgot-password',
  //       active: true,
  //       collapsible: false,
  //     },
  //     {
  //       title: 'Reset password',
  //       path: 'reset-password',
  //       active: true,
  //       collapsible: false,
  //     },
  //   ],
  // },


    // {
  //   title: 'Ecommerce',
  //   path: 'ecommerce1',
  //   icon: 'tabler:shopping-bag',
  //   active: true,
  //   collapsible: true,
  //   sublist: [
  //     {
  //       title: 'Products',
  //       path: '#!',
  //       active: false,
  //       collapsible: false,
  //       sublist: [
  //         {
  //           title: 'All Products',
  //           path: '#!',
  //           active: false,
  //           collapsible: false,
  //         },
  //         {
  //           title: 'Edit Product',
  //           path: '#!',
  //           active: false,
  //           collapsible: false,
  //         },
  //         {
  //           title: 'New Product',
  //           path: '#!',
  //           active: false,
  //           collapsible: false,
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Orders',
  //       path: 'orders',
  //       active: false,
  //       collapsible: false,
  //       sublist: [
  //         {
  //           title: 'Order List',
  //           path: '#!',
  //           active: false,
  //           collapsible: false,
  //         },
  //         {
  //           title: 'Order Detail',
  //           path: '#!',
  //           active: false,
  //           collapsible: false,
  //         },
  //       ],
  //     },
  //   ],
  // },

  // {
  //   title: 'Notification',
  //   path: '#!',
  //   icon: 'zondicons:notifications',
  //   active: true,
  //   collapsible: true,
  //   sublist: [
  //     {
  //       title: 'VnedorNf',
  //       path: '/',
  //       active: true,
  //       collapsible: false,
  //     },
  //     {
  //       title: 'MachineNf',
  //       path: '/',
  //       active: true,
  //       collapsible: false,
  //     },
  //     {
  //       title: 'CustomerNf',
  //       path: '/',
  //       active: true,
  //       collapsible: false,
  //     },
  //   ]
  // },
  
  // {
  //   title: 'Calendar',
  //   path: '#!',
  //   icon: 'ph:calendar',
  //   active: true,
  //   collapsible: true,
  //   sublist: [
  //     {
  //       title: 'Sign In',
  //       path: '/login',
  //       active: true,
  //       collapsible: false,
  //     },
  //     {
  //       title: 'Sign Up',
  //       path: 'sign-up',
  //       active: true,
  //       collapsible: false,
  //     },
  //     {
  //       title: 'Forgot password',
  //       path: 'forgot-password',
  //       active: true,
  //       collapsible: false,
  //     },
  //   ]
  // },
  // {
  //   title: 'Message',
  //   path: '#!',
  //   icon: 'ph:chat-circle-dots-fill',
  //   active: true,
  //   collapsible: false,
  // },