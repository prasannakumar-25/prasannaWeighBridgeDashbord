
export const rootPaths = {
  homeRoot: '',
  vendorRoot:'vendor',
  // machineRoot: "machine",
  // vehicleRoot: 'vehicle',
  // userRoot: 'user',
  pagesRoot: 'pages',
  applicationsRoot: 'applications',
  ecommerceRoot: 'ecommerce',
  authRoot: 'authentication',
  notificationsRoot: 'notifications',
  calendarRoot: 'calendar',
  messageRoot: 'messages',
  errorRoot: 'error',
};

export default {
  home: `/${rootPaths.homeRoot}`,
  vendor: `/${rootPaths.vendorRoot}`,
  // machine: `/${rootPaths.machineRoot}`,
  // vehicle: `/${rootPaths.vehicleRoot}`,
  // user: `/${rootPaths.userRoot}`,
  login: `/${rootPaths.authRoot}/login`,
  signup: `/${rootPaths.authRoot}/sign-up`,
  resetPassword: `/${rootPaths.authRoot}/reset-password`,
  forgotPassword: `/${rootPaths.authRoot}/forgot-password`,
  // ecommerce: `/${rootPaths.ecommerceRoot}/ecommerce1`,
  404: `/${rootPaths.errorRoot}/404`,
};


