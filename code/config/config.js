let ftpConfig = {
    host: '111.231.239.66',//在线云服务地址
    username: 'root',
    port: 22,
    password: 'mihuid2018',
    localPath: '/Users/alltasxiao/Desktop/项目_组内/设计编译/code_上传到线上/code/data/complie/',//本地上传地址
    remotePath: '/tencent/ftp/pub/show/tosee/code/data/complie/'//线上云服务上传地址
}


//export default config;


module.exports = {
    ftpConfig
}