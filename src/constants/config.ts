const config = {
  baseUrl:  import.meta.env.VITE_PRODUCTION_HOST ? import.meta.env.VITE_PRODUCTION_HOST : 'https://backend-ecommerce-production-eb14.up.railway.app',
  // baseUrl: 'http://localhost:4000',
  maxSizeUploadAvatar: 1048576 // bytes
}

export default config

