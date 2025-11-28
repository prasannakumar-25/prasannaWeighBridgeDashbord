export interface NavItem {
  title: string;
  path: string;
  icon?: string;
  active: boolean;
  collapsible: boolean;
  sublist?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: 'Home',
    path: '/',
    icon: 'ion:home-sharp',
    active: true,
    collapsible: false,
    sublist: [
      {
        title: 'Dashboard',
        path: '/',
        active: false,
        collapsible: false,
      },
      {
        title: 'Sales',
        path: '/',
        active: false,
        collapsible: false,
      },
    ],
  },
  {
    title: 'Resgister',
    path: 'register',
    icon: 'game-icons:archive-register',
    active: true,
    collapsible: true,
    sublist: [
      {
        title: 'Vendor',
        path: 'vendor',
        active: true,
        collapsible: false,
        sublist: [
          {
            title: 'Overview',
            path: '#!',
            active: false,
            collapsible: false,
          },
          {
            title: 'All Projects',
            path: '#!',
            active: false,
            collapsible: false,
          },
        ],
      },
      {
        title: 'MachineRegister',
        path: '#!',
        active: false,
        collapsible: false,
        sublist: [
          {
            title: 'All Users',
            path: '#!',
            active: false,
            collapsible: false,
          },
          {
            title: 'Add user',
            path: '#!',
            active: false,
            collapsible: false,
          },
        ],
      },
      {
        title: 'Users',
        path: '#!',
        active: false,
        collapsible: false,
        sublist: [
          {
            title: 'Setting',
            path: '#!',
            active: false,
            collapsible: false,
          },
          {
            title: 'Billing',
            path: '#!',
            active: false,
            collapsible: false,
          },
          {
            title: 'Invoice',
            path: '#!',
            active: false,
            collapsible: false,
          },
        ],
      },
      {
        title: 'Projects',
        path: '#!',
        active: false,
        collapsible: false,
        sublist: [
          {
            title: 'Timeline',
            path: '#!',
            active: false,
            collapsible: false,
          },
        ],
      },
    ],
  },
    {
    title: 'Authentication',
    path: 'authentication',
    icon: 'f7:exclamationmark-shield-fill',
    active: true,
    collapsible: true,
    sublist: [ 
      {
        title: 'Sign In',
        path: 'login',
        active: true,
        collapsible: false,
      },
      {
        title: 'Sign Up',
        path: 'sign-up',
        active: true,
        collapsible: false,
      },
      {
        title: 'Forgot password',
        path: 'forgot-password',
        active: true,
        collapsible: false,
      },
      {
        title: 'Reset password',
        path: 'reset-password',
        active: true,
        collapsible: false,
      },
    ],
  },
  {
    title: 'VendorRegister',
    path: '/vendor',
    icon: 'typcn:vendor-android',
    active: true,
    collapsible: false,
  },
  {
    title: 'MachineRegister',
    path: '/machine',
    icon: 'streamline-cyber:virtual-machine-3',
    active: true,
    collapsible: false,
  },
  {
    title: 'UserRgister',
    path: '/user',
    icon: 'mdi:user-group-outline',
    active: true,
    collapsible: false,
  },
  {
    title: 'VehicleRegister',
    path: '/vehicle',
    icon: 'icon-park-solid:engineering-vehicle',
    active: true,
    collapsible: false,
  },
  // {
  //   title: 'Applications',
  //   path: '/dashboard',
  //   icon: 'mingcute:grid-fill',
  //   active: true,
  //   collapsible: true,
  //   sublist: [
  //     {
  //       title: 'Kanban',
  //       path: '#!',
  //       active: false,
  //       collapsible: false,
  //     },
  //     {
  //       title: 'Wizard',
  //       path: '#!',
  //       active: false,
  //       collapsible: false,
  //     },
  //     {
  //       title: 'Data Tables',
  //       path: '#!',
  //       active: false,
  //       collapsible: false,
  //     },
  //     {
  //       title: 'Schedule',
  //       path: '#!',
  //       active: false,
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
  //   collapsible: false,
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
  //   ]
  // },
  // {
  //   title: 'Message',
  //   path: '#!',
  //   icon: 'ph:chat-circle-dots-fill',
  //   active: true,
  //   collapsible: false,
  // },
];

export default navItems;
