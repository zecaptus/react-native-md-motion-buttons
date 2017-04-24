const spawn = require('child_process').spawn;
const cpx = require('cpx');

const script = process.argv[2];
const arg = process.argv[3] || 'Login';

if(script === 'watch') {
    const watcher = cpx.watch('./src/**/*.js', `examples/${arg}/node_modules/${process.env.npm_package_name}/src`);

    watcher.on("watch-ready", () => { console.log('ready')});
    watcher.on("remove", e => { console.log(e.path, '- removed')});
    watcher.on('copy', e => {
        console.log(e.srcPath, ' => ', e.dstPath);
    });

}else {
    let cmd = 'npm';
    let params = ['run', script];

    if (script === 'ios' || script === 'android') {
        cmd = 'react-native';
        params = [`run-${script}`];
    }

    spawn(cmd, params, {cwd: `./examples/${arg}`, stdio: 'inherit'});
}