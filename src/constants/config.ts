const config = {
  baseUrl: import.meta.env.PRODUCTION_HOST ? import.meta.env.PRODUCTION_HOST : 'http://localhost:4000',
  // baseUrl: 'http://localhost:4000',
  maxSizeUploadAvatar: 1048576 // bytes
}

export default config

