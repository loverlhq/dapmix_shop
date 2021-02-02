module.exports = {
    devServer: {
        proxy: 'http://localhost:8080',
        public: '192.168.43.243:8080'
    }
}