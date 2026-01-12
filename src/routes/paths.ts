
export const rootPaths = {
  authRoot: 'authentication',
  homeRoot: '',
  vendorRoot:'vendorManagement',
  machineRoot: "machineManagemant",
  vehicleRoot: 'vehicleManagement',
  // userRoot: 'userManagement',
  userAdminRoot: "useradminManagement",
  customerRoot: "customerRegister",
  ipCameraRoot: 'ipcameraManage',
  weighbridgeRoot: 'weighbridgeManage',
  pagesRoot: 'pages',
  applicationsRoot: 'applications',
  // ecommerceRoot: 'ecommerce',
  // authRoot: 'authentication',
  notificationsRoot: 'notifications',
  calendarRoot: 'calendar',
  messageRoot: 'messages',
  errorRoot: 'error',
};

export default {
  home: `/${rootPaths.homeRoot}`,
  vendor: `/${rootPaths.vendorRoot}`,
  machine: `/${rootPaths.machineRoot}`,
  vehicle: `/${rootPaths.vehicleRoot}`,
  userAdmin: `/${rootPaths.userAdminRoot}`,
  // user: `/${rootPaths.userRoot}`,
  customer: `/${rootPaths.customerRoot}`,
  ipCamera: `/${rootPaths.ipCameraRoot}`,
  weighbridge: `/${rootPaths.weighbridgeRoot}`, 
  login: `/${rootPaths.authRoot}/login`,
  signup: `/${rootPaths.authRoot}/sign-up`,
  resetPassword: `/${rootPaths.authRoot}/reset-password`,
  forgotPassword: `/${rootPaths.authRoot}/forgot-password`,
  // ecommerce: `/${rootPaths.ecommerceRoot}/ecommerce1`,
  404: `/${rootPaths.errorRoot}/404`,
};


